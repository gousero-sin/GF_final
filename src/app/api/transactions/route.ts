import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Atualizar transação
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { description, amount, type, category, date } = body;

    const data: any = {};

    if (description !== undefined) data.description = description;
    if (amount !== undefined) data.amount = Number(amount);
    if (type !== undefined) data.type = type; // 'receita' | 'despesa'
    if (category !== undefined) data.category = category;
    if (date !== undefined) data.date = new Date(date);

    const updated = await db.transaction.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// Remover transação
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.transaction.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
