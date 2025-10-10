'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, Timer, CandlestickChart } from 'lucide-react';
import type { SignalData } from '@/app/analisador/page';
import { CurrencyFlags } from './currency-flags';


type SignalResultProps = {
  data: SignalData;
  onReset: () => void;
};

export function SignalResult({ data, onReset }: SignalResultProps) {
  const isCall = data.signal.includes('CALL');
  const affiliateLink = 'https://exnova.com/lp/start-trading/?aff=198544&aff_model=revenue&afftrack=';

  return (
    <div className="w-full max-w-md space-y-6 text-center">
      <Card
        className={
          isCall
            ? 'border-success/50 bg-success/10'
            : 'border-primary/50 bg-primary/10'
        }
      >
        <CardHeader>
          <CardTitle className="text-2xl">Sinal Gerado!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg">
          <div className="flex justify-between items-center p-3 rounded-lg bg-card/50">
            <span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-5 w-5"/> Hora</span>
            <span className="font-bold">{data.targetTime}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-card/50">
            <span className="flex items-center gap-2 text-muted-foreground"><Timer className="h-5 w-5"/> Tempo</span>
            <span className="font-bold">{data.expirationTime === '1m' ? '1 minuto' : '5 minutos'}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-card/50">
            <span className="flex items-center gap-2 text-muted-foreground"><CandlestickChart className="h-5 w-5"/> Ativo</span>
            <span className="font-bold flex items-center gap-2">
                <CurrencyFlags asset={data.asset} />
                {data.asset}
            </span>
          </div>
          <div
            className={`flex justify-between items-center p-4 rounded-lg text-2xl font-bold ${
              isCall ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground'
            }`}
          >
            <span className="flex items-center gap-2">Sinal</span>
            <span className="flex items-center gap-2">
              {data.signal}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <p className="text-xl font-semibold text-foreground">
          ✅ Execute esse sinal agora na corretora oficial!
        </p>
        <Button
          asChild
          size="lg"
          className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <a href={affiliateLink} target="_blank" rel="noopener noreferrer">
            Abrir Corretora
            <ExternalLink className="ml-2 h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" onClick={onReset} className="w-full">
          Gerar Novo Sinal
        </Button>
      </div>
    </div>
  );
}
