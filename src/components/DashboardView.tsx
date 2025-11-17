'use client';

import { Transaction } from '@prisma/client';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
} from 'lucide-react';
import TransactionList from '@/components/TransactionList';

interface Summary {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  gastosPorCategoria: Record<string, number>;
  transacoesPorMes: Record<string, number>;
}

interface DashboardViewProps {
  transactions: Transaction[];
  summary: Summary | null;
  onDataChange?: () => void; // será chamado após editar/remover
}

export default function DashboardView({
  transactions,
  summary,
  onDataChange,
}: DashboardViewProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const getCategoryData = () => {
    if (!summary?.gastosPorCategoria || !summary.totalDespesas) return [];

    return Object.entries(summary.gastosPorCategoria).map(
      ([category, amount]) => ({
        category,
        amount: amount as number,
        percentage: ((amount as number) / summary.totalDespesas) * 100,
      })
    );
  };

  const categoryData = getCategoryData();

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="neon-card rounded-2xl p-6 md:p-8 theme-transition apple-shadow dark:neon-glow">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-xs md:text-sm font-thin tracking-wide text-muted-foreground mb-1.5 md:mb-2">
            Receitas
          </h3>
          <p className="text-2xl md:text-3xl font-thin text-green-600 dark:text-green-400">
            {formatAmount(summary?.totalReceitas ?? 0)}
          </p>
        </div>

        <div className="neon-card rounded-2xl p-6 md:p-8 theme-transition apple-shadow dark:neon-glow">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-2xl">
              <TrendingDown className="w-6 h-6 md:w-7 md:h-7 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h3 className="text-xs md:text-sm font-thin tracking-wide text-muted-foreground mb-1.5 md:mb-2">
            Despesas
          </h3>
          <p className="text-2xl md:text-3xl font-thin text-red-600 dark:text-red-400">
            {formatAmount(summary?.totalDespesas ?? 0)}
          </p>
        </div>

        <div className="neon-card rounded-2xl p-6 md:p-8 theme-transition apple-shadow dark:neon-glow">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <DollarSign className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            </div>
          </div>
          <h3 className="text-xs md:text-sm font-thin tracking-wide text-muted-foreground mb-1.5 md:mb-2">
            Saldo
          </h3>
          <p
            className={`text-2xl md:text-3xl font-thin ${
              (summary?.saldo ?? 0) >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {formatAmount(summary?.saldo ?? 0)}
          </p>
        </div>
      </div>

      {/* Gráficos + Transações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Categorias */}
        <div className="neon-card rounded-2xl p-6 md:p-8 theme-transition apple-shadow dark:neon-glow">
          <div className="flex items-center space-x-3 mb-6 md:mb-8">
            <PieChart className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            <h3 className="text-lg md:text-xl font-thin tracking-wide text-foreground live-indicator">
              Gastos por Categoria
            </h3>
          </div>

          {categoryData.length > 0 ? (
            <div className="space-y-4 md:space-y-6">
              {categoryData.map((item, index) => (
                <div key={item.category} className="space-y-2 md:space-y-3">
                  <div className="flex justify-between text-xs md:text-sm font-thin tracking-wide">
                    <span className="text-foreground capitalize">
                      {item.category}
                    </span>
                    <span className="text-muted-foreground">
                      {formatAmount(item.amount)} ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 md:h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full theme-transition"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: `hsl(${
                          330 + index * 15
                        }, 100%, ${50 + index * 5}%)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10 md:py-12 text-sm md:text-base font-thin">
              Nenhuma despesa categorizada ainda
            </p>
          )}
        </div>

        {/* Transações ao Vivo */}
        <div className="neon-card rounded-2xl p-6 md:p-8 theme-transition apple-shadow dark:neon-glow">
          <div className="flex items-center space-x-3 mb-6 md:mb-8">
            <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            <h3 className="text-lg md:text-xl font-thin tracking-wide text-foreground live-indicator">
              Transações ao Vivo
            </h3>
          </div>

          <TransactionList
            transactions={transactions}
            onChange={onDataChange}
          />
        </div>
      </div>
    </div>
  );
}
