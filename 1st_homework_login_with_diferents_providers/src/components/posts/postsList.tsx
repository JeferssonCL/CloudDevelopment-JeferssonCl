"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/credentials";
import { Post } from "@/types/post";
import { useAuth } from "@/context/authContext";
import { PostsGrid } from "./postGrid";

export function PostsList() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReacting, setIsReacting] = useState<{ [postId: string]: boolean }>(
    {}
  );
  const [userReactions, setUserReactions] = useState<{
    [postId: string]: "like" | "dislike" | null;
  }>({});

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        likesCount: doc.data().likesCount || 0,
        dislikesCount: doc.data().dislikesCount || 0,
        moderated: doc.data().moderated || false,
        originalDescription: doc.data().originalDescription || "",
        moderatedAt: doc.data().moderatedAt?.toDate() || null,
      })) as Post[];

      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserReactions({});
      return;
    }

    const fetchUserReactions = async () => {
      const reactionsQuery = query(
        collection(db, "postReactions"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(reactionsQuery);
      const reactions: { [postId: string]: "like" | "dislike" } = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reactions[data.postId] = data.type;
      });
      setUserReactions(reactions);
    };

    fetchUserReactions();
  }, [user]);

  const handleReaction = async (postId: string, type: "like" | "dislike") => {
    if (!user) {
      alert("Debes iniciar sesión para reaccionar a un post.");
      return;
    }

    if (isReacting[postId]) return;
    if (userReactions[postId] === type) return;

    setIsReacting((prev) => ({ ...prev, [postId]: true }));
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likesCount:
                type === "like"
                  ? post.likesCount +
                    (userReactions[postId] === "dislike" ? 1 : 1)
                  : userReactions[postId] === "like"
                  ? post.likesCount - 1
                  : post.likesCount,
              dislikesCount:
                type === "dislike"
                  ? post.dislikesCount +
                    (userReactions[postId] === "like" ? 1 : 1)
                  : userReactions[postId] === "dislike"
                  ? post.dislikesCount - 1
                  : post.dislikesCount,
            }
          : post
      )
    );
    setUserReactions((prev) => ({ ...prev, [postId]: type }));

    try {
      const existingReactionQuery = query(
        collection(db, "postReactions"),
        where("postId", "==", postId),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(existingReactionQuery);

      if (!querySnapshot.empty) {
        const existingReaction = querySnapshot.docs[0];
        if (existingReaction.data().type === type) {
          setIsReacting((prev) => ({ ...prev, [postId]: false }));
          return;
        }
        await updateDoc(existingReaction.ref, { type });
      } else {
        await addDoc(collection(db, "postReactions"), {
          postId,
          userId: user.uid,
          type,
          postAuthorId: posts.find((post) => post.id === postId)?.userId,
          userName: user.displayName || user.email,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likesCount:
                  type === "like"
                    ? userReactions[postId] === "dislike"
                      ? post.likesCount - 1
                      : post.likesCount - 1
                    : userReactions[postId] === "like"
                    ? post.likesCount + 1
                    : post.likesCount,
                dislikesCount:
                  type === "dislike"
                    ? userReactions[postId] === "like"
                      ? post.dislikesCount - 1
                      : post.dislikesCount - 1
                    : userReactions[postId] === "dislike"
                    ? post.dislikesCount + 1
                    : post.dislikesCount,
              }
            : post
        )
      );
      setUserReactions((prev) => ({
        ...prev,
        [postId]: userReactions[postId] || null,
      }));
      console.error(`Error adding ${type}:`, error);
      alert(`Error al registrar ${type === "like" ? "like" : "dislike"}`);
    } finally {
      setIsReacting((prev) => ({ ...prev, [postId]: false }));
    }
  };

  if (loading) {
    return <div className="loading">Cargando posts...</div>;
  }

  return (
    <div className="posts-container">
      <h2>Posts Recientes</h2>
      {posts.length === 0 ? (
        <p>No hay posts aún. ¡Sé el primero en crear uno!</p>
      ) : (
        <PostsGrid
          posts={posts}
          userReactions={userReactions}
          isReacting={isReacting}
          onReaction={handleReaction}
        />
      )}
    </div>
  );
}
