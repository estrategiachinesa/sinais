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
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export type FormData = {
  asset: string;
  expirationTime: '1m' | '5m';
};

type AppState = 'idle' | 'loading';

export default function AnalisadorPage() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    asset: 'EUR/USD',
    expirationTime: '1m',
  });
  const affiliateLink = 'https://exnova.com/lp/start-trading/?aff=198544&aff_model=revenue&afftrack=';


  const handleAnalyze = async () => {
    setAppState('loading');

    // Simulate analysis time
    setTimeout(() => {
        setAppState('idle');
        setIsAlertOpen(true);
    }, 3000);

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
        
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Falha ao analisar ❌</AlertDialogTitle>
              <AlertDialogDescription>
                Não encontramos seu cadastro no sistema. É preciso se cadastrar e realizar um depósito para gerar os sinais.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogAction asChild>
                 <a href={affiliateLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Cadastrar agora
                </a>
               </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <footer className="p-4 text-center text-xs text-muted-foreground">
          <p>
            Os sinais exibidos são gerados automaticamente para fins ilustrativos. Faça sua própria análise.
          </p>
        </footer>
      </div>
    </>
  );
}
