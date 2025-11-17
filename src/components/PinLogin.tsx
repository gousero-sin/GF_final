'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PinLoginProps {
  onLogin: (pin: string) => void;
  isLoading?: boolean;
}

export default function PinLogin({ onLogin, isLoading = false }: PinLoginProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');

  const handlePinChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setPin(numericValue);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) {
      onLogin(pin);
    } else {
      setError('PIN deve ter 4 dígitos');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-background theme-transition flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        {/* Logo and title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-thin tracking-widest go-neon mb-4">
            GO
          </h1>
          <p className="text-sm text-muted-foreground font-thin tracking-wide">
            Insira seu PIN de acesso
          </p>
        </div>

        {/* PIN Input Card */}
        <div className="neon-card rounded-3xl p-8 theme-transition apple-shadow dark:neon-glow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PIN Input */}
            <div className="relative">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-primary" />
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="••••"
                  className="flex-1 bg-transparent border-0 outline-none text-2xl font-thin tracking-widest text-foreground placeholder-muted-foreground"
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="p-2 text-muted-foreground hover:text-primary theme-transition"
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* PIN Display Dots */}
              <div className="flex justify-center space-x-3 mt-6">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full theme-transition ${
                      pin[index] ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center text-sm text-red-500 font-thin">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={pin.length !== 4 || isLoading}
              className="w-full py-4 bg-primary text-primary-foreground rounded-full font-thin tracking-wide theme-transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed dark:neon-glow"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                'Acessar'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground font-thin">
            GoFinance • Neo-Chinese Neon Aesthetic
          </p>
        </div>
      </div>
    </div>
  );
}