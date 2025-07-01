importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCi9DTPaE9rRHBASypCxInPa3ZoSpfGbTY",
  authDomain: "pruebasdesarrolloenlanub-2c0ee.firebaseapp.com",
  projectId: "pruebasdesarrolloenlanub-2c0ee",
  storageBucket: "pruebasdesarrolloenlanub-2c0ee.firebasestorage.app",
  messagingSenderId: "1056251548996",
  appId: "1:1056251548996:web:e4d8e90209bf7b46e77311",
  measurementId: "G-H25THQ7QBB",
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
