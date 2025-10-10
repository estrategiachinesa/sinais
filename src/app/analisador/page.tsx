'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { AnimatedBackground } from '@/components/app/animated-background';
import { OnlineTraders } from '@/components/app/online-traders';
import { SignalForm } from '@/components/app/signal-form';
import { Button, buttonVariants } from '@/components/ui/button';
import { ExternalLink, Download } from 'lucide-react';
import { generateSimulatedTradingSignal } from '@/ai/flows/generate-simulated-trading-signal';
import { SignalResult } from '@/components/app/signal-result';
import { cn } from '@/lib/utils';

export type FormData = {
  asset: 'EUR/USD' | 'EUR/JPY';
  expirationTime: '1m' | '5m';
};

export type SignalData = {
  asset: 'EUR/USD' | 'EUR/JPY';
  expirationTime: '1m' | '5m';
  signal: 'CALL 🔼' | 'PUT 🔽';
  targetTime: string;
}

type AppState = 'idle' | 'loading' | 'result';

export default function AnalisadorPage() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [signalData, setSignalData] = useState<SignalData | null>(null);

  const [formData, setFormData] = useState<FormData>({
    asset: 'EUR/USD',
    expirationTime: '1m',
  });
  const affiliateLink = 'https://exnova.com/lp/start-trading/?aff=198544&aff_model=revenue&afftrack=';


  const handleAnalyze = async () => {
    setAppState('loading');

    try {
      const expirationMap = { '1m': '1 minute', '5m': '5 minutes' };
      const result = await generateSimulatedTradingSignal({
        expirationTime: expirationMap[formData.expirationTime] as '1 minute' | '5 minutes',
      });
      setSignalData({ ...formData, ...result });
      setAppState('result');
    } catch (error) {
      console.error(error);
      setIsAlertOpen(true);
      setAppState('idle');
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setSignalData(null);
  };

  return (
    <>
      <AnimatedBackground />
      <div className="flex flex-col min-h-screen">
        <header className="p-4 flex justify-center">
          <OnlineTraders />
        </header>

        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg">
             {appState !== 'result' ? (
              <SignalForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleAnalyze}
                isLoading={appState === 'loading'}
              />
             ) : (
              signalData && <SignalResult data={signalData} onReset={handleReset} />
             )}
          </div>
        </main>
        
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Falha ao analisar ❌</AlertDialogTitle>
              <AlertDialogDescription>
                Não encontramos seu cadastro no sistema.
                <br/>
                É preciso se cadastrar e realizar um depósito de qualquer valor para gerar os sinais.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), "bg-blue-600 hover:bg-blue-700")}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Cadastrar agora
                </a>
                 <a href="https://traderchines.github.io/vip/" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), "bg-green-600 hover:bg-green-700")}>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar o indicador
                </a>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <footer className="p-4 text-center text-[0.6rem] text-foreground/30">
          <p>© 2025 Estratégia Chinesa. </p>
          <p>Todos os direitos reservados.</p>
          <p className="max-w-xl mx-auto">Aviso Legal: Todas as estratégias e investimentos envolvem risco de perda. Nenhuma informação contida neste produto deve ser interpretada como uma garantia de resultados.</p>
        </footer>
      </div>
    </>
  );
}
