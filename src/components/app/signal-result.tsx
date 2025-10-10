'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import type { SignalData } from '@/app/analisador/page';
import { CurrencyFlags } from './currency-flags';


type SignalResultProps = {
  data: SignalData;
  onReset: () => void;
};

export function SignalResult({ data, onReset }: SignalResultProps) {
  const isCall = data.signal.includes('CALL');
  const indicatorLink = 'https://traderchines.github.io/vip/';

  return (
    <div className="w-full max-w-md space-y-6 text-center">
      <Card
        className={
          isCall
            ? 'border-success/50 bg-success/10'
            : 'border-destructive/50 bg-destructive/10'
        }
      >
        <CardHeader>
          <CardTitle className="text-2xl">🔔 Sinal Gerado!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-lg">
          <div className="flex justify-between items-center text-left">
            <span className="text-muted-foreground">Ativo:</span>
            <span className="font-bold flex items-center gap-2">
                <CurrencyFlags asset={data.asset} />
                {data.asset}
            </span>
          </div>
          <div className="flex justify-between items-center text-left">
            <span className="text-muted-foreground">Tempo:</span>
            <span className="font-bold">{data.expirationTime}</span>
          </div>
          <div
            className={`flex justify-between items-center text-2xl font-bold p-3 rounded-lg ${
              isCall ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
            }`}
          >
            <span>Ação:</span>
            <span>
              {data.signal}
            </span>
          </div>
          <div className="flex justify-between items-center text-left">
            <span className="text-muted-foreground">Hora da entrada:</span>
            <span className="font-bold">{data.targetTime}</span>
          </div>
          <div className="text-center font-bold text-xl pt-2">
            {data.countdown !== null && data.countdown > 0 ? (
                <p>Iniciar em: <span className="text-yellow-400">{data.countdown}s</span></p>
            ) : (
                <p>⏱️ Operação iniciada!</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button
          asChild
          size="lg"
          className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <a href={indicatorLink} target="_blank" rel="noopener noreferrer">
            Baixar o indicador
            <Download className="ml-2 h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" onClick={onReset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Analisar Novamente
        </Button>
      </div>
    </div>
  );
}
