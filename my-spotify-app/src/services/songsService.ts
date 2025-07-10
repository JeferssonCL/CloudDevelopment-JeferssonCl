import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/credentials";
import { Song } from "@/types/music";

export const getSongs = async (): Promise<Song[]> => {
  const snapshot = await getDocs(collection(db, "songs"));
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as Song)
  );
};

export const getSongsByArtist = async (artistId: string): Promise<Song[]> => {
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

export const addSong = async (song: Omit<Song, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "songs"), {
    ...song,
    createdAt: new Date(),
  });
  return docRef.id;
};

export const updateSong = async (
  songId: string,
  songData: Partial<Omit<Song, "id" | "createdAt">>
): Promise<void> => {
  const songRef = doc(db, "songs", songId);
  await updateDoc(songRef, songData);
};

export const deleteSong = async (songId: string): Promise<void> => {
  const songRef = doc(db, "songs", songId);
  await deleteDoc(songRef);
};
