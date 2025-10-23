'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';


type OnlineTradersProps = {
  isActivated: boolean;
  onToggle: () => void;
};

export function OnlineTraders({ isActivated, onToggle }: OnlineTradersProps) {
  const [traderCount, setTraderCount] = useState(0);

  useEffect(() => {
    // Set initial random value on client mount
    setTraderCount(Math.floor(Math.random() * (400 - 120 + 1)) + 120);

    const interval = setInterval(() => {
      setTraderCount(Math.floor(Math.random() * (400 - 120 + 1)) + 120);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (traderCount === 0) {
    return (
        <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Users className="h-4 w-4" />
            <span className="h-4 w-24 rounded-md animate-pulse bg-muted"></span>
        </div>
    )
  }

  return (
    <div 
      className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer"
      onClick={onToggle}
      title={isActivated ? "Desativar modo secreto" : "Ativar modo secreto"}
    >
      <span className="relative flex h-2 w-2">
        <span className={cn(
            "absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75",
            isActivated && "animate-ping"
        )}></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <Users className="h-4 w-4" />
      <span>
        <strong>{traderCount}</strong> traders online agora
      </span>
    </div>
  );
}
