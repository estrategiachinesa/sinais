'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { AnimatedBackground } from '@/components/app/animated-background';

export default function GatePage() {
  const router = useRouter();
  const affiliateLink = 'https://exnova.com/lp/start-trading/?aff=198544&aff_model=revenue&afftrack=';

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/analisador');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <AnimatedBackground />
      <div className="flex flex-col min-h-screen items-center justify-center text-center p-4">
        <main className="w-full max-w-lg space-y-6">
          <div className="flex justify-center">
            <AlertTriangle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Atenção!
          </h1>
          <p className="text-lg text-foreground/80">
            Para gerar os sinais, você deve se cadastrar na plataforma e realizar um depósito de qualquer valor.
          </p>
          <Button
            asChild
            size="lg"
            className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <a href={affiliateLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-5 w-5" />
              Abrir a Corretora
            </a>
          </Button>
           <p className="text-sm text-muted-foreground animate-pulse">
            Você será redirecionado em alguns segundos...
          </p>
        </main>
        <footer className="absolute bottom-4 text-center text-xs text-muted-foreground">
          <p>
            © 2025 Estratégia Chinesa. Todos os direitos reservados.  Aviso Legal: Todas as estratégias e investimentos envolvem risco de perda. Nenhuma informação contida neste produto deve ser interpretada como uma garantia de resultados.
          </p>
        </footer>
      </div>
    </>
  );
}
