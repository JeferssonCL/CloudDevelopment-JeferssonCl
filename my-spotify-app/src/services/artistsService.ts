import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/credentials";
import { Artist } from "@/types/music";

export const addArtist = async (
  artist: Omit<Artist, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "artists"), artist);
  return docRef.id;
};

export const getArtist = async (artistId: string): Promise<Artist | null> => {
  const docRef = doc(db, "artists", artistId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists()
    ? ({ id: docSnap.id, ...docSnap.data() } as Artist)
    : null;
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

export const deleteArtist = async (artistId: string): Promise<void> => {
  const artistRef = doc(db, "artists", artistId);
  await deleteDoc(artistRef);
};

export const updateArtist = async (
  artistId: string,
  artistData: Partial<Omit<Artist, "id">>
): Promise<void> => {
  const artistRef = doc(db, "artists", artistId);
  await updateDoc(artistRef, artistData);
};
