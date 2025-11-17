import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type RawAIResponse = {
  description?: string;
  amount?: number;
  type?: string;      // 'despesa' | 'receita'
  category?: string;
  date?: string;
};

export async function POST(request: NextRequest) {
  try {
    const { text, userId } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.error('DEEPSEEK_API_KEY não configurada no .env.local');
      return NextResponse.json(
        { error: 'DeepSeek API key not configured' },
        { status: 500 }
      );
    }

    // 1) Garante que existe um usuário para associar a transação
    let finalUserId: string;

    if (userId && typeof userId === 'string') {
      // Se o front passar userId, usamos ele (assumindo que é válido)
      finalUserId = userId;
    } else {
      // Usuário "demo" fixo por e-mail
      const demoEmail = 'demo@gofinance.local';

      const user = await db.user.upsert({
        where: { email: demoEmail },
        update: {},
        create: {
          email: demoEmail,
          name: 'GoFinance Demo User',
        },
      });

      finalUserId = user.id;
    }

    // 2) Chama a DeepSeek para transformar texto em JSON
    const systemPrompt = `
Você é um assistente de finanças pessoais.

Sua única tarefa é converter o texto do usuário em um objeto JSON **válido** (sem comentários, sem texto extra, sem markdown, sem \`\`\`).

O JSON DEVE TER EXATAMENTE estes campos:

{
  "description": "string - descrição curta amigável, ex: Gasto no shopping",
  "amount": 100.5,
  "type": "despesa" ou "receita",
  "category": "lazer" | "alimentacao" | "transporte" | "salario" | "contas" | "mercado" | "outros",
  "date": "YYYY-MM-DD" ou ISO (se o usuário não citar a data, use a data de HOJE"
}

Regras:
- "amount" sempre número positivo (sem sinal negativo).
- Se o usuário GANHOU/RECEBEU algo -> "type": "receita".
- Se o usuário GASTOU/PAGOU algo -> "type": "despesa".
- Se não souber a categoria exata, use "outros".
- Responda **apenas** com JSON válido.
`.trim();

    const dsResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
        max_tokens: 200,
        response_format: { type: 'json_object' },
      }),
    });

    if (!dsResponse.ok) {
      const errorBody = await dsResponse.text().catch(() => '');
      console.error('DeepSeek API error:', dsResponse.status, errorBody);
      return NextResponse.json(
        { error: 'Failed to call DeepSeek API' },
        { status: 500 }
      );
    }

    const dsJson: any = await dsResponse.json();
    const content: string | undefined =
      dsJson?.choices?.[0]?.message?.content;

    if (!content) {
      console.error('DeepSeek empty content:', dsJson);
      return NextResponse.json(
        { error: 'Empty response from DeepSeek' },
        { status: 500 }
      );
    }

    let aiData: RawAIResponse;
    try {
      aiData = JSON.parse(content) as RawAIResponse;
    } catch (err) {
      console.error('Falha ao fazer JSON.parse no retorno da DeepSeek:', content);
      return NextResponse.json(
        { error: 'Invalid JSON from DeepSeek' },
        { status: 500 }
      );
    }

    // 3) Normalizar dados pra bater com seu schema

    const description = aiData.description || text.slice(0, 80);

    const amount = Number(aiData.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'AI did not return a valid positive amount', debug: aiData },
        { status: 500 }
      );
    }

    let rawType = (aiData.type || '').toLowerCase();
    let finalType: 'receita' | 'despesa';

    if (rawType === 'receita' || rawType === 'ganho' || rawType === 'entrada') {
      finalType = 'receita';
    } else if (
      rawType === 'despesa' ||
      rawType === 'gasto' ||
      rawType === 'saida' ||
      rawType === 'saída'
    ) {
      finalType = 'despesa';
    } else {
      const t = text.toLowerCase();
      if (/receb|ganh|salár|bonus|bônus/.test(t)) {
        finalType = 'receita';
      } else {
        finalType = 'despesa';
      }
    }

    const category =
      (aiData.category || 'outros').toString().toLowerCase();

    let date: Date;
    if (aiData.date) {
      const parsed = new Date(aiData.date);
      date = isNaN(parsed.getTime()) ? new Date() : parsed;
    } else {
      date = new Date();
    }

    // 4) Salvar no banco com Prisma
    const transaction = await db.transaction.create({
      data: {
        description,
        amount,
        type: finalType,   // String 'receita' | 'despesa'
        category,
        date,
        userId: finalUserId,
      },
    });

    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    console.error('Transaction processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
