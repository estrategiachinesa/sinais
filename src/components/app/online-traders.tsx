'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export function OnlineTraders() {
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
    <div className="flex items-center gap-2 text-sm text-foreground/80">
      <Users className="h-4 w-4" />
      <span>
        <strong>{traderCount}</strong> traders online agora
      </span>
    </div>
  );
}
