"use client";

import { Card } from './ui/card';
import { type Song } from '@/types/song';
import { cn } from '@/lib/utils';
import { Music2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface SongCardProps {
  song: Song;
  children: ReactNode;
  isActive?: boolean;
}

export default function SongCard({ song, children, isActive = false }: SongCardProps) {
  return (
    <Card
      className={cn(
        "p-2 transition-all duration-200 border-transparent",
        isActive ? 'bg-primary/10 border-primary/50' : 'bg-transparent hover:bg-accent'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={cn("flex items-center justify-center h-10 w-10 rounded-md", isActive ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
            <Music2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
              <span className="truncate font-medium">{song.name}</span>
          </div>
        </div>
        <div className="flex items-center">{children}</div>
      </div>
    </Card>
  );
}
