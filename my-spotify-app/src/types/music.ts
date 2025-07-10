export interface Genre {
  id: string;
  name: string;
  desciption: string;
  imageUrl: string;
}

export interface Artist {
  id: string;
  name: string;
  genreIds: string[];
  description: string;
  imageUrl: string;
  isVerified: boolean;
}

export interface Song {
  id: string;
  title: string;
  artistId: string;
  duration: number;
  genreIds: string[];
  imageUrl: string;
  audioUrl: string;
  createdAt: Date;
}
