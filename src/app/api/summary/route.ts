import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const demoEmail = 'demo@gofinance.local';

    const user = await db.user.findUnique({
      where: { email: demoEmail },
    });

    if (!user) {
      return NextResponse.json({
        totalReceitas: 0,
        totalDespesas: 0,
        saldo: 0,
        gastosPorCategoria: {},
        transacoesPorMes: {},
      });
    }

    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
    });

    const totalReceitas = transactions
      .filter((t) => t.type === 'receita')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalDespesas = transactions
      .filter((t) => t.type === 'despesa')
      .reduce((acc, t) => acc + t.amount, 0);

    const saldo = totalReceitas - totalDespesas;

    const gastosPorCategoria: Record<string, number> = {};
    const transacoesPorMes: Record<string, number> = {};

    for (const t of transactions) {
      if (t.type === 'despesa') {
        gastosPorCategoria[t.category || 'outros'] =
          (gastosPorCategoria[t.category || 'outros'] || 0) + t.amount;
      }

      const key = `${t.date.getFullYear()}-${String(
        t.date.getMonth() + 1,
      ).padStart(2, '0')}`;

      transacoesPorMes[key] = (transacoesPorMes[key] || 0) + 1;
    }

    return NextResponse.json({
      totalReceitas,
      totalDespesas,
      saldo,
      gastosPorCategoria,
      transacoesPorMes,
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
