'use client';

import { useState } from 'react';
import {
  HomeIcon,
  ChartIcon,
  UserIcon,
  MoonIcon,
  SunIcon,
  LockIcon,
  LogOut,
} from '@/components/Icons';
import { useAuth } from '@/contexts/AuthContext';
import ApiKeyModal from './ApiKeyModal';

interface NavBarProps {
  currentView: 'home' | 'dashboard';
  onViewChange: (view: 'home' | 'dashboard') => void;
}

export default function NavBar({ currentView, onViewChange }: NavBarProps) {
  const [isDark, setIsDark] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const { logout, deepSeekApiKey, setDeepSeekApiKey } = useAuth();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
  };

  const handleApiKeySave = (apiKey: string) => {
    setDeepSeekApiKey(apiKey);
    setShowApiModal(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 neon-card theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Logo + selo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl sm:text-2xl font-thin tracking-wider text-foreground theme-transition">
                  GoFinance
                </h1>
                <div className="flex items-center space-x-2 live-indicator pl-0 sm:pl-3">
                  <span className="hidden sm:inline text-xs text-muted-foreground font-light">
                    AO VIVO
                  </span>
                  <LockIcon className="w-3 h-3 text-primary" />
                </div>
              </div>
            </div>

            {/* Navegação (funciona em mobile e desktop) */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onViewChange('home')}
                className={`flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-thin tracking-wide theme-transition ${
                  currentView === 'home'
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                }`}
              >
                <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="sm:hidden">Home</span>
                <span className="hidden sm:inline">Início</span>
              </button>

              <button
                onClick={() => onViewChange('dashboard')}
                className={`flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-thin tracking-wide theme-transition ${
                  currentView === 'dashboard'
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                }`}
              >
                <ChartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="sm:hidden">Dash</span>
                <span className="hidden sm:inline">Painel</span>
              </button>
            </div>

            {/* Lado direito */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Tema */}
              <button
                onClick={toggleTheme}
                className="p-3 sm:p-4 rounded-full bg-accent/30 hover:bg-accent/50 theme-transition"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <SunIcon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                ) : (
                  <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                )}
              </button>

              {/* API Key / Perfil */}
              <div className="relative">
                <button
                  onClick={() => setShowApiModal(true)}
                  className="p-3 sm:p-4 rounded-full bg-accent/30 hover:bg-accent/50 theme-transition relative"
                  aria-label="Profile"
                  title={deepSeekApiKey ? 'API Key configurada' : 'Configurar API Key'}
                >
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                  {deepSeekApiKey && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-3 sm:p-4 rounded-full bg-red-500/10 hover:bg-red-500/20 theme-transition"
                aria-label="Logout"
                title="Sair"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <ApiKeyModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSave={handleApiKeySave}
        currentApiKey={deepSeekApiKey || undefined}
      />
    </>
  );
}
