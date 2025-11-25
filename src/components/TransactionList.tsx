'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@prisma/client';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Tag,
  Pencil,
  Trash2,
} from 'lucide-react';
import TransactionDetailsModal from './TransactionDetailsModal';

interface TransactionListProps {
  transactions: Transaction[];
  onChange?: () => void; // chamado depois de editar/remover com sucesso
}

export default function TransactionList({ transactions, onChange }: TransactionListProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-fade-in {
        opacity: 0;
        animation: fadeIn 0.5s ease-out forwards;
      }
    `;
    if (!document.head.querySelector('style[data-fade-in]')) {
      style.setAttribute('data-fade-in', 'true');
      document.head.appendChild(style);
    }
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = window.confirm('Tem certeza que deseja remover esta transação?');
    if (!ok) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        console.error('Failed to delete transaction');
        return;
      }

      onChange?.();
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  const handleEdit = async (e: React.MouseEvent, transaction: Transaction) => {
    e.preventDefault();
    e.stopPropagation();
    const newDescription = window.prompt(
      'Descrição da transação:',
      transaction.description
    );
    if (newDescription === null) return;

    const newAmountStr = window.prompt(
      'Valor (use vírgula ou ponto para centavos):',
      String(transaction.amount)
    );
    if (newAmountStr === null) return;

    const normalized = newAmountStr.replace(',', '.');
    const newAmount = Number(normalized);
    if (!Number.isFinite(newAmount) || newAmount <= 0) {
      alert('Valor inválido');
      return;
    }

    const newType = window.prompt(
      "Tipo ('receita' ou 'despesa'):",
      transaction.type
    );
    if (newType === null) return;
    const typeTrim = newType.trim().toLowerCase();
    if (typeTrim !== 'receita' && typeTrim !== 'despesa') {
      alert("Tipo inválido. Use 'receita' ou 'despesa'.");
      return;
    }

    const newCategory =
      window.prompt('Categoria:', transaction.category ?? 'outros') ?? 'outros';

    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newDescription,
          amount: newAmount,
          type: typeTrim,
          category: newCategory,
        }),
      });

      if (!res.ok) {
        console.error('Failed to update transaction');
        return;
      }

      onChange?.();
    } catch (err) {
      console.error('Error updating transaction:', err);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 sm:py-12">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          Nenhuma transação registrada ainda
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
          Adicione sua primeira transação usando a barra flutuante
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-4 max-h-[60vh] sm:max-h-96 overflow-y-auto pr-1">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            onClick={() => setSelectedTransaction(transaction)}
            className="bg-card rounded-xl p-3 sm:p-4 border border-border theme-transition hover:shadow-md animate-fade-in cursor-pointer hover:bg-accent/10 group"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeIn 0.5s ease-out forwards',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1.5 sm:mb-2">
                  {transaction.type === 'receita' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm sm:text-base font-medium text-foreground">
                    {transaction.description}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Tag className="w-3 h-3" />
                    <span>{transaction.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end sm:items-center justify-between sm:justify-end gap-3">
                <div
                  className={`text-base sm:text-lg font-bold ${transaction.type === 'receita'
                      ? 'text-green-500'
                      : 'text-red-500'
                    }`}
                >
                  {transaction.type === 'receita' ? '+' : '-'}
                  {formatAmount(transaction.amount)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleEdit(e, transaction)}
                    className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition z-10"
                    title="Editar transação"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, transaction.id)}
                    className="p-2 rounded-full hover:bg-destructive/10 text-destructive transition z-10"
                    title="Excluir transação"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </>
  );
}
