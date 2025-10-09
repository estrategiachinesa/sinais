'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

const messages = [
  'Detectando padrão chinês...',
  'Calculando força do mercado...',
  'Identificando melhor entrada...',
  'Gerando seu sinal exclusivo!',
];

export function LoadingAnalysis() {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => {
        const currentIndex = messages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 1250); // Change message every 1.25s to fit 5s total duration

    const progressInterval = setInterval(() => {
        setProgress(p => p + 1);
    }, 30); // 30ms * 100 = 3000ms = 3s

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-md space-y-6 text-center">
      <h2 className="text-2xl font-semibold text-foreground/90 h-8">
        {currentMessage}
      </h2>
      <Progress value={progress} className="w-full h-2 bg-secondary" />
      <p className="text-sm text-muted-foreground">Aguarde um momento...</p>
    </div>
  );
}
