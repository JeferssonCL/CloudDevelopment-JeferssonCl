"use client";

import { Post } from "@/types/post";
import { PostCard } from "./postCard";

interface PostsGridProps {
  posts: Post[];
  userReactions: { [postId: string]: "like" | "dislike" | null };
  isReacting: { [postId: string]: boolean };
  onReaction: (postId: string, type: "like" | "dislike") => void;
}

export function PostsGrid({
  posts,
  userReactions,
  isReacting,
  onReaction,
}: PostsGridProps) {
  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          userReaction={userReactions[post.id] || null}
          isReacting={isReacting[post.id] || false}
          onReaction={onReaction}
        />
      ))}
    </div>
  );
}
