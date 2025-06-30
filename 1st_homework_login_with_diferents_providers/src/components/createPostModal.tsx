"use client";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import type {
  CloudinaryUploadWidgetResults,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/credentials";
import { notifyNewPost } from "@/services/notificationService";
import Image from "next/image";
import { useAuth } from "@/context/authContext";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    if (images.length === 0 || !description.trim()) {
      alert("Por favor, sube al menos una imagen y añade una descripción");
      return;
    }

    setIsUploading(true);
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        userId: user.uid,
        userEmail: user.email,
        userDisplayName: user.displayName || "Usuario",
        images: images.map((img) => ({
          imageUrl: img.url,
          imagePublicId: img.publicId,
        })),
        description: description.trim(),
        createdAt: serverTimestamp(),
      });

      console.log("Post creado con ID:", docRef.id);

      try {
        await notifyNewPost(
          user.uid,
          user.displayName || user.email || "Usuario",
          docRef.id
        );
        alert(
          "Post creado exitosamente! Se ha notificado a todos los usuarios."
        );
      } catch (notificationError) {
        console.error("Error enviando notificaciones:", notificationError);
        alert(
          "Post creado exitosamente, pero hubo un problema enviando las notificaciones."
        );
      }

      setDescription("");
      setImages([]);
      onPostCreated();
      onClose();
    } catch (error) {
      console.error("Error creando post:", error);
      alert("Error al crear el post: " + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadSuccess = (results: CloudinaryUploadWidgetResults) => {
    if (results.info && typeof results.info === "object") {
      const info = results.info as CloudinaryUploadWidgetInfo;
      if (images.length < 5) {
        setImages((prev) => [
          ...prev,
          { url: info.secure_url, publicId: info.public_id },
        ]);
      } else {
        alert("No puedes subir más de 5 imágenes");
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Crear Nuevo Post</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="post-form">
          <div className="upload-section">
            <CldUploadWidget
              uploadPreset="posts_preset"
              onSuccess={handleUploadSuccess}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="upload-button"
                  disabled={images.length >= 5}
                >
                  {images.length > 0 ? "Subir Otra Imagen" : "Subir Imagen"}
                </button>
              )}
            </CldUploadWidget>
            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((image, index) => (
                  <div key={index} className="image-preview">
                    <Image
                      src={image.url}
                      alt={`Preview ${index + 1}`}
                      width={150}
                      height={100}
                      style={{ objectFit: "cover", borderRadius: "8px" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image-button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <small>{images.length}/5 imágenes</small>
          </div>
          <div className="description-section">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escribe una descripción para tu post..."
              rows={4}
              maxLength={500}
              className="description-input"
            />
            <small>{description.length}/500 caracteres</small>
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
              disabled={isUploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={
                isUploading || images.length === 0 || !description.trim()
              }
            >
              {isUploading
                ? "Publicando y enviando notificaciones..."
                : "Publicar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
