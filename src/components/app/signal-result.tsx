'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import type { SignalData } from '@/app/analisador/page';
import { CurrencyFlags } from './currency-flags';
import { Badge } from '@/components/ui/badge';

type SignalResultProps = {
  data: SignalData;
  onReset: () => void;
};

export function SignalResult({ data, onReset }: SignalResultProps) {
  const isCall = data.signal.includes('CALL');
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  const renderStatus = () => {
    if (data.operationStatus === 'pending' && data.countdown !== null && data.countdown > 0) {
      return <p>Iniciar em: <span className="text-yellow-400">{data.countdown}s</span></p>;
    }
    if (data.operationStatus === 'active' && data.operationCountdown !== null && data.operationCountdown > 0) {
        return <p>Finalizando em: <span className="text-yellow-400">{formatTime(data.operationCountdown)}</span></p>
    }
    if (data.operationStatus === 'active' && (data.operationCountdown === 0 || data.operationCountdown === null)) {
         return <p>⏱️ Operação iniciada!</p>;
    }
    if (data.operationStatus === 'finished') {
        return <p>✅ Operação finalizada!</p>
    }
     return <p>⏱️ Operação iniciada!</p>;
  };


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
          <CardTitle className="text-2xl flex items-center justify-between">
            <span>🔔 Sinal Gerado!</span>
            <Badge variant={data.source === 'IA' ? 'default' : 'secondary'} className="text-xs">
              {data.source}
            </Badge>
          </CardTitle>
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
             {renderStatus()}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={onReset} 
          className="w-full"
          disabled={data.operationStatus === 'pending' || data.operationStatus === 'active'}
        >
            <RefreshCw className="mr-2 h-4 w-4" />
            Analisar Novamente
        </Button>
      </div>
    </div>
  );
}
