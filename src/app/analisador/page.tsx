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
  targetDate: Date; // Keep the full date object for precise calculations
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
    const checkAndSetOTC = () => {
      const isEurUsdOpen = isMarketOpenForAsset('EUR/USD');
      const isEurJpyOpen = isMarketOpenForAsset('EUR/JPY');
      if (!isEurUsdOpen && !isEurJpyOpen) {
        setShowOTC(true);
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
                // Set the initial operation countdown based on the target time + duration
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
      
      // Call immediately to avoid 1-second initial delay
      updateCountdowns(); 
      
      timer = setInterval(updateCountdowns, 1000);

    }
    return () => clearInterval(timer);
  }, [appState, signalData?.operationStatus]); // Re-trigger when status changes


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
             if (targetTime.getTime() < now.getTime()) {
                targetTime.setMinutes(targetTime.getMinutes() + 5);
             }
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
    
    setSignalData({
      ...formData,
      signal: result.signal,
      targetTime: result.targetTime,
      source: result.source,
      targetDate: targetDate, // Store the full date object
      countdown: null, // Let the useEffect handle the initial calculation
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
