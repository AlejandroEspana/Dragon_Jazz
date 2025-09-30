import MusicPlayer from '@/components/MusicPlayer';
import { MusicPlayerProvider } from '@/context/MusicPlayerContext';

export default function Home() {
  return (
    <MusicPlayerProvider>
      <div className="flex h-screen w-full items-center justify-center bg-background p-2 sm:p-4">
        <div className="w-full h-full flex items-center justify-center">
          <MusicPlayer />
        </div>
      </div>
    </MusicPlayerProvider>
  );
}
