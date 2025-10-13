'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { OnlineTraders } from '@/components/app/online-traders';
import { SignalForm } from '@/components/app/signal-form';
import { Button, buttonVariants } from '@/components/ui/button';
import { ExternalLink, Download, Send } from 'lucide-react';
import { SignalResult } from '@/components/app/signal-result';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { isMarketOpenForAsset } from '@/lib/market-hours';


export type Asset = 
  | 'EUR/USD' | 'EUR/USD (OTC)'
  | 'EUR/JPY' | 'EUR/JPY (OTC)';

export type FormData = {
  asset: Asset;
  expirationTime: '1m' | '5m';
};

export type OperationStatus = 'pending' | 'active' | 'finished';

export type SignalData = {
  asset: Asset;
  expirationTime: '1m' | '5m';
  signal: 'CALL 🔼' | 'PUT 🔽';
  targetTime: string;
  source: 'Aleatório';
  targetDate: Date;
  countdown: number | null;
  operationCountdown: number | null;
  operationStatus: OperationStatus;
};

type AppState = 'idle' | 'loading' | 'result';

// Seeded pseudo-random number generator
function seededRandom(seed: number) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Client-side signal generation
function generateClientSideSignal(expirationTimeLabel: '1 minute' | '5 minutes') {
    const now = new Date();
    let targetTime: Date;

    // Use the current minute as a seed for all users
    const seed = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()).getTime();
    const randomValue = seededRandom(seed);

    if (expirationTimeLabel === '1 minute') {
        const nextMinute = new Date(now);
        nextMinute.setSeconds(0, 0);
        nextMinute.setMinutes(nextMinute.getMinutes() + 1);
        targetTime = nextMinute;
    } else { // 5 minutes
        const minutes = now.getMinutes();
        const remainder = minutes % 5;
        const minutesToAdd = 5 - remainder;
        targetTime = new Date(now.getTime());
        targetTime.setMinutes(minutes + minutesToAdd, 0, 0);
        // If target time is in the past, move to the next 5-minute interval
        if (targetTime.getTime() < now.getTime()) {
            targetTime.setMinutes(targetTime.getMinutes() + 5);
        }
    }

    const targetTimeString = targetTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });

    return {
        signal: (randomValue < 0.5 ? 'CALL 🔼' : 'PUT 🔽') as 'CALL 🔼' | 'PUT 🔽',
        targetTime: targetTimeString,
        source: 'Aleatório' as const,
    };
}


export default function AnalisadorPage() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [signalData, setSignalData] = useState<SignalData | null>(null);
  const { toast } = useToast();
  const [showOTC, setShowOTC] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(true);
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    asset: 'EUR/USD',
    expirationTime: '1m',
  });
  const telegramLink = 'https://t.me/TraderChinesVIP';
  const indicatorLink = 'https://traderchines.github.io/vip/';

  useEffect(() => {
    // Check market status whenever the selected asset changes
    const checkMarketStatus = () => {
        setIsMarketOpen(isMarketOpenForAsset(formData.asset));
    };
    checkMarketStatus();
    // Re-check every 10 seconds
    const interval = setInterval(checkMarketStatus, 10000); 
    return () => clearInterval(interval);
  }, [formData.asset]);

  useEffect(() => {
    const checkAndSetOTC = () => {
      const isEurUsdOpen = isMarketOpenForAsset('EUR/USD');
      const isEurJpyOpen = isMarketOpenForAsset('EUR/JPY');
      if (!isEurUsdOpen && !isEurJpyOpen) {
        setShowOTC(true);
        setFormData(prev => ({ ...prev, asset: 'EUR/USD (OTC)' }));
      }
    };
    
    checkAndSetOTC(); // Check on mount
    const interval = setInterval(checkAndSetOTC, 60000); // Re-check every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (appState === 'result' && signalData) {
      const updateCountdowns = () => {
        setSignalData(prevData => {
          if (!prevData) return null;

          const now = Date.now();
          
          if (prevData.operationStatus === 'pending') {
            const newCountdown = Math.max(0, Math.floor((prevData.targetDate.getTime() - now) / 1000));
            
            if (newCountdown > 0) {
              return { ...prevData, countdown: newCountdown };
            } else {
              // Transition to active
              const operationDuration = prevData.expirationTime === '1m' ? 60 : 300;
              return {
                ...prevData,
                countdown: 0,
                operationStatus: 'active',
                operationCountdown: operationDuration
              };
            }
          }

          if (prevData.operationStatus === 'active') {
              const operationDuration = prevData.expirationTime === '1m' ? 60 : 300;
              const operationEndTime = prevData.targetDate.getTime() + (operationDuration * 1000);
              const newOperationCountdown = Math.max(0, Math.floor((operationEndTime - now) / 1000));

              if (newOperationCountdown > 0) {
                  return { ...prevData, operationCountdown: newOperationCountdown };
              } else {
                  // Transition to finished
                  return { ...prevData, operationCountdown: 0, operationStatus: 'finished' };
              }
          }

          return prevData;
        });
      };
      
      updateCountdowns(); 
      
      timer = setInterval(updateCountdowns, 1000);

    }
    return () => clearInterval(timer);
  }, [appState, signalData?.operationStatus]);


 const handleAnalyze = async () => {
    const today = new Date().toDateString();
    const lastSignalDate = localStorage.getItem('ultimoSinal');

    if (lastSignalDate === today) {
      setShowLimitDialog(true);
      return;
    }
    
    setAppState('loading');
    const expirationTimeLabel = formData.expirationTime === '1m' ? '1 minute' : '5 minutes';
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = generateClientSideSignal(expirationTimeLabel);
    
    const [hours, minutes] = result.targetTime.split(':');
    let targetDate = new Date();
    targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    // Handle case where target time is in the past (e.g., just after midnight)
    if (targetDate.getTime() < Date.now()) {
        targetDate.setDate(targetDate.getDate() + 1);
    }
    
    setSignalData({
      ...formData,
      signal: result.signal,
      targetTime: result.targetTime,
      source: result.source,
      targetDate: targetDate,
      countdown: null,
      operationCountdown: null,
      operationStatus: 'pending'
    });

    localStorage.setItem('ultimoSinal', today);
    setAppState('result');
  };

  const handleReset = () => {
    setAppState('idle');
    setSignalData(null);
  };

  return (
    <>
      <div className="fixed inset-0 -z-10 h-full w-full bg-background"></div>
      <div className="flex flex-col min-h-screen">
        <header className="p-4 flex justify-center">
          <OnlineTraders />
        </header>

        <main className="flex-grow flex flex-col items-center justify-center p-4 space-y-6">
          {appState === 'result' && (
             <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                    ESTRATÉGIA<br />CHINESA
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
                showOTC={showOTC}
                setShowOTC={setShowOTC}
                isMarketOpen={isMarketOpen}
              />
             ) : (
              signalData && <SignalResult data={signalData} onReset={handleReset} />
             )}
          </div>
           <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'flex flex-col h-auto items-center text-foreground/80 hover:text-foreground transition-colors'
            )}
          >
            <Send className="h-8 w-8" />
            <span className="text-xs mt-1">Canal do Telegram</span>
          </a>
        </main>
        
        <footer className="p-4 text-center text-[0.6rem] text-foreground/30">
          <p>© 2025 Estratégia Chinesa. </p>
          <p>Todos os direitos reservados.</p>
          <p className="max-w-xl mx-auto">Aviso Legal: Todas as estratégias e investimentos envolvem risco de perda. Nenhuma informação contida neste produto deve ser interpretada como uma garantia de resultados.</p>
        </footer>
      </div>

       <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limite diário atingido</AlertDialogTitle>
            <AlertDialogDescription>
              Você já recebeu o sinal gratuito de hoje. Volte amanhã ou ative o Indicador da Estratégia Chinesa para ter acesso ilimitado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
            <AlertDialogAction asChild>
                <a href={indicatorLink} target="_blank" rel="noopener noreferrer">
                    Quero o Indicador
                </a>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
