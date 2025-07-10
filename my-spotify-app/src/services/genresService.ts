import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/credentials";
import { Genre } from "@/types/music";

export const addGenre = async (genre: Omit<Genre, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "genres"), genre);
  return docRef.id;
};

export const updateGenre = async (
  genreId: string,
  genreData: Partial<Omit<Genre, "id">>
): Promise<void> => {
  try {
    const genreRef = doc(db, "genres", genreId);
    await updateDoc(genreRef, genreData);
    console.log(`Género con ID ${genreId} actualizado correctamente`);
  } catch (error) {
    console.error("Error al actualizar el género:", error);
    throw new Error("No se pudo actualizar el género");
  }
};

export const deleteGenre = async (genreId: string): Promise<void> => {
  try {
    const genreRef = doc(db, "genres", genreId);
    await deleteDoc(genreRef);
    console.log(`Género con ID ${genreId} eliminado correctamente`);
  } catch (error) {
    console.error("Error al eliminar el género:", error);
    throw new Error("No se pudo eliminar el género");
  }
};

export const getGenres = async (): Promise<Genre[]> => {
  const snapshot = await getDocs(collection(db, "genres"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Genre));
};
