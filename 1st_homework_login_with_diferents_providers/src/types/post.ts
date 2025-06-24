export interface Post {
  id: string;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  images: { imageUrl: string; imagePublicId: string }[];
  description: string;
  createdAt: Date;
}
