'use client';

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import SimpleInputBar from '@/components/SimpleInputBar';
import PinLogin from '@/components/PinLogin';
import LoadingScreen from '@/components/LoadingScreen';
import DashboardView from '@/components/DashboardView';
import { Transaction } from '@prisma/client';

interface Summary {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  gastosPorCategoria: Record<string, number>;
  transacoesPorMes: Record<string, number>;
}

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isLoading: authLoading, login, apiKey } = useAuth();

  useEffect(() => {
    if (isAuthenticated && apiKey) {
      fetchData();
    } else {
      setTransactions([]);
      setSummary(null);
    }
  }, [isAuthenticated, apiKey]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [transactionsResponse, summaryResponse] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/summary')
      ]);

      if (transactionsResponse.ok) {
        const data = await transactionsResponse.json();
        // Convert date strings to Date objects
        const parsedTransactions = data.map((t: any) => ({
          ...t,
          date: new Date(t.date),
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        }));
        setTransactions(parsedTransactions);
      }

      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        setSummary(summaryData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionAdd = (newTransactions: any[]) => {
    // Convert dates for new transactions
    const parsedNew = newTransactions.map((t: any) => ({
      ...t,
      date: new Date(t.date),
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    }));

    setTransactions(prev => [...parsedNew, ...prev]);
    fetchData(); // Refresh summary data
  };

  const handleLogin = async (pin: string) => {
    const success = await login(pin);
    if (!success) {
      // Error handling is done in PinLogin component
      return false;
    }
    return true;
  };

  // Show loading screen during authentication check
  if (authLoading) {
    return <LoadingScreen message="Verificando autenticação..." />;
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <PinLogin onLogin={handleLogin} isLoading={authLoading} />;
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-background theme-transition">
      <NavBar currentView={currentView} onViewChange={setCurrentView} />

      <main className="pt-20">
        {currentView === 'home' ? (
          <div className="relative min-h-screen">
            {/* Minimalist background with intentional negative space */}
            <div className="absolute inset-0" />

            {/* Simple floating input bar with GO text */}
            <SimpleInputBar onTransactionAdd={handleTransactionAdd} />
          </div>
        ) : (
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-thin tracking-wide text-foreground mb-2">
                  Painel Financeiro
                </h1>
                <p className="text-muted-foreground">
                  Visualize seus dados financeiros em tempo real
                </p>
              </div>
              {isLoading ? (
                <LoadingScreen message="Carregando dados..." />
              ) : (
                <DashboardView transactions={transactions} summary={summary} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}