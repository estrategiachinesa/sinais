'use client';

import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Play, Pause, RotateCcw, VolumeX, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CustomVideoPlayerProps = {
  url: string;
};

export function CustomVideoPlayer({ url }: CustomVideoPlayerProps) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
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
  };
  
  const handleUnmute = () => {
    if (muted) {
        setMuted(false);
    }
  }

  return (
    <div className="relative w-full h-full group" onClick={handleUnmute}>
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        muted={muted}
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
      {isReady && muted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 cursor-pointer text-white">
           <VolumeX className="h-12 w-12 mb-2"/>
           <p className="text-lg font-semibold">Clique para ativar o som</p>
        </div>
      )}
      {isReady && !muted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-white h-14 w-14"
              onClick={(e) => { e.stopPropagation(); handleRewind(); }}
            >
              <RotateCcw className="h-8 w-8" />
              <span className="sr-only">Retroceder 5 segundos</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-white h-20 w-20"
              onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
            >
              {playing ? (
                <Pause className="h-12 w-12" />
              ) : (
                <Play className="h-12 w-12" />
              )}
              <span className="sr-only">{playing ? 'Pausar' : 'Play'}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-white h-14 w-14"
              onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
            >
              {muted ? <VolumeX className="h-8 w-8" /> : <Volume2 className="h-8 w-8" />}
              <span className="sr-only">{muted ? 'Ativar som' : 'Desativar som'}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
