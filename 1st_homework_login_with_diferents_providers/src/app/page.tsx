"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  User,
  linkWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, googleProvider, facebookProvider, db } from "@/credentials";
import { AppUser, AppUserExtended } from "@/types/user";
import { Auth } from "@/components/auth";
import "@/styles/app.css";

function App() {
  const [user, setUser] = useState<AppUser | AppUserExtended | null>(null);

  const linkGoogle = () => {
    if (auth.currentUser) {
      linkWithPopup(auth.currentUser, googleProvider)
        .then(() => alert("Cuenta de Google vinculada"))
        .catch((e) => alert("Error: " + e.message));
    }
  };

  const linkFacebook = () => {
    if (auth.currentUser) {
      linkWithPopup(auth.currentUser, facebookProvider)
        .then(() => alert("Cuenta de Facebook vinculada"))
        .catch((e) => alert("Error: " + e.message));
    }
  };

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
    <div
      className="app-container"
      style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Firebase Auth App
      </h1>

      {user ? (
        <div
          className="user-info"
          style={{
            backgroundColor: "#f5f5f5",
            padding: "2rem",
            borderRadius: "8px",
          }}
        >
          <p>
            <strong>Bienvenido:</strong> {user.email}
          </p>
          <p>
            <strong>Proveedores vinculados:</strong> {user.providers.join(", ")}
          </p>
          {"address" in user && (
            <>
              <p>
                <strong>Dirección:</strong> {user.address}
              </p>
              <p>
                <strong>Fecha de nacimiento:</strong> {user.birthdate}
              </p>
              <p>
                <strong>Edad:</strong> {user.age}
              </p>
            </>
          )}

          <div style={{ marginTop: "1.5rem" }}>
            <button
              className="btn logout"
              onClick={() => signOut(auth)}
              style={{ marginBottom: "1rem", width: "100%" }}
            >
              Cerrar sesión
            </button>

            <hr style={{ margin: "1.5rem 0" }} />
            <h3 style={{ marginBottom: "1rem" }}>Asociar proveedores</h3>
            <button
              className="btn link"
              onClick={linkGoogle}
              style={{ width: "100%", marginBottom: "1rem" }}
            >
              Vincular Google
            </button>
            <button
              className="btn link"
              onClick={linkFacebook}
              style={{ width: "100%" }}
            >
              Vincular Facebook
            </button>
          </div>
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
