'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Loader2 } from 'lucide-react';
import type { FormData } from '@/app/analisador/page';

type SignalFormProps = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export function SignalForm({ formData, setFormData, onSubmit, isLoading }: SignalFormProps) {
  return (
    <div className="w-full space-y-8 text-center p-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          SINAIS DA<br />ESTRATÉGIA CHINESA
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          Escolha o ativo e receba sinais automáticos em tempo real.
        </p>
      </div>

      <div className="space-y-4">
        <Select
          value={formData.asset}
          onValueChange={(value) => setFormData({ ...formData, asset: value })}
          disabled={isLoading}
        >
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Selecione o Ativo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EUR/USD">EUR/USD</SelectItem>
            <SelectItem value="EUR/JPY">EUR/JPY</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={formData.expirationTime}
          onValueChange={(value) => setFormData({ ...formData, expirationTime: value as '1m' | '5m' })}
          disabled={isLoading}
        >
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Selecione o Tempo de Expiração" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">1 minuto (1m)</SelectItem>
            <SelectItem value="5m">5 minutos (5m)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        size="lg"
        className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <BarChart className="mr-2 h-5 w-5" />
        )}
        {isLoading ? 'Analisando...' : 'Analisar Mercado'}
      </Button>
    </div>
  );
}
