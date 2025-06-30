import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  doc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db, getFCMToken } from "@/credentials";
import { NotificationData } from "@/types/notification";

export const saveUserFCMToken = async (userId: string): Promise<void> => {
  try {
    const token = await getFCMToken();
    if (token) {
      await setDoc(doc(db, "userTokens", userId), {
        fcmToken: token,
        userId,
        updatedAt: serverTimestamp(),
      });
      console.log("FCM token saved successfully");
    }
  } catch (error) {
    console.error("Error saving FCM token:", error);
  }
};

export const getAllUserTokensAndIds = async (
  excludeUserId: string
): Promise<{ tokens: string[]; userIds: string[] }> => {
  try {
    const tokensQuery = query(collection(db, "userTokens"));
    const tokensSnapshot = await getDocs(tokensQuery);
    const tokens: string[] = [];
    const userIds: string[] = [];

    tokensSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userId !== excludeUserId && data.fcmToken) {
        tokens.push(data.fcmToken);
        userIds.push(data.userId);
      }
    });

    return { tokens, userIds };
  } catch (error) {
    console.error("Error getting user tokens:", error);
    return { tokens: [], userIds: [] };
  }
};

export const getUserTokens = async (
  excludeUserId: string
): Promise<string[]> => {
  const { tokens } = await getAllUserTokensAndIds(excludeUserId);
  return tokens;
};

export const sendNotificationToUsers = async (
  tokens: string[],
  notificationData: NotificationData
): Promise<void> => {
  try {
    const response = await fetch("/api/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokens,
        notification: {
          title: notificationData.title,
          body: notificationData.body,
        },
        data: {
          userId: notificationData.userId,
          postId: notificationData.postId || "",
          type: notificationData.type,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send notification");
    }

    console.log("Notifications sent successfully");
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

export const createUserNotifications = async (
  userIds: string[],
  notificationData: NotificationData
): Promise<void> => {
  try {
    const batch = writeBatch(db);

    userIds.forEach((userId) => {
      const notificationRef = doc(collection(db, "userNotifications"));
      batch.set(notificationRef, {
        userId: userId,
        type: notificationData.type,
        title: notificationData.title,
        body: notificationData.body,
        authorId: notificationData.userId,
        authorName: notificationData.body.split(" ha publicado")[0],
        postId: notificationData.postId,
        createdAt: serverTimestamp(),
        read: false,
      });
    });

    await batch.commit();
    console.log("User notifications created successfully");
  } catch (error) {
    console.error("Error creating user notifications:", error);
  }
};

export const notifyNewPost = async (
  authorId: string,
  authorName: string,
  postId: string
): Promise<void> => {
  try {
    const { tokens, userIds } = await getAllUserTokensAndIds(authorId);

    if (tokens.length === 0) {
      console.log("No hay usuarios para notificar");
      return;
    }

    const notificationData: NotificationData = {
      title: "¡Nueva publicación!",
      body: `${authorName} ha publicado algo nuevo`,
      userId: authorId,
      postId,
      type: "new_post",
    };

    await sendNotificationToUsers(tokens, notificationData);

    await createUserNotifications(userIds, notificationData);

    await addDoc(collection(db, "notifications"), {
      type: "new_post",
      title: "¡Nuevo Post!",
      body: `${authorName} ha publicado algo nuevo`,
      authorId,
      authorName,
      postId,
      createdAt: serverTimestamp(),
      sentToTokens: tokens.length,
      sentToUsers: userIds.length,
    });

    console.log(`Notificación enviada a ${tokens.length} usuarios`);
  } catch (error) {
    console.error("Error sending new post notification:", error);
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};
