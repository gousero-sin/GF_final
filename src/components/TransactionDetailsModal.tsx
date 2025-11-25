'use client';

import { Transaction } from '@prisma/client';
import { X, Calendar, Tag, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface TransactionDetailsModalProps {
    transaction: Transaction | null;
    onClose: () => void;
}

export default function TransactionDetailsModal({ transaction, onClose }: TransactionDetailsModalProps) {
    if (!transaction) return null;

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Background */}
                <div className={`h-32 w-full ${transaction.type === 'receita'
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/10'
                        : 'bg-gradient-to-br from-red-500/20 to-rose-500/10'
                    } relative`}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-background/50 hover:bg-background/80 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-foreground" />
                    </button>

                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4 border-card ${transaction.type === 'receita' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                            }`}>
                            {transaction.type === 'receita' ? (
                                <TrendingUp className={`w-10 h-10 ${transaction.type === 'receita' ? 'text-green-600 dark:text-green-400' : ''}`} />
                            ) : (
                                <TrendingDown className={`w-10 h-10 ${transaction.type === 'despesa' ? 'text-red-600 dark:text-red-400' : ''}`} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pt-14 pb-8 px-6 text-center space-y-6">
                    <div>
                        <h2 className="text-2xl font-light tracking-wide text-foreground mb-1">
                            {transaction.description}
                        </h2>
                        <p className={`text-3xl font-bold tracking-tight ${transaction.type === 'receita' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                            {transaction.type === 'receita' ? '+' : '-'}{formatAmount(transaction.amount)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-accent/30 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Data</span>
                            <span className="text-sm font-medium">{formatDate(transaction.date)}</span>
                        </div>

                        <div className="bg-accent/30 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2">
                            <Tag className="w-5 h-5 text-primary" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Categoria</span>
                            <span className="text-sm font-medium capitalize">{transaction.category || 'Outros'}</span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            ID: {transaction.id.slice(0, 8)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop click to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
