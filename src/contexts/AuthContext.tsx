'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  apiKey: string | null;
  deepSeekApiKey: string | null;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  setDeepSeekApiKey: (apiKey: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [deepSeekApiKey, setDeepSeekApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const storedApiKey = localStorage.getItem('go_api_key');
    const storedAuth = localStorage.getItem('go_authenticated');
    const storedDeepSeekKey = localStorage.getItem('go_deepseek_api_key');
    
    if (storedApiKey && storedAuth === 'true') {
      setApiKey(storedApiKey);
      setIsAuthenticated(true);
    }
    
    if (storedDeepSeekKey) {
      setDeepSeekApiKey(storedDeepSeekKey);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (pin: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call to validate PIN and get API key
      // In a real app, this would call your authentication API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        throw new Error('Invalid PIN');
      }

      const data = await response.json();
      
      if (data.success && data.apiKey) {
        setApiKey(data.apiKey);
        setIsAuthenticated(true);
        localStorage.setItem('go_api_key', data.apiKey);
        localStorage.setItem('go_authenticated', 'true');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setApiKey(null);
    localStorage.removeItem('go_api_key');
    localStorage.removeItem('go_authenticated');
  };

  const setDeepSeekApiKeyHandler = (newApiKey: string) => {
    setDeepSeekApiKey(newApiKey);
    localStorage.setItem('go_deepseek_api_key', newApiKey);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      apiKey,
      deepSeekApiKey,
      login,
      logout,
      setDeepSeekApiKey: setDeepSeekApiKeyHandler
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}