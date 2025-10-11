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
import { generateSimulatedTradingSignal, type SimulatedTradingSignalOutput } from '@/ai/flows/generate-simulated-trading-signal';
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
  source: 'IA' | 'Aleatório';
  countdown: number | null;
  operationCountdown: number | null;
  operationStatus: OperationStatus;
};

type AppState = 'idle' | 'loading' | 'result';

export default function AnalisadorPage() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [signalData, setSignalData] = useState<SignalData | null>(null);
  const { toast } = useToast();
  const [showOTC, setShowOTC] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    asset: 'EUR/USD',
    expirationTime: '1m',
  });
  const telegramLink = 'https://t.me/TraderChinesVIP';

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
    const expirationTimeLabel = formData.expirationTime === '1m' ? '1 minute' : '5 minutes';
    
    let result: Omit<SimulatedTradingSignalOutput, 'source'> & { source: 'IA' | 'Aleatório' };

    try {
        result = await generateSimulatedTradingSignal({ 
          asset: formData.asset,
          expirationTime: expirationTimeLabel 
        });
    } catch (error) {
        console.error("AI signal generation failed, using fallback.", error);

        // Fallback to random signal generation
        const now = new Date();
        let targetTime: Date;

        if (expirationTimeLabel === '1 minute') {
            targetTime = new Date(now.getTime());
            targetTime.setMinutes(now.getMinutes() + 1, 0, 0);
        } else { // 5 minutes
            const minutes = now.getMinutes();
            const remainder = minutes % 5;
            const minutesToAdd = 5 - remainder;
            targetTime = new Date(now.getTime());
            targetTime.setMinutes(minutes + minutesToAdd, 0, 0);
        }

        const targetTimeString = targetTime.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
        });

        result = {
            signal: Math.random() < 0.5 ? 'CALL 🔼' : 'PUT 🔽',
            targetTime: targetTimeString,
            source: 'Aleatório'
        };
    }
    
    const [hours, minutes] = result.targetTime.split(':');
    let targetDate = new Date();
    targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    // Handle case where target time is in the past (e.g., just after midnight)
    if (targetDate.getTime() < Date.now()) {
        targetDate.setDate(targetDate.getDate() + 1);
    }
    
    const countdown = Math.max(0, Math.floor((targetDate.getTime() - Date.now()) / 1000));
    
    setSignalData({
      ...formData,
      signal: result.signal,
      targetTime: result.targetTime,
      source: result.source,
      countdown: countdown,
      operationCountdown: null,
      operationStatus: 'pending'
    });

    setAppState('result');
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
    </>
  );
}
