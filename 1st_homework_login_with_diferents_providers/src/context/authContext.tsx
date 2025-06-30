"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/credentials";
import { AppUser, AppUserExtended } from "@/types/user";

interface AuthContextType {
  user: AppUser | AppUserExtended | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | AppUserExtended | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        try {
          if (firebaseUser) {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const extendedUser: AppUserExtended = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                providers: firebaseUser.providerData.map((p) => p.providerId),
                address: userDoc.data().address,
                birthdate: userDoc.data().birthdate,
                age: userDoc.data().age,
              };
              setUser(extendedUser);
            } else {
              const appUser: AppUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                providers: firebaseUser.providerData.map((p) => p.providerId),
              };
              setUser(appUser);
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Error desconocido");
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
