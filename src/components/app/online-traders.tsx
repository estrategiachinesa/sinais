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
  const [progress, setProgress] = useState(0);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timer | null>(null);
  const HOLD_DURATION = 3000; // 3 seconds


  useEffect(() => {
    // Set initial random value on client mount
    setTraderCount(Math.floor(Math.random() * (400 - 120 + 1)) + 120);

    const interval = setInterval(() => {
      setTraderCount(Math.floor(Math.random() * (400 - 120 + 1)) + 120);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const startHold = () => {
    setIsHolding(true);

    holdTimeoutRef.current = setTimeout(() => {
      onToggle();
      resetHold();
    }, HOLD_DURATION);

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsedTime / HOLD_DURATION) * 100);
      setProgress(newProgress);
      if (newProgress >= 100) {
        clearInterval(progressIntervalRef.current!);
      }
    }, 50);
  };

  const resetHold = () => {
    setIsHolding(false);
    setProgress(0);
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
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
  
  const circumference = 2 * Math.PI * 14; // 2 * pi * r (radius is 14)
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
         <svg className="absolute h-full w-full" viewBox="0 0 32 32">
            <circle
                className="text-muted/20"
                strokeWidth="2"
                stroke="currentColor"
                fill="transparent"
                r="14"
                cx="16"
                cy="16"
            />
            {isHolding && (
                 <circle
                    className="text-green-500"
                    strokeWidth="2"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="14"
                    cx="16"
                    cy="16"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            )}
        </svg>

        <span className="relative flex h-2 w-2">
            <span className={cn(
                "absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75",
                isActivated && "animate-ping"
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
