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
import { PostsList } from "@/components/postsList";
import { CreatePostModal } from "@/components/createPostModal";

function App() {
  const [user, setUser] = useState<AppUser | AppUserExtended | null>(null);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(0);

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

  const handlePostCreated = () => {
    setRefreshPosts((prev) => prev + 1);
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
    <div className="app-container">
      <h1>Firebase Auth App con Posts</h1>

      {user ? (
        <div>
          <div className="user-info">
            <p>
              <strong>Bienvenido:</strong> {user.email}
            </p>
            <p>
              <strong>Proveedores vinculados:</strong>{" "}
              {user.providers.join(", ")}
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

            <div className="user-actions">
              <button
                className="btn create-post"
                onClick={() => setIsCreatePostModalOpen(true)}
                style={{ marginBottom: "1rem" }}
              >
                Crear Post
              </button>

              <button
                className="btn logout"
                onClick={() => signOut(auth)}
                style={{ marginBottom: "1rem" }}
              >
                Cerrar sesión
              </button>

              <hr />
              <h3>Asociar proveedores</h3>
              <button className="btn link" onClick={linkGoogle}>
                Vincular Google
              </button>
              <button className="btn link" onClick={linkFacebook}>
                Vincular Facebook
              </button>
            </div>
          </div>

          <CreatePostModal
            user={user}
            isOpen={isCreatePostModalOpen}
            onClose={() => setIsCreatePostModalOpen(false)}
            onPostCreated={handlePostCreated}
          />
        </div>
      ) : (
        <Auth />
      )}

      <PostsList key={refreshPosts} />
    </div>
  );
}

export default App;
