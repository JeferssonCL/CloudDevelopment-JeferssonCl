import {
  onDocumentCreated,
  onDocumentWritten,
} from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions/v2";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

initializeApp();
const db = getFirestore();
const messaging = getMessaging();

const BANNED_WORDS = [
  "puto",
  "puta",
  "mierda",
  "carajo",
  "joder",
  "coño",
  "pendejo",
  "cabrón",
  "hijoputa",
  "marica",
  "maricón",
  "idiota",
  "estúpido",
  "imbécil",
  "shit",
  "fuck",
  "damn",
  "bitch",
  "asshole",
  "bastard",
];

function moderateContent(text: string): string {
  let moderatedText = text;

  BANNED_WORDS.forEach((word) => {
    const regex = new RegExp(word, "gi");
    moderatedText = moderatedText.replace(regex, "[REDACTED]");
  });

  return moderatedText;
}

export const moderatePost = onDocumentCreated(
  "posts/{postId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.error("No data associated with the event");
      return;
    }

    const postData = snapshot.data();
    const postId = event.params.postId;

    const moderatedDescription = moderateContent(postData.description);

    if (moderatedDescription !== postData.description) {
      await snapshot.ref.update({
        description: moderatedDescription,
        moderated: true,
        originalDescription: postData.description,
        moderatedAt: FieldValue.serverTimestamp(),
      });

      logger.log(`Post ${postId} fue moderado`);
    }
  }
);

export const handlePostReaction = onDocumentCreated(
  "postReactions/{reactionId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.error("No data associated with the event");
      return;
    }

    const reactionData = snapshot.data();
    const { postId, userId, type, postAuthorId } = reactionData;

    if (userId === postAuthorId) {
      return;
    }

    try {
      const userDoc = await db.collection("users").doc(userId).get();

      const userData = userDoc.data();
      const userName = userData?.displayName || userData?.email || "Usuario";

      const tokenDoc = await db
        .collection("userTokens")
        .doc(postAuthorId)
        .get();

      if (!tokenDoc.exists) {
        logger.log(`No se encontró token para el usuario ${postAuthorId}`);
        return;
      }

      const fcmToken = tokenDoc.data()?.fcmToken;

      if (!fcmToken) {
        logger.log(`Token FCM no válido para el usuario ${postAuthorId}`);
        return;
      }

      const notificationTitle =
        type === "like" ? "👍 Te dieron like!" : "👎 Te dieron dislike";
      const notificationBody = `${userName} ${
        type === "like" ? "le gustó" : "no le gustó"
      } tu publicación`;

      const message = {
        token: fcmToken,
        notification: {
          title: notificationTitle,
          body: notificationBody,
        },
        data: {
          type: "post_reaction",
          postId: postId,
          userId: userId,
          reactionType: type,
        },
      };

      await messaging.send(message);

      await db.collection("userNotifications").add({
        userId: postAuthorId,
        type: "post_reaction",
        title: notificationTitle,
        body: notificationBody,
        authorId: userId,
        authorName: userName,
        postId: postId,
        reactionType: type,
        createdAt: FieldValue.serverTimestamp(),
        read: false,
      });

      logger.log(`Notificación de ${type} enviada al usuario ${postAuthorId}`);
    } catch (error) {
      logger.error("Error enviando notificación de reacción:", error);
    }
  }
);

export const updatePostReactionCounts = onDocumentWritten(
  "postReactions/{reactionId}",
  async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    if (!afterData && !beforeData) return;

    const postId = afterData?.postId || beforeData?.postId;
    if (!postId) return;

    await db.runTransaction(async (transaction) => {
      const postRef = db.collection("posts").doc(postId);
      const postDoc = await transaction.get(postRef);

      if (!postDoc.exists) return;

      let likesDelta = 0;
      let dislikesDelta = 0;

      if (afterData && !beforeData) {
        if (afterData.type === "like") likesDelta = 1;
        else if (afterData.type === "dislike") dislikesDelta = 1;
      } else if (beforeData && !afterData) {
        if (beforeData.type === "like") likesDelta = -1;
        else if (beforeData.type === "dislike") dislikesDelta = -1;
      } else if (
        beforeData &&
        afterData &&
        beforeData.type !== afterData.type
      ) {
        if (beforeData.type === "like") {
          likesDelta = -1;
          dislikesDelta = 1;
        } else {
          likesDelta = 1;
          dislikesDelta = -1;
        }
      }

      const newLikes = (postDoc.data()?.likesCount || 0) + likesDelta;
      const newDislikes = (postDoc.data()?.dislikesCount || 0) + dislikesDelta;

      transaction.update(postRef, {
        likesCount: newLikes,
        dislikesCount: newDislikes,
      });
    });
  }
);
