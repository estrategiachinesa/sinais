'use client';

import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CustomVideoPlayerProps = {
  url: string;
};

export function CustomVideoPlayer({ url }: CustomVideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleRewind = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(0, currentTime - 5));
    }
  };
  
  const handlePlayerReady = () => {
      setIsReady(true);
  }

  return (
    <div className="relative w-full h-full group">
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        controls={false}
        width="100%"
        height="100%"
        onReady={handlePlayerReady}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        config={{
          youtube: {
            playerVars: {
              showinfo: 0,
              modestbranding: 1,
              rel: 0,
            },
          },
        }}
      />
      {isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-white h-14 w-14"
              onClick={handleRewind}
            >
              <RotateCcw className="h-8 w-8" />
              <span className="sr-only">Retroceder 5 segundos</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-white h-20 w-20"
              onClick={handlePlayPause}
            >
              {playing ? (
                <Pause className="h-12 w-12" />
              ) : (
                <Play className="h-12 w-12" />
              )}
              <span className="sr-only">{playing ? 'Pausar' : 'Play'}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
