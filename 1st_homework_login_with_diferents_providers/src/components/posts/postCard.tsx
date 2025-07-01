"use client";

import Image from "next/image";
import { Post } from "@/types/post";
import { useAuth } from "@/context/authContext";

interface PostCardProps {
  post: Post;
  userReaction: "like" | "dislike" | null;
  isReacting: boolean;
  onReaction: (postId: string, type: "like" | "dislike") => void;
}

export function PostCard({
  post,
  userReaction,
  isReacting,
  onReaction,
}: PostCardProps) {
  const { user } = useAuth();

  return (
    <div className="post-card">
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
            Por:{" "}
            {post.userDisplayName &&
            post.userDisplayName.toLowerCase() !== "unknown" &&
            post.userDisplayName.toLowerCase() !== "usuario"
              ? post.userDisplayName
              : post.userEmail}
          </span>
          <span className="post-date">
            {post.createdAt.toLocaleDateString("es-ES")}
          </span>
        </div>
        <div className="post-reactions">
          <button
            className={`reaction-button like-button ${
              userReaction === "like" ? "active" : ""
            }`}
            onClick={() => onReaction(post.id, "like")}
            disabled={!user || isReacting}
          >
            👍 {post.likesCount}
          </button>
          <button
            className={`reaction-button dislike-button ${
              userReaction === "dislike" ? "active" : ""
            }`}
            onClick={() => onReaction(post.id, "dislike")}
            disabled={!user || isReacting}
          >
            👎 {post.dislikesCount}
          </button>
        </div>
      </div>
    </div>
  );
}
