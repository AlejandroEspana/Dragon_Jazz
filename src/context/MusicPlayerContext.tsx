"use client";

import React, { createContext, useContext, useState, ReactNode, useRef, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DoublyLinkedList, SongNode } from "@/utils/DoublyLinkedList";

interface MusicPlayerContextType {
  library: SongNode[];
  playlist: SongNode[];
  currentTrack: SongNode | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  isMuted: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  addSongs: (files: File[]) => void;
  addSongToPlaylist: (song: SongNode) => void;
  removeSongFromLibrary: (song: SongNode) => void;
  removeSongFromPlaylist: (song: SongNode) => void;
  reorderPlaylist: (startIndex: number, endIndex: number) => void;
  playTrack: (track: SongNode) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
  handleSeek: (value: number) => void;
  handleVolumeChange: (value: number) => void;
  toggleMute: () => void;
  shufflePlaylist: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [libraryLL] = useState(() => new DoublyLinkedList());
  const [playlistLL] = useState(() => new DoublyLinkedList());
  
  const [library, setLibrary] = useState<SongNode[]>([]);
  const [playlist, setPlaylist] = useState<SongNode[]>([]);
  
  const [currentTrackNode, setCurrentTrackNode] = useState<SongNode | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const updateLibraryState = useCallback(() => {
    setLibrary(libraryLL.toArray());
  }, [libraryLL]);

  const updatePlaylistState = useCallback(() => {
    setPlaylist(playlistLL.toArray());
  }, [playlistLL]);

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => {
      libraryLL.clear();
      playlistLL.clear();
    };
  }, [libraryLL, playlistLL]);
  
  const addSongs = (files: File[]) => {
    const invalidFiles: string[] = [];
    let addedCount = 0;

    for (const file of files) {
      if (file.type === 'audio/mpeg' || file.type === 'audio/mp3') {
        libraryLL.addSong(file);
        addedCount++;
      } else {
        invalidFiles.push(file.name);
      }
    }
    
    updateLibraryState();

    if (addedCount > 0) {
      toast({ title: "Success", description: `${addedCount} song(s) added to library.` });
    }
    if (invalidFiles.length > 0) {
      toast({ 
        title: "Upload Warning", 
        description: `Ignored ${invalidFiles.length} invalid file(s). Only MP3/MPEG are supported.`, 
        variant: "destructive" 
      });
    }
  };

  const playTrack = useCallback((track: SongNode) => {
    const nodeToPlay = playlistLL.find(track.id);
    if (nodeToPlay && audioRef.current) {
        setCurrentTrackNode(nodeToPlay);
        audioRef.current.src = nodeToPlay.url;
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(err => {
              console.error("Playback error:", err);
              toast({ title: "Playback Error", description: "The audio file could not be played.", variant: "destructive" });
              setIsPlaying(false);
            });
        }
    }
  }, [playlistLL, toast]);
  
  const addSongToPlaylist = (song: SongNode) => {
    const libraryNode = libraryLL.find(song.id);
    if (!libraryNode) return;
    
    // Avoid adding duplicates
    if (playlistLL.find(song.id)) {
        toast({ title: "Already in Playlist", description: `"${song.name}" is already in the playlist.` });
        return;
    }

    const newPlaylistNode = playlistLL.addSong(libraryNode.file);
    updatePlaylistState();
    toast({ title: "Added to Playlist", description: `"${song.name}" has been added.` });

    if (!currentTrackNode) {
      playTrack(newPlaylistNode);
    }
  };

  const removeSongFromPlaylist = (song: SongNode, showToast = true) => {
    const nodeToRemove = playlistLL.find(song.id);
    if (!nodeToRemove) return;

    let nextTrackToPlay: SongNode | null = null;
    if (currentTrackNode?.id === song.id) {
        const nextTrack = currentTrackNode.next ?? playlistLL.head;
        if (nextTrack && nextTrack.id !== currentTrackNode.id) {
          nextTrackToPlay = nextTrack;
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
            setCurrentTrackNode(null);
            setIsPlaying(false);
        }
    }
    
    playlistLL.removeSong(nodeToRemove);
    updatePlaylistState();

    if (nextTrackToPlay) {
      playTrack(nextTrackToPlay);
    }

    if(showToast) {
        toast({ title: "Removed from Playlist", description: `"${song.name}" has been removed.` });
    }
  };

  const removeSongFromLibrary = (song: SongNode) => {
    const nodeToRemove = libraryLL.find(song.id);
    if (!nodeToRemove) return;

    // Also remove from playlist
    const playlistNodeToRemove = playlistLL.find(song.id);
    if(playlistNodeToRemove) {
      removeSongFromPlaylist(playlistNodeToRemove, false);
    }

    libraryLL.removeSong(nodeToRemove);
    updateLibraryState();
    toast({ title: "Song Deleted", description: `"${song.name}" has been deleted from your library.` });
  };
  
  const reorderPlaylist = (startIndex: number, endIndex: number) => {
    playlistLL.moveToPosition(startIndex, endIndex);
    updatePlaylistState();
  };
  
  const shufflePlaylist = useCallback(() => {
    if (playlistLL.size < 1) return;
    playlistLL.shuffle();
    updatePlaylistState();
    if (playlistLL.head) {
        playTrack(playlistLL.head);
    }
    toast({ title: "Playlist Shuffled", description: "The playlist has been randomized." });
  }, [playlistLL, updatePlaylistState, playTrack]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!currentTrackNode && playlistLL.head) {
        playTrack(playlistLL.head);
      } else if (currentTrackNode) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error("Playback error on toggle:", err);
            setIsPlaying(false);
          });
        }
      }
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = useCallback(() => {
    if (!currentTrackNode) return;
    const nextTrack = currentTrackNode.next ?? playlistLL.head;
    if (nextTrack) {
      playTrack(nextTrack);
    } else {
      setIsPlaying(false);
    }
  }, [currentTrackNode, playlistLL.head, playTrack]);

  const playPrev = useCallback(() => {
    if (!currentTrackNode) return;
    const prevTrack = currentTrackNode.prev ?? playlistLL.tail;
    if (prevTrack) {
      playTrack(prevTrack);
    }
  }, [currentTrackNode, playlistLL.tail, playTrack]);


  const handleSeek = (value: number) => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
      setProgress(value);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
      setVolume(value);
      if (value > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const toggleMute = () => {
    if(audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', playNext);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', playNext);
    };
  }, [playNext]);

  return (
    <MusicPlayerContext.Provider
      value={{
        library,
        playlist,
        currentTrack: currentTrackNode,
        isPlaying,
        progress,
        volume,
        isMuted,
        audioRef,
        addSongs,
        addSongToPlaylist,
        removeSongFromLibrary,
        removeSongFromPlaylist,
        reorderPlaylist,
        playTrack,
        togglePlayPause,
        playNext,
        playPrev,
        handleSeek,
        handleVolumeChange,
        toggleMute,
        shufflePlaylist
      }}
    >
      {children}
      <audio ref={audioRef} />
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
};
