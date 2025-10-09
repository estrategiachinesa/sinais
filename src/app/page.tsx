'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';
import { AnimatedBackground } from '@/components/app/animated-background';

export default function GatePage() {
  const router = useRouter();
  const affiliateLink = 'https://exnova.com/lp/start-trading/?aff=198544&aff_model=revenue&afftrack=';
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleClick = () => {
    setIsRedirecting(true);
    // Opens the affiliate link in a new tab
    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
    
    // Starts the countdown to redirect to the analyzer page
    setTimeout(() => {
      router.push('/analisador');
    }, 3000);
  };

  return (
    <>
      <AnimatedBackground />
      <div className="flex flex-col min-h-screen items-center justify-center text-center p-4">
        <main className="w-full max-w-lg space-y-6">
          <div className="flex justify-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Atenção!
          </h1>
          <p className="text-lg text-foreground/80">
            Para gerar os sinais, você deve se cadastrar na plataforma e realizar um depósito de qualquer valor.
          </p>
          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleClick}
            disabled={isRedirecting}
          >
            {isRedirecting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <ExternalLink className="mr-2 h-5 w-5" />
            )}
            Abrir a Corretora
          </Button>
           {isRedirecting && (
            <p className="text-sm text-muted-foreground animate-pulse">
                Você será redirecionado em alguns segundos...
            </p>
           )}
        </main>
        <footer className="absolute bottom-4 text-center text-[0.7rem] text-foreground/50 w-full px-4">
          <p>© 2025 Estratégia Chinesa. </p>
          <p>Todos os direitos reservados.</p>
          <p className="max-w-xl mx-auto">Aviso Legal: Todas as estratégias e investimentos envolvem risco de perda. Nenhuma informação contida neste produto deve ser interpretada como uma garantia de resultados.</p>
        </footer>
      </div>
    </>
  );
}
