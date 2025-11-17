'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

interface SimpleInputBarProps {
  onTransactionAdd: (transaction: any) => void;
}

export default function SimpleInputBar({ onTransactionAdd }: SimpleInputBarProps) {
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
    <div className="fixed inset-x-0 top-1/2 -translate-y-1/2 z-40 px-4">
      {/* GO Text */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-thin tracking-widest go-neon theme-transition">
          GO
        </h1>
      </div>
      
      {/* Input bar */}
      <form onSubmit={handleSubmit} className="relative flex justify-center">
        <div className="relative group w-full max-w-xl sm:max-w-2xl">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Descreva sua transação..."
            className="w-full px-6 sm:px-10 py-4 sm:py-6 bg-card/95 backdrop-blur-lg border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 theme-transition text-foreground placeholder-muted-foreground apple-shadow dark:neon-glow-circular"
            disabled={isLoading}
            style={{
              fontSize: '16px',
              letterSpacing: '0.08em',
              fontWeight: 300,
            }}
          />
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-4 sm:p-5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed theme-transition dark:neon-glow-circular"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
      
      {/* Exemplos rápidos */}
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mt-6 sm:mt-10 opacity-70">
        {[
          'Recebi salário',
          'Conta de luz',
          'Restaurante',
          'Supermercado',
          'Transporte',
          'Lazer',
        ].map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setText(example)}
            className="px-4 sm:px-5 py-2 text-xs text-muted-foreground hover:text-primary theme-transition hover:bg-accent/30 rounded-full"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
