"use client";

import React, { useState, useMemo } from 'react';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import SongCard from './SongCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GripVertical, Play, Trash2, Search, ListMusic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Song } from '@/types/song';

export default function Playlist() {
  const { 
    playlist, 
    reorderPlaylist, 
    playTrack, 
    removeSongFromPlaylist, 
    currentTrack
  } = useMusicPlayer();
  
  const [draggedSong, setDraggedSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, song: Song) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', song.id);
    setDraggedSong(song);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (!draggedSong) return;
    
    const originalIndex = playlist.findIndex(s => s.id === draggedSong.id);
    if (originalIndex !== -1 && originalIndex !== dropIndex) {
      reorderPlaylist(originalIndex, dropIndex);
    }
    setDraggedSong(null);
  };
  
  const handleDragEnd = () => {
    setDraggedSong(null);
  };

  const filteredPlaylist = useMemo(() => {
    if (!searchQuery) return playlist;
    const lowercasedQuery = searchQuery.toLowerCase();
    return playlist.filter(song => song.name.toLowerCase().includes(lowercasedQuery));
  }, [playlist, searchQuery]);


  return (
    <div className="flex flex-col gap-2 sm:gap-4 h-full w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 flex-wrap w-full">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2"><ListMusic/> Now Playing</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 min-w-[120px] sm:min-w-[200px] max-w-full sm:max-w-sm">
          <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  type="text"
                  placeholder="Search playlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
              />
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-0 sm:pr-2 w-full" onDragOver={handleDragOver}>
        {playlist.length > 0 ? (
          filteredPlaylist.length > 0 ? (
            filteredPlaylist.map((song, index) => {
              const originalIndex = playlist.findIndex(s => s.id === song.id);
              if (originalIndex === -1) return null;
              
              const isPlaying = song.id === currentTrack?.id;
              return (
                <div
                  key={song.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, song)}
                  onDrop={(e) => handleDrop(e, originalIndex)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'transition-opacity',
                    draggedSong?.id === song.id ? 'opacity-30' : 'opacity-100'
                  )}
                >
                  <SongCard song={song} isActive={isPlaying}>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" className="cursor-grab" asChild>
                        <div><GripVertical className="h-5 w-5 text-muted-foreground" /></div>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => playTrack(song)}>
                        <Play className={cn("h-4 w-4", isPlaying ? "text-primary" : "text-foreground")} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeSongFromPlaylist(song)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </SongCard>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
                <Search className="w-16 h-16 mb-4" />
                <h3 className="text-lg font-semibold">No Songs Found</h3>
                <p>Your search for "{searchQuery}" didn't match any songs.</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
            <ListMusic className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-semibold">Your playlist is empty.</h3>
            <p>Add songs from your library to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
