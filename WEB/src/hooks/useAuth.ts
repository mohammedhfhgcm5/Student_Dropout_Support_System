import { useMutation } from "@tanstack/react-query";
import { authService } from "../api/authService";
import type { SignInDto, AuthResponse, SignUpDto } from "../types/authTypes";
import {
  setAuthToken,
  setStoredUser,
  removeAuthToken,
} from "../api/apiConfig"; // استخدم ملفك الأصلي هنا
import axios from "axios";
import { requestNotificationPermission } from "../firebase";

export const useAuth = () => {
  // 🟢 تسجيل الدخول فقط (للـ Admin / Staff / Field)
  const login = useMutation<AuthResponse, Error, SignInDto>({
    mutationFn: authService.signin,

    onSuccess: async (res) => {
      // 1️⃣ حفظ التوكن والمستخدم محليًا
      setAuthToken(res.token);
      setStoredUser(res.user);

      console.log("✅ تسجيل الدخول ناجح:", res.user);

      try {
        // 2️⃣ الحصول على VAPID Key من Firebase Console
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY

        // 3️⃣ طلب إذن الإشعارات من المتصفح + الحصول على FCM Token
        const fcmToken = await requestNotificationPermission(vapidKey);

        if (fcmToken) {
          console.log("✅ FCM Token:", fcmToken);

          // 4️⃣ إرسال التوكن إلى الباكند لحفظه في DeviceToken
          await axios.post("http://localhost:3000/device-token/register", {
            userId: res.user.id, // أو donorId حسب نوع المستخدم
            token: fcmToken,
            deviceType: "WEB",
          });

          console.log("💾 تم إرسال FCM Token إلى الباكند");
        } else {
          console.warn("⚠️ لم يتم منح إذن الإشعارات");
        }
      } catch (err) {
        console.error("❌ خطأ أثناء حفظ FCM Token:", err);
      }

      // 5️⃣ التوجيه إلى لوحة التحكم
      window.location.href = "/dashboard";
    },
  });

  // 🟡 إنشاء حساب جديد (فقط عند إنشاء المستخدم من الـ Dashboard)
  const adminCreateUser = useMutation<AuthResponse, Error, SignUpDto>({
    mutationFn: authService.signup,
    onSuccess: (res) => {
      // في حالة أردت تنبيه أو إعادة تحميل قائمة المستخدمين
      console.log("User created by admin:", res.user);
    },
  });

  // 🔴 تسجيل الخروج
  const logout = () => {
    removeAuthToken();
    window.location.href = "/login";
  };

  return {
    login,            // للاستخدام في صفحة تسجيل الدخول
    adminCreateUser,  // للاستخدام داخل Dashboard فقط
    logout,           // لتسجيل الخروج
  };
};
``
