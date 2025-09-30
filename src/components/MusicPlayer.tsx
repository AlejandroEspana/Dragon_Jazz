"use client";

import PlayerControls from "./PlayerControls";
import Playlist from "./Playlist";
import Library from "./Library";

export default function MusicPlayer() {
  return (
  <div className="flex flex-col sm:flex-row w-full max-w-6xl h-full sm:h-[90vh] sm:max-h-[800px] rounded-xl border-2 border-primary/20 shadow-lg shadow-primary/10 bg-card text-card-foreground overflow-hidden">
    <div className="w-full sm:w-[300px] shrink-0 border-b sm:border-b-0 sm:border-r border-border/50">
      <Library />
    </div>
    <div className="flex flex-col flex-1 min-w-0">
    <header className="p-4 border-b border-border/50 shrink-0 flex items-center justify-between">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary flex items-center gap-3 font-display" style={{fontFamily: "'Tangerine', cursive"}}>
        Dragon Jazz
      </h1>
    </header>
    <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto">
      <Playlist />
    </main>
    <footer className="sticky bottom-0 border-t border-border/50 bg-card/80 backdrop-blur-sm z-10">
      <PlayerControls />
    </footer>
    </div>
  </div>
  );
}
