import { Timestamp } from "firebase/firestore";

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  postId?: string;
  createdAt: Timestamp;
  read?: boolean;
}
export interface NotificationData {
  title: string;
  body: string;
  userId: string;
  postId?: string;
  type: "new_post" | "like" | "comment";
}
