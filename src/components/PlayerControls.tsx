"use client";

import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { Button } from './ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Slider } from './ui/slider';

export default function PlayerControls() {
  const {
    isPlaying,
    togglePlayPause,
    playNext,
    playPrev,
    currentTrack,
    progress,
    handleSeek,
    audioRef,
    volume,
    handleVolumeChange,
    toggleMute,
    isMuted,
    shufflePlaylist
  } = useMusicPlayer();

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTimes = () => {
        if (!isNaN(audio.duration)) {
            setDuration(audio.duration);
        }
        setCurrentTime(audio.currentTime);
      };

      const setAudioData = () => {
        if (!isNaN(audio.duration)) {
            setDuration(audio.duration);
        }
        setCurrentTime(audio.currentTime);
      }

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', updateTimes);
      
      if (audio.readyState >= 2) {
        setAudioData();
      }

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', updateTimes);
      };
    }
  }, [audioRef, currentTrack]);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds <= 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 p-2 sm:p-4 w-full">
      <div className="w-full sm:w-1/4 flex items-center gap-2 text-sm text-muted-foreground truncate mb-2 sm:mb-0">
        {currentTrack?.name || 'Dragon Jazz'}
      </div>

      <div className="flex-1 flex flex-col items-center gap-2 max-w-full sm:max-w-xl w-full">
        <div className="flex items-center gap-2 sm:gap-4 w-full justify-center">
          <Button variant="ghost" size="icon" onClick={shufflePlaylist}>
            <Shuffle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={playPrev} disabled={!currentTrack}>
            <SkipBack className="h-6 w-6" />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={togglePlayPause}
            disabled={!currentTrack}
            className="w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary/80 text-primary-foreground shadow-primary/30"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={playNext} disabled={!currentTrack}>
            <SkipForward className="h-6 w-6" />
          </Button>
           <Button variant="ghost" size="icon" disabled={true} className="opacity-50 cursor-not-allowed">
            <Repeat className="h-5 w-5" />
          </Button>
        </div>

        <div className="w-full flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-10 sm:w-12 text-center font-mono">
                {formatTime(currentTime)}
            </span>
             <Slider
              value={[progress]}
              onValueChange={(value) => handleSeek(value[0])}
              max={100}
              step={0.1}
              className="w-full"
              disabled={!currentTrack}
            />
            <span className="text-xs text-muted-foreground w-10 sm:w-12 text-center font-mono">
                {formatTime(duration)}
            </span>
        </div>
      </div>

      <div className="w-full sm:w-1/4 flex items-center justify-end gap-2 mt-2 sm:mt-0">
         <Button variant="ghost" size="icon" onClick={toggleMute}>
          {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          onValueChange={(value) => handleVolumeChange(value[0])}
          max={100}
          step={1}
          className="w-16 sm:w-24"
          thumbClassName="h-3 w-3"
          trackClassName="h-1"
        />
      </div>
    </div>
  );
}
