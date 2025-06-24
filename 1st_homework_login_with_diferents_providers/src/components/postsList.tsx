"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/credentials";
import { Post } from "@/types/post";
import Image from "next/image";

export function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Post[];

      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Cargando posts...</div>;
  }

  return (
    <div className="posts-container">
      <h2>Posts Recientes</h2>
      {posts.length === 0 ? (
        <p>No hay posts aún. ¡Sé el primero en crear uno!</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-images-grid">
                {post.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image.imageUrl}
                    alt={`${post.description} - Image ${index + 1}`}
                    width={150}
                    height={100}
                    className="post-image"
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                ))}
              </div>
              <div className="post-content">
                <p className="post-description">{post.description}</p>
                <div className="post-meta">
                  <span className="post-author">
                    Por: {post.userDisplayName}
                  </span>
                  <span className="post-date">
                    {post.createdAt.toLocaleDateString("es-ES")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
