'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle, Loader2, Send } from 'lucide-react';
import { AnimatedBackground } from '@/components/app/animated-background';
import { CustomVideoPlayer } from '@/components/app/custom-video-player';


export default function GatePage() {
  const router = useRouter();
  const affiliateLink = 'https://exnova.com/lp/start-trading/?aff=198544&aff_model=revenue&afftrack=';
  const telegramLink = 'https://t.me/TraderChinesVIP';
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleClick = () => {
    setIsRedirecting(true);
    // Opens the affiliate link in a new tab
    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
    
    // Starts the countdown to redirect to the analyzer page
    setTimeout(() => {
      router.push('/analisador');
    }, 2000);
  };

  return (
    <>
      <AnimatedBackground />
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center text-center p-4">
          <div className="w-full max-w-lg space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline mb-4">
              ESTRATÉGIA CHINESA
            </h1>
            <div className="flex justify-center">
              <AlertTriangle className="h-12 w-12 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Atenção!
            </h1>
            <p className="text-lg text-foreground/80">
              Para gerar os sinais da Estratégia Chinesa, você deve se cadastrar na plataforma e realizar um depósito de qualquer valor.
            </p>
            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-primary-foreground"
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

            <div className="space-y-4 pt-6">
              <h2 className="text-lg font-semibold text-yellow-500">
                Instruções
              </h2>
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <CustomVideoPlayer url="https://youtube.com/shorts/m3rJjnZeG8o" />
              </div>
               <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex flex-col items-center text-foreground/80 hover:text-foreground transition-colors"
              >
                <Send className="h-8 w-8" />
                <span className="text-xs mt-1">entre no canal do telegram</span>
              </a>
            </div>
          </div>
        </main>
        <footer className="w-full text-center text-[0.6rem] text-foreground/50 p-4">
          <p>© 2025 Estratégia Chinesa. </p>
          <p>Todos os direitos reservados.</p>
          <p className="max-w-xl mx-auto mt-2">Aviso Legal: Todas as estratégias e investimentos envolvem risco de perda. Nenhuma informação contida neste produto deve ser interpretada como uma garantia de resultados.</p>
        </footer>
      </div>
    </>
  );
}
