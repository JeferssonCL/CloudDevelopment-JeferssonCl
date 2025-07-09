"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/credentials";
import { AppUser, AppUserExtended } from "@/types/user";
import { NotificationsList } from "./notificationsList";

export function Header() {
  const [user, setUser] = useState<AppUser | AppUserExtended | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
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
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <header className="app-header">
      <h1>Mi Sitio Web</h1>
      {user && <NotificationsList />}
    </header>
  );
}
