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
import { ExternalLink, Download } from 'lucide-react';

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
        <header className="p-4 flex justify-center">
          <OnlineTraders />
        </header>

        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg">
             <SignalForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleAnalyze}
                isLoading={appState === 'loading'}
              />
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
               <AlertDialogAction asChild>
                 <a href={affiliateLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Cadastrar agora
                </a>
               </AlertDialogAction>
               <AlertDialogAction asChild>
                 <a href="https://traderchines.github.io/vip/">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar o indicador
                </a>
               </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <footer className="p-4 text-center text-xs text-foreground/50">
          <p>© 2025 Estratégia Chinesa. </p>
          <p>Todos os direitos reservados.</p>
          <p className="max-w-xl mx-auto">Aviso Legal: Todas as estratégias e investimentos envolvem risco de perda. Nenhuma informação contida neste produto deve ser interpretada como uma garantia de resultados.</p>
        </footer>
      </div>
    </>
  );
}
