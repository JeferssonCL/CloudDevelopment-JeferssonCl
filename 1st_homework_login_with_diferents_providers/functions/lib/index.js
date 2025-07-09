// functions/src/index.ts
import { onDocumentCreated, onDocumentWritten, } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions/v2";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
initializeApp();
const db = getFirestore();
const messaging = getMessaging();
// Lista de palabras prohibidas (puedes expandir esta lista)
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
    // Agrega más palabras según necesites
];
// Función para moderar contenido
function moderateContent(text) {
    let moderatedText = text;
    BANNED_WORDS.forEach((word) => {
        const regex = new RegExp(word, "gi");
        moderatedText = moderatedText.replace(regex, "[REDACTED]");
    });
    return moderatedText;
}
// Cloud Function v2 que se ejecuta cuando se crea un post
export const moderatePost = onDocumentCreated("posts/{postId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        logger.error("No data associated with the event");
        return;
    }
    const postData = snapshot.data();
    const postId = event.params.postId;
    // Moderar la descripción
    const moderatedDescription = moderateContent(postData.description);
    // Si el contenido fue moderado, actualizar el post
    if (moderatedDescription !== postData.description) {
        await snapshot.ref.update({
            description: moderatedDescription,
            moderated: true,
            originalDescription: postData.description, // Guardar original para referencia
            moderatedAt: FieldValue.serverTimestamp(),
        });
        logger.log(`Post ${postId} fue moderado`);
    }
});
// Cloud Function v2 para manejar likes/dislikes
export const handlePostReaction = onDocumentCreated("postReactions/{reactionId}", async (event) => {
    var _a;
    const snapshot = event.data;
    if (!snapshot) {
        logger.error("No data associated with the event");
        return;
    }
    const reactionData = snapshot.data();
    const { postId, userId, type, postAuthorId } = reactionData;
    // No notificar si el usuario reacciona a su propio post
    if (userId === postAuthorId) {
        return;
    }
    try {
        // Obtener información del usuario que reaccionó
        const userDoc = await db.collection("users").doc(userId).get();
        const userData = userDoc.data();
        const userName = (userData === null || userData === void 0 ? void 0 : userData.displayName) || (userData === null || userData === void 0 ? void 0 : userData.email) || "Usuario";
        // Obtener el token FCM del dueño del post
        const tokenDoc = await db
            .collection("userTokens")
            .doc(postAuthorId)
            .get();
        if (!tokenDoc.exists) {
            logger.log(`No se encontró token para el usuario ${postAuthorId}`);
            return;
        }
        const fcmToken = (_a = tokenDoc.data()) === null || _a === void 0 ? void 0 : _a.fcmToken;
        if (!fcmToken) {
            logger.log(`Token FCM no válido para el usuario ${postAuthorId}`);
            return;
        }
        // Crear mensaje de notificación
        const notificationTitle = type === "like" ? "👍 Te dieron like!" : "👎 Te dieron dislike";
        const notificationBody = `${userName} ${type === "like" ? "le gustó" : "no le gustó"} tu publicación`;
        // Enviar notificación push
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
        // Crear notificación en la base de datos
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
    }
    catch (error) {
        logger.error("Error enviando notificación de reacción:", error);
    }
});
export const updatePostReactionCounts = onDocumentWritten("postReactions/{reactionId}", async (event) => {
    var _a, _b;
    const beforeData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before.data();
    const afterData = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after.data();
    if (!afterData && !beforeData)
        return;
    const postId = (afterData === null || afterData === void 0 ? void 0 : afterData.postId) || (beforeData === null || beforeData === void 0 ? void 0 : beforeData.postId);
    if (!postId)
        return;
    await db.runTransaction(async (transaction) => {
        var _a, _b;
        const postRef = db.collection("posts").doc(postId);
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists)
            return;
        let likesDelta = 0;
        let dislikesDelta = 0;
        if (afterData && !beforeData) {
            if (afterData.type === "like")
                likesDelta = 1;
            else if (afterData.type === "dislike")
                dislikesDelta = 1;
        }
        else if (beforeData && !afterData) {
            if (beforeData.type === "like")
                likesDelta = -1;
            else if (beforeData.type === "dislike")
                dislikesDelta = -1;
        }
        else if (beforeData &&
            afterData &&
            beforeData.type !== afterData.type) {
            if (beforeData.type === "like") {
                likesDelta = -1;
                dislikesDelta = 1;
            }
            else {
                likesDelta = 1;
                dislikesDelta = -1;
            }
        }
        const newLikes = (((_a = postDoc.data()) === null || _a === void 0 ? void 0 : _a.likesCount) || 0) + likesDelta;
        const newDislikes = (((_b = postDoc.data()) === null || _b === void 0 ? void 0 : _b.dislikesCount) || 0) + dislikesDelta;
        transaction.update(postRef, {
            likesCount: newLikes,
            dislikesCount: newDislikes,
        });
    });
});
//# sourceMappingURL=index.js.map