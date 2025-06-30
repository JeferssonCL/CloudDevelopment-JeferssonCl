importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBm8pM_LxbtlKQ9zhU76lqhWvEiqwtitxo",
  authDomain: "pruebasdesarrolloenlanube.firebaseapp.com",
  projectId: "pruebasdesarrolloenlanube",
  storageBucket: "pruebasdesarrolloenlanube.firebasestorage.app",
  messagingSenderId: "541219366264",
  appId: "1:541219366264:web:c5b2cc5b2a2bb0c748948d",
  measurementId: "G-JR40SQKSRB",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const { title, body } = payload.notification;

  const options = {
    body: body,
    icon: "/logo-logomark.png",
    badge: "/logo-logomark.png",
    data: payload.data,
    actions: [{ action: "view", title: "Ver Post" }],
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  if (event.action === "view") {
    event.waitUntil(clients.openWindow("/"));
  }
});
