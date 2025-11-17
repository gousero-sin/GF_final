import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Também ignoramos userId e calculamos com base em TODAS as transações
    const transactions = await db.transaction.findMany();

    let totalReceitas = 0;
    let totalDespesas = 0;
    const gastosPorCategoria: Record<string, number> = {};
    const transacoesPorMes: Record<string, number> = {};

    for (const t of transactions) {
      const amount = Number(t.amount) || 0;
      const tipo = t.type?.toLowerCase();

      if (tipo === 'receita') {
        totalReceitas += amount;
      } else if (tipo === 'despesa') {
        totalDespesas += amount;

        const cat = (t.category || 'outros').toLowerCase();
        gastosPorCategoria[cat] = (gastosPorCategoria[cat] || 0) + amount;
      }

      const d = new Date(t.date);
      if (!Number.isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(
          d.getMonth() + 1
        ).padStart(2, '0')}`;

        // aqui estou contando nº de transações por mês;
        // se depois você quiser somar valores, é só trocar para "+= amount"
        transacoesPorMes[key] = (transacoesPorMes[key] || 0) + 1;
      }
    }

    const saldo = totalReceitas - totalDespesas;

    return NextResponse.json(
      {
        totalReceitas,
        totalDespesas,
        saldo,
        gastosPorCategoria,
        transacoesPorMes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    );
  }
}
