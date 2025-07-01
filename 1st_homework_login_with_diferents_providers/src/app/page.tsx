"use client";

import { useEffect, useState } from "react";
import { signOut, linkWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/credentials";
import { MessagePayload, onMessage } from "firebase/messaging";
import { messaging } from "@/credentials";
import { Auth } from "@/components/auth/auth";
import "@/styles/app.css";
import { PostsList } from "@/components/posts/postsList";
import { CreatePostModal } from "@/components/createPostModal";
import {
  requestNotificationPermission,
  saveUserFCMToken,
} from "@/services/notificationService";
import { useAuth } from "@/context/authContext";

interface Notification {
  title: string;
  body: string;
}

function App() {
  const { user, loading } = useAuth();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(0);
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (title: string, body: string) => {
    setNotification({ title, body });
    setTimeout(() => setNotification(null), 5000);
  };

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

  const setupNotifications = async (userId: string) => {
    try {
      const hasPermission = await requestNotificationPermission();

      if (hasPermission) await saveUserFCMToken(userId);
      else console.log("Permisos de notificación denegados");
    } catch (error) {
      console.error("Error configurando notificaciones:", error);
    }
  };

  useEffect(() => {
    if (!user) return;

    setupNotifications(user.uid);

    if (!messaging) {
      console.warn(
        "Messaging no está definido, no se puede escuchar mensajes."
      );
      return;
    }

    const unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
      if (payload.notification) {
        showNotification(
          payload.notification.title || "Nueva notificación",
          payload.notification.body || "Tienes una nueva notificación"
        );
      }
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="app-container">
      {notification && (
        <div className="notification-banner">
          <div className="notification-content">
            <h4>{notification.title}</h4>
            <p>{notification.body}</p>
          </div>
          <button
            className="notification-close"
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}

      {user ? (
        <div className="user-info">
          <p>
            <strong>Bienvenido:</strong> {user.email}
          </p>
          <p>
            <strong>Proveedores vinculados:</strong> {user.providers.join(", ")}
          </p>

          {"address" in user && (
            <>
              <p>
                <strong>Nombre Completo:</strong> {user.displayName}
              </p>
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

          <CreatePostModal
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
