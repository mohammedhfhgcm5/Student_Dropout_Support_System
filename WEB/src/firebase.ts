import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBN9Jej3jkra2diWbV_QVf8mnrEt7wRbBU",
  authDomain: "student-dropout-support-system.firebaseapp.com",
  projectId: "student-dropout-support-system",
  storageBucket: "student-dropout-support-system.firebasestorage.app",
  messagingSenderId: "731903511695",
  appId: "1:731903511695:web:7ba778bc65a47d2863b4fa",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export async function requestNotificationPermission(vapidKey: string) {
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return null;

  const token = await getToken(messaging, { vapidKey });
  return token; // هذا اللي رح نرسله للباكند
}

export function listenForMessages(cb: (p: any) => void) {
  onMessage(messaging, (payload) => cb(payload));
}
