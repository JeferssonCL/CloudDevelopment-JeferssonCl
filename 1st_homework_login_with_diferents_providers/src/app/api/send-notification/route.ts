import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

interface NotificationRequest {
  tokens: string[];
  notification: {
    title: string;
    body: string;
  };
  data?: {
    [key: string]: string;
  };
}

export async function POST(request: Request) {
  try {
    const body: NotificationRequest = await request.json();
    const { tokens, notification, data } = body;

    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return new Response(JSON.stringify({ message: "Invalid tokens array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!notification || !notification.title || !notification.body) {
      return new Response(
        JSON.stringify({ message: "Invalid notification data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: data || {},
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    const failedTokens: string[] = [];
    response.responses.forEach(
      (resp: admin.messaging.SendResponse, idx: number) => {
        if (!resp.success && resp.error) {
          console.error(`Failed to send to token ${tokens[idx]}:`, resp.error);
          failedTokens.push(tokens[idx]);
        }
      }
    );

    return new Response(
      JSON.stringify({
        message: "Notifications sent",
        successCount: response.successCount,
        failureCount: response.failureCount,
        failedTokens,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({
        message: "Error sending notification",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
