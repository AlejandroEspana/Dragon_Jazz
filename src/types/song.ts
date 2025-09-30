export type Song = {
  id: string;
  name: string;
  url: string;
};

export interface SongNode extends Song {
  next: SongNode | null;
  prev: SongNode | null;
}
