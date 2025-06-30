importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCICAUQT4rp9OYGoPE18M6-BY-3IrOAwac",
  authDomain: "pruebasdesarrolloenlanub-abc75.firebaseapp.com",
  projectId: "pruebasdesarrolloenlanub-abc75",
  storageBucket: "pruebasdesarrolloenlanub-abc75.firebasestorage.app",
  messagingSenderId: "444320753186",
  appId: "1:444320753186:web:9a669a30e730acde690c7b",
  measurementId: "G-ZNZD7VXHPW",
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
