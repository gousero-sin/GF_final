import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type RawTransaction = {
  description?: string;
  amount?: number;
  type?: string;
  category?: string;
  date?: string;
};

type RawAIResponse = {
  transactions: RawTransaction[];
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
      finalUserId = userId;
    } else {
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

    // Data atual em UTC-3 (Brasília)
    const now = new Date();
    const utc3Date = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const todayStr = utc3Date.toISOString().split('T')[0]; // YYYY-MM-DD

    // 2) Chama a DeepSeek para transformar texto em JSON
    const systemPrompt = `
Você é um assistente de finanças pessoais.
Hoje é: ${todayStr} (YYYY-MM-DD).

Sua tarefa é converter o texto do usuário em uma lista de transações JSON **válida**.
O usuário pode informar uma ou várias transações na mesma frase.

O JSON DEVE TER EXATAMENTE este formato:
{
  "transactions": [
    {
      "description": "string - descrição curta",
      "amount": 10.5,
      "type": "despesa" | "receita",
      "category": "lazer" | "alimentacao" | "transporte" | "salario" | "contas" | "mercado" | "outros",
      "date": "YYYY-MM-DD" (se o usuário não citar uma data específica, ou se for "hoje", NÃO envie este campo)
    }
  ]
}

Regras:
- "amount" sempre positivo.
- Identifique se é receita ou despesa pelo contexto.
- Se não souber a categoria, use "outros".
- Responda APENAS o JSON.
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
        max_tokens: 500,
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
    const content: string | undefined = dsJson?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'Empty response from DeepSeek' },
        { status: 500 }
      );
    }

    let aiData: RawAIResponse;
    try {
      aiData = JSON.parse(content) as RawAIResponse;
    } catch (err) {
      console.error('Falha ao fazer JSON.parse:', content);
      return NextResponse.json(
        { error: 'Invalid JSON from DeepSeek' },
        { status: 500 }
      );
    }

    const transactionsToCreate = (aiData.transactions || []).map((t) => {
      const description = t.description || text.slice(0, 80);
      const amount = Number(t.amount);

      let rawType = (t.type || '').toLowerCase();
      let finalType: 'receita' | 'despesa' = 'despesa';

      if (rawType === 'receita' || rawType === 'ganho' || rawType === 'entrada') {
        finalType = 'receita';
      } else if (rawType === 'despesa' || rawType === 'gasto' || rawType === 'saida') {
        finalType = 'despesa';
      } else {
        // Fallback simples se a AI falhar no type, mas geralmente ela acerta
        finalType = 'despesa';
      }

      const category = (t.category || 'outros').toString().toLowerCase();

      let date: Date;
      // Se a data vier preenchida E for diferente de hoje, usamos ela (com hora 12:00)
      // Se não vier, ou se for igual a hoje, usamos new Date() para pegar o momento atual (com hora correta)
      if (t.date && t.date !== todayStr) {
        const parsed = new Date(`${t.date}T12:00:00`);
        date = isNaN(parsed.getTime()) ? new Date() : parsed;
      } else {
        // Data atual (UTC) - O frontend deve converter para o fuso local do usuário ao exibir
        // Se o requisito for salvar JÁ com o deslocamento de -3h (hack), faríamos:
        // date = new Date(new Date().getTime() - 3 * 60 * 60 * 1000);
        // Mas o correto é salvar o timestamp real. Vamos assumir timestamp real.
        date = new Date();
      }

      return {
        description,
        amount: Number.isFinite(amount) ? Math.abs(amount) : 0,
        type: finalType,
        category,
        date,
        userId: finalUserId,
      };
    });

    // Filtra inválidos (amount 0)
    const validTransactions = transactionsToCreate.filter(t => t.amount > 0);

    if (validTransactions.length === 0) {
      return NextResponse.json(
        { error: 'No valid transactions found' },
        { status: 400 }
      );
    }

    // Salva tudo em uma transação do banco
    const createdTransactions = await db.$transaction(
      validTransactions.map((data) => db.transaction.create({ data }))
    );

    return NextResponse.json(createdTransactions, { status: 200 });
  } catch (error) {
    console.error('Transaction processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
