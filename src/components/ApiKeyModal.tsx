'use client';

import { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff, Save, Check } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentApiKey?: string;
}

export default function ApiKeyModal({ isOpen, onClose, onSave, currentApiKey }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (currentApiKey) {
      setApiKey(currentApiKey);
    }
  }, [currentApiKey]);

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm theme-transition"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative neon-card rounded-3xl p-8 max-w-md w-full theme-transition apple-shadow dark:neon-glow">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground theme-transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <Key className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-thin tracking-wide text-foreground mb-2">
            Configurar API Key
          </h2>
          <p className="text-sm text-muted-foreground font-thin">
            Insira sua API key da DeepSeek
          </p>
        </div>

        {/* API Key Input */}
        <div className="space-y-6">
          <div className="relative">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-primary" />
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="sk-..."
                className="flex-1 bg-transparent border-0 outline-none text-foreground placeholder-muted-foreground font-mono text-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="p-2 text-muted-foreground hover:text-primary theme-transition"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* API Key Preview */}
            {apiKey && (
              <div className="mt-3 p-3 bg-muted rounded-xl">
                <p className="text-xs font-mono text-muted-foreground break-all">
                  {showKey ? apiKey : apiKey.slice(0, 8) + '•'.repeat(Math.max(0, apiKey.length - 8))}
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground space-y-2">
            <p>• A API key é usada para processar transações com IA</p>
            <p>• Ela será armazenada de forma segura no navegador</p>
            <p>• Ctrl+Enter para salvar rapidamente</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 text-muted-foreground hover:text-foreground theme-transition font-thin"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed theme-transition dark:neon-glow font-thin"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Salvo!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}