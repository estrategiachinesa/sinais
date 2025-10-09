'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateSimulatedTradingSignal, type SimulatedTradingSignalOutput } from '@/ai/flows/generate-simulated-trading-signal';

import { AnimatedBackground } from '@/components/app/animated-background';
import { OnlineTraders } from '@/components/app/online-traders';
import { SignalForm } from '@/components/app/signal-form';
import { LoadingAnalysis } from '@/components/app/loading-analysis';
import { SignalResult } from '@/components/app/signal-result';

export type FormData = {
  asset: string;
  expirationTime: '1m' | '5m';
};

export type SignalData = FormData & SimulatedTradingSignalOutput;

type AppState = 'form' | 'loading' | 'result';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('form');
  const [formData, setFormData] = useState<FormData>({
    asset: 'EUR/USD',
    expirationTime: '1m',
  });
  const [signalData, setSignalData] = useState<SignalData | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setAppState('loading');

    const analysisPromise = generateSimulatedTradingSignal({
        expirationTime: formData.expirationTime === '1m' ? '1 minute' : '5 minutes',
    });

    // Enforce a minimum loading time for better UX
    const minLoadingTimePromise = new Promise(resolve => setTimeout(resolve, 3000));

    try {
        const [signalResult] = await Promise.all([analysisPromise, minLoadingTimePromise]);
        
        if (signalResult) {
            setSignalData({ ...formData, ...signalResult });
            setAppState('result');
        } else {
            throw new Error('Não foi possível gerar o sinal.');
        }

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro na Análise',
        description: 'Ocorreu um problema ao gerar o sinal. Tente novamente.',
      });
      setAppState('form');
    }
  };

  const handleReset = () => {
    setAppState('form');
    setSignalData(null);
  };
  
  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <LoadingAnalysis />;
      case 'result':
        return signalData && <SignalResult data={signalData} onReset={handleReset} />;
      case 'form':
      default:
        return (
          <SignalForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleAnalyze}
            isLoading={appState === 'loading'}
          />
        );
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="flex flex-col min-h-screen">
        <header className="p-4 flex justify-end">
          <OnlineTraders />
        </header>

        <main className="flex-grow flex items-center justify-center p-4">
          {renderContent()}
        </main>

        <footer className="p-4 text-center text-xs text-muted-foreground">
          <p>
            Os sinais exibidos são gerados automaticamente para fins ilustrativos. Faça sua própria análise.
          </p>
        </footer>
      </div>
    </>
  );
}
