import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/credentials";
import { Artist, Genre, Song } from "@/types/music";

export const getGenres = async (): Promise<Genre[]> => {
  const snapshot = await getDocs(collection(db, "genres"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Genre));
};

export const getArtists = async (genreId?: string | null) => {
  let snapshot;

  if (genreId) {
    const q = query(
      collection(db, "artists"),
      where("genreIds", "array-contains", genreId)
    );
    snapshot = await getDocs(q);
  } else {
    snapshot = await getDocs(collection(db, "artists"));
  }

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      genreIds: data.genreIds,
      description: data.description,
      imageUrl: data.imageUrl,
      isVerified: data.isVerified,
    } as Artist;
  });
};

export const getSongsByArtist = async (artistId: string) => {
  const q = query(collection(db, "songs"), where("artistId", "==", artistId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as Song)
  );
};

export const getSongById = async (songId: string): Promise<Song | null> => {
  const docRef = doc(db, "songs", songId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt.toDate(),
  } as Song;
};

export const getArtist = async (artistId: string): Promise<Artist | null> => {
  const docRef = doc(db, "artists", artistId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists()
    ? ({ id: docSnap.id, ...docSnap.data() } as Artist)
    : null;
};

export const addGenre = async (genre: Omit<Genre, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "genres"), genre);
  return docRef.id;
};

export const addArtist = async (
  artist: Omit<Artist, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "artists"), artist);
  return docRef.id;
};

export const addSong = async (song: Omit<Song, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "songs"), {
    ...song,
    createdAt: new Date(),
  });
  return docRef.id;
};
