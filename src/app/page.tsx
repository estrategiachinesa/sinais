'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateSimulatedTradingSignal } from '@/ai/flows/generate-simulated-trading-signal';
import type { SimulatedTradingSignalOutput } from '@/ai/flows/generate-simulated-trading-signal';

import { AnimatedBackground } from '@/components/app/animated-background';
import { OnlineTraders } from '@/components/app/online-traders';
import { SignalForm } from '@/components/app/signal-form';
import { SignalResult } from '@/components/app/signal-result';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

export type FormData = {
  asset: string;
  expirationTime: '1m' | '5m';
};

export type SignalData = FormData & SimulatedTradingSignalOutput;

type AppState = 'idle' | 'loading';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [isResultOpen, setIsResultOpen] = useState(false);
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

    const minLoadingTimePromise = new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const [signalResult] = await Promise.all([analysisPromise, minLoadingTimePromise]);

      if (signalResult) {
        setSignalData({ ...formData, ...signalResult });
        setIsResultOpen(true);
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
    } finally {
      setAppState('idle');
    }
  };

  const handleReset = () => {
    setIsResultOpen(false);
    // Delay setting signalData to null to allow for exit animation
    setTimeout(() => setSignalData(null), 300);
  };

  return (
    <>
      <AnimatedBackground />
      <div className="flex flex-col min-h-screen">
        <header className="p-4 flex justify-end">
          <OnlineTraders />
        </header>

        <main className="flex-grow flex items-center justify-center p-4">
          <SignalForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleAnalyze}
            isLoading={appState === 'loading'}
          />
        </main>
        
        <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
          <DialogContent className="bg-transparent border-0 shadow-none p-0 max-w-md w-full">
            {signalData && <SignalResult data={signalData} onReset={handleReset} />}
          </DialogContent>
        </Dialog>

        <footer className="p-4 text-center text-xs text-muted-foreground">
          <p>
            Os sinais exibidos são gerados automaticamente para fins ilustrativos. Faça sua própria análise.
          </p>
        </footer>
      </div>
    </>
  );
}
