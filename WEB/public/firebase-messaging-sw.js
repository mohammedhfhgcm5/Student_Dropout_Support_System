importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBN9Jej3jkra2diWbV_QVf8mnrEt7wRbBU",
  authDomain: "student-dropout-support-system.firebaseapp.com",
  projectId: "student-dropout-support-system",
  storageBucket: "student-dropout-support-system.firebasestorage.app",
  messagingSenderId: "731903511695",
  appId: "1:731903511695:web:7ba778bc65a47d2863b4fa",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'New Notification', { body });
});
