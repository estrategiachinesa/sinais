'use client';

import { useState, useEffect } from 'react';
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
import { ExternalLink, Download, Send } from 'lucide-react';
import { SignalResult } from '@/components/app/signal-result';
import { cn } from '@/lib/utils';

export type FormData = {
  asset: 'EUR/USD' | 'EUR/JPY';
  expirationTime: '1m' | '5m';
};

export type OperationStatus = 'pending' | 'active' | 'finished';

export type SignalData = {
  asset: 'EUR/USD' | 'EUR/JPY';
  expirationTime: '1m' | '5m';
  signal: 'CALL 🔼' | 'PUT 🔽';
  targetTime: string;
  countdown: number | null;
  operationCountdown: number | null;
  operationStatus: OperationStatus;
};

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
  const telegramLink = 'https://t.me/TraderChinesVIP';

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (appState === 'result' && signalData) {
      // First countdown (until operation starts)
      if (signalData.operationStatus === 'pending' && signalData.countdown !== null && signalData.countdown > 0) {
        timer = setInterval(() => {
          setSignalData(prevData => {
            if (prevData && prevData.countdown !== null && prevData.countdown > 1) {
              return { ...prevData, countdown: prevData.countdown - 1 };
            }
            if (prevData && prevData.countdown !== null && prevData.countdown <= 1) {
              clearInterval(timer);
              const operationDuration = prevData.expirationTime === '1m' ? 60 : 300;
              return { 
                ...prevData, 
                countdown: 0, 
                operationStatus: 'active',
                operationCountdown: operationDuration
              };
            }
            return prevData;
          });
        }, 1000);
      }
      // Second countdown (operation duration)
      else if (signalData.operationStatus === 'active' && signalData.operationCountdown !== null && signalData.operationCountdown > 0) {
        timer = setInterval(() => {
            setSignalData(prevData => {
                if(prevData && prevData.operationCountdown !== null && prevData.operationCountdown > 1) {
                    return { ...prevData, operationCountdown: prevData.operationCountdown - 1};
                }
                if (prevData && prevData.operationCountdown !== null && prevData.operationCountdown <= 1) {
                    clearInterval(timer);
                    return { ...prevData, operationCountdown: 0, operationStatus: 'finished' };
                }
                return prevData;
            })
        }, 1000);
      }
    }
    return () => clearInterval(timer);
  }, [appState, signalData]);


  const handleAnalyze = async () => {
    setAppState('loading');

    setTimeout(() => {
      const now = new Date();
      let targetDate = new Date(now.getTime());

      if (formData.expirationTime === '1m') {
        targetDate.setMinutes(now.getMinutes() + 1, 0, 0);
      } else { // 5m
        const minutes = now.getMinutes();
        const remainder = minutes % 5;
        const minutesToAdd = 5 - remainder;
        targetDate.setMinutes(minutes + minutesToAdd, 0, 0);
      }

      const targetTimeString = targetDate.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });

      const randomSignal = Math.random() < 0.5 ? 'CALL 🔼' : 'PUT 🔽';
      
      const countdown = Math.max(0, Math.floor((targetDate.getTime() - Date.now()) / 1000));
      
      setSignalData({
        ...formData,
        signal: randomSignal,
        targetTime: targetTimeString,
        countdown: countdown,
        operationCountdown: null,
        operationStatus: 'pending'
      });

      setAppState('result');
    }, 3000);
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

        <main className="flex-grow flex flex-col items-center justify-center p-4 space-y-6">
          {appState === 'result' && (
             <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                    ESTRATÉGIA CHINESA<br />VIP
                </h1>
             </div>
          )}
          <div className="w-full max-w-md bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg p-8">
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
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-foreground/80 hover:text-foreground transition-colors"
          >
            <Send className="h-8 w-8" />
            <span className="text-xs mt-1">Canal do Telegram</span>
          </a>
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
