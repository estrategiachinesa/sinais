'use client';

import { useState, useEffect, useRef } from 'react';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';


type OnlineTradersProps = {
  isActivated: boolean;
  onToggle: () => void;
};

export function OnlineTraders({ isActivated, onToggle }: OnlineTradersProps) {
  const [traderCount, setTraderCount] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const HOLD_DURATION = 2000; // 2 seconds


  useEffect(() => {
    // Set initial random value on client mount
    setTraderCount(Math.floor(Math.random() * (150 - 50 + 1)) + 50);

    const interval = setInterval(() => {
      setTraderCount(Math.floor(Math.random() * (150 - 50 + 1)) + 50);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const startHold = () => {
    setIsHolding(true);

    holdTimeoutRef.current = setTimeout(() => {
      onToggle();
      resetHold();
    }, HOLD_DURATION);
  };

  const resetHold = () => {
    setIsHolding(false);
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  };

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
      className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer select-none"
      onMouseDown={startHold}
      onMouseUp={resetHold}
      onMouseLeave={resetHold}
      onTouchStart={startHold}
      onTouchEnd={resetHold}
      title={isActivated ? "Desativar modo secreto" : "Ativar modo secreto"}
    >
      <div className="relative h-6 w-6 flex items-center justify-center">
        <span className="relative flex h-2 w-2">
            <span className={cn(
                "absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75",
                (isActivated || isHolding) && "animate-ping"
            )}></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </div>

      <Users className="h-4 w-4" />
      <span>
        <strong>{traderCount}</strong> traders online agora
      </span>
    </div>
  );
}
