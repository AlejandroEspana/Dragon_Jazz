"use client";
import React from 'react';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { Button } from './ui/button';
import { Plus, Trash2, ListMusic, PlusCircle } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';

export default function Library() {
    const { library, addSongs, removeSongFromLibrary, addSongToPlaylist } = useMusicPlayer();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addSongs(Array.from(e.target.files));
        }
    };
    
    return (
    <div className="flex flex-col h-full bg-card/50 min-w-0">
            <header className="p-4 border-b border-border/50 shrink-0">
                <h2 className="text-xl font-semibold flex items-center justify-between">
                    <span>Library</span>
                    <Button variant="ghost" size="icon" onClick={handleFileUploadClick}>
                        <Plus className="h-5 w-5" />
                    </Button>
                    <input
                        type="file"
                        multiple
                        accept="audio/mp3,audio/mpeg"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </h2>
            </header>
            <ScrollArea className="flex-1 w-full">
                <div className="p-2 space-y-2">
                    {library.length > 0 ? (
                        library.map((song) => (
                            <Card key={song.id} className="p-2 flex flex-col bg-accent/50 hover:bg-accent transition-colors w-full">
                                <div className='flex items-center gap-2 min-w-0 flex-1 overflow-hidden w-full'>
                                    <ListMusic className="h-4 w-4 text-secondary shrink-0"/>
                                    <span className="truncate text-sm w-full max-w-[120px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[250px]">{song.name}</span>
                                </div>
                                <div className='flex flex-row gap-2 mt-3 pt-2 border-t border-border/30 w-full justify-end'>
                                    <Button variant="ghost" size="icon" className='h-7 w-7' onClick={() => addSongToPlaylist(song)}>
                                        <PlusCircle className="h-4 w-4 text-primary/80" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className='h-7 w-7' onClick={() => removeSongFromLibrary(song)}>
                                        <Trash2 className="h-4 w-4 text-destructive/80" />
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed m-2">
                            <ListMusic className="w-10 h-10 mb-4" />
                            <h3 className="text-base font-semibold">Library is empty</h3>
                            <p className="text-xs mt-1">Click the '+' to upload your first song.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
