'use client';

import { useState } from 'react';
import { Send, Plus } from 'lucide-react';

interface NLPInputBarProps {
  onTransactionAdd: (transaction: any) => void;
}

export default function NLPInputBar({ onTransactionAdd }: NLPInputBarProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/process-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to process transaction');
      }

      const transaction = await response.json();
      onTransactionAdd(transaction);
      setText('');
    } catch (error) {
      console.error('Error processing transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-2xl px-4">
      <div className="bg-card rounded-2xl p-6 theme-transition apple-shadow dark:jelly-glow">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2 theme-transition">
            GoFinance
          </h2>
          <p className="text-muted-foreground theme-transition">
            Descreva sua transação em linguagem natural
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ex: 'Gastei 50 reais no restaurante hoje'..."
              className="w-full px-4 py-4 pr-12 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent theme-transition text-foreground placeholder-muted-foreground"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!text.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed theme-transition"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-xs text-muted-foreground">Exemplos rápidos:</span>
            {[
              'Recebi 1000 de salário',
              'Gastei 200 no supermercado',
              'Paguei 80 de conta de luz'
            ].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setText(example)}
                className="px-3 py-1 bg-accent hover:bg-accent/80 rounded-full text-xs text-foreground theme-transition"
              >
                {example}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}