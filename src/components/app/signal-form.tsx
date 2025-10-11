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
import type { FormData, Asset } from '@/app/analisador/page';
import { CurrencyFlags } from './currency-flags';
import { Label } from '@/components/ui/label';

type SignalFormProps = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

const assets: Asset[] = [
  'AUD/CAD', 'AUD/CAD (OTC)',
  'AUD/JPY', 'AUD/JPY (OTC)',
  'AUD/USD', 'AUD/USD (OTC)',
  'EUR/GBP', 'EUR/GBP (OTC)',
  'EUR/JPY', 'EUR/JPY (OTC)',
  'EUR/USD', 'EUR/USD (OTC)',
  'USD/JPY', 'USD/JPY (OTC)',
];

export function SignalForm({ formData, setFormData, onSubmit, isLoading }: SignalFormProps) {
  return (
    <div className="w-full space-y-8 text-center">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          SINAIS DA<br />ESTRATÉGIA CHINESA
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          Escolha o ativo e o tempo de expiração para receber sinais automáticos em tempo real.
        </p>
      </div>

      <div className="space-y-4 text-left">
        <div className="space-y-2">
          <Label htmlFor="asset-select">Ativo:</Label>
          <Select
            value={formData.asset}
            onValueChange={(value) => setFormData({ ...formData, asset: value as Asset })}
            disabled={isLoading}
          >
            <SelectTrigger className="h-12 text-base" id="asset-select">
              <SelectValue asChild>
                  <div className="flex items-center gap-2">
                      <CurrencyFlags asset={formData.asset} />
                      <span>{formData.asset}</span>
                  </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {assets.map(asset => (
                <SelectItem key={asset} value={asset}>
                   <div className="flex items-center gap-2">
                      <CurrencyFlags asset={asset} />
                      <span>{asset}</span>
                  </div>
              </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiration-select">Tempo de expiração:</Label>
          <Select
            value={formData.expirationTime}
            onValueChange={(value) => setFormData({ ...formData, expirationTime: value as '1m' | '5m' })}
            disabled={isLoading}
          >
            <SelectTrigger className="h-12 text-base" id="expiration-select">
              <SelectValue placeholder="Selecione o Tempo de Expiração" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 minuto (1m)</SelectItem>
              <SelectItem value="5m">5 minutos (5m)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-primary-foreground"
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
