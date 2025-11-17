'use client';

import { useState } from 'react';
import { HomeIcon, ChartIcon, UserIcon, MoonIcon, SunIcon, LockIcon, LogOut } from '@/components/Icons';
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
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo with security seal */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-thin tracking-wider text-foreground theme-transition">
                  GoFinance
                </h1>
                <div className="flex items-center space-x-2 live-indicator pl-3">
                  <span className="text-xs text-muted-foreground font-light">AO VIVO</span>
                  <LockIcon className="w-3 h-3 text-primary" />
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => onViewChange('home')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-full text-sm font-thin tracking-wide theme-transition ${
                  currentView === 'home'
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                }`}
              >
                <HomeIcon />
                <span>Início</span>
              </button>
              
              <button
                onClick={() => onViewChange('dashboard')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-full text-sm font-thin tracking-wide theme-transition ${
                  currentView === 'dashboard'
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                }`}
              >
                <ChartIcon />
                <span>Painel</span>
              </button>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-4 rounded-full bg-accent/30 hover:bg-accent/50 theme-transition"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5 text-foreground" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-foreground" />
                )}
              </button>

              {/* Profile/Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowApiModal(true)}
                  className="p-4 rounded-full bg-accent/30 hover:bg-accent/50 theme-transition relative"
                  aria-label="Profile"
                  title={deepSeekApiKey ? "API Key configurada" : "Configurar API Key"}
                >
                  <UserIcon className="w-5 h-5 text-foreground" />
                  {deepSeekApiKey && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-4 rounded-full bg-red-500/10 hover:bg-red-500/20 theme-transition"
                aria-label="Logout"
                title="Sair"
              >
                <LogOut className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSave={handleApiKeySave}
        currentApiKey={deepSeekApiKey || undefined}
      />
    </>
  );
}