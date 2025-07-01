export interface PostImage {
  imageUrl: string;
  imagePublicId: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

export interface PostAuthor {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface PostStats {
  likesCount: number;
  dislikesCount: number;
  commentsCount?: number;
  sharesCount?: number;
  viewCount?: number;
}

export interface PostModeration {
  moderated: boolean;
  moderatedBy?: string;
  moderatedAt?: Date;
  originalDescription?: string;
  moderationReason?: string;
}

export interface Post {
  id: string;
  author: PostAuthor;
  images: PostImage[];
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  stats: PostStats;
  moderation?: PostModeration;
  tags?: string[];
  location?: {
    name?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  privacy?: "public" | "friends" | "private";
}
