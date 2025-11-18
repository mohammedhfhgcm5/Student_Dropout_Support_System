import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform, Text as RNText } from "react-native";

type Lang = "en" | "ar";

type Dict = Record<string, { en: string; ar: string }>;

const STRINGS: Dict = {
  loadingProfile: {
    en: "Loading profile...",
    ar: "جارٍ تحميل الملف الشخصي...",
  },
  donor: { en: "DONOR", ar: "المتبرع" },
  profile: { en: "Profile", ar: "الملف الشخصي" },
  personalInfo: { en: "Personal Information", ar: "المعلومات الشخصية" },
  identification: { en: "Identification", ar: "الهوية" },
  nationalNumber: { en: "NATIONAL NUMBER", ar: "الرقم الوطني" },
  fullName: { en: "FULL NAME", ar: "الاسم الكامل" },
  emailAddress: { en: "Email Address", ar: "البريد الإلكتروني" },
  phoneNumber: { en: "PHONE NUMBER", ar: "رقم الهاتف" },
  placeholderFullName: { en: "Enter your full name", ar: "أدخل اسمك الكامل" },
  placeholderEmail: {
    en: "your.email@example.com",
    ar: "your.email@example.com",
  },
  placeholderPhone: { en: "+1 (555) 123-4567", ar: "+1 (555) 123-4567" },
  edit: { en: "Edit", ar: "تعديل" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  saveChanges: { en: "Save Changes", ar: "حفظ التغييرات" },
  signOut: { en: "Sign Out", ar: "تسجيل الخروج" },
  toastProfileUpdated: {
    en: "Profile updated successfully",
    ar: "تم تحديث الملف الشخصي بنجاح",
  },
  toastUpdateFailed: {
    en: "Failed to update profile",
    ar: "فشل تحديث الملف الشخصي",
  },
  donorNameFallback: { en: "Donor", ar: "متبرع" },
  noEmailProvided: { en: "No email provided", ar: "لا يوجد بريد إلكتروني" },
  notProvided: { en: "Not provided", ar: "غير متوفر" },
  notAssigned: { en: "Not assigned", ar: "غير معيّن" },

  // Sign in
  signIn: { en: "Sign In", ar: "تسجيل الدخول" },
  donorPortal: { en: "Donor Portal", ar: "بوابة المتبرعين" },
  makeDifference: { en: "Make a difference today", ar: "اصنع فرقاً اليوم" },
  forgotPassword: { en: "Forgot your password?", ar: "هل نسيت كلمة المرور؟" },
  backToSignIn: { en: "← Back to Sign In", ar: "← الرجوع إلى تسجيل الدخول" },
  resetPassword: { en: "Reset Password", ar: "إعادة تعيين كلمة المرور" },
  placeholderEnterPassword: {
    en: "Enter your password",
    ar: "أدخل كلمة المرور",
  },
  placeholderNewPassword: { en: "New password", ar: "كلمة مرور جديدة" },
  placeholderEmailShort: { en: "Email", ar: "البريد الإلكتروني" },
  alertEnterEmail: {
    en: "Please enter your email",
    ar: "يرجى إدخال بريدك الإلكتروني",
  },
  alertPasswordLen: {
    en: "New password must be at least 6 characters",
    ar: "يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل",
  },
  alertPwUpdated: {
    en: "Password updated. Signing you in...",
    ar: "تم تحديث كلمة المرور. يتم تسجيل الدخول...",
  },
  toastLoginOk: { en: "Signed in successfully!", ar: "تم تسجيل الدخول بنجاح!" },
  toastLoginFail: { en: "Login failed", ar: "فشل تسجيل الدخول" },
  or: { en: "OR", ar: "أو" },
  createNewAccount: { en: "Create New Account", ar: "إنشاء حساب جديد" },

  // Sign up
  createAccount: { en: "Create Account", ar: "إنشاء حساب" },
  joinAsDonor: { en: "Join as a Donor", ar: "انضم كمتبرع" },
  createAccountSubtitle: {
    en: "Create your account and start making a difference",
    ar: "أنشئ حسابك وابدأ بصنع الفرق",
  },
  alreadyHave: {
    en: "Already have an account? Sign In",
    ar: "لديك حساب بالفعل؟ تسجيل الدخول",
  },
  password: { en: "Password", ar: "كلمة المرور" },

  // Tabs
  students: { en: "Students", ar: "الطلاب" },
  donations: { en: "Donations", ar: "التبرعات" },
  settings: { en: "Settings", ar: "الإعدادات" },
  searchStudentsPlaceholder: {
    en: "Search by name or national number...",
    ar: "ابحث بالاسم أو الرقم الوطني...",
  },

  // Donations
  selectPurpose: { en: "Select a purpose", ar: "اختر الغرض" },
  dateOfBirth: { en: "Date of Birth", ar: "تاريخ الميلاد" },
  mainLanguage: { en: "Main Language", ar: "اللغة الأساسية" },
  acquiredLanguage: { en: "Acquired Language", ar: "اللغة المكتسبة" },
  supportNeeds: { en: "Support Needs", ar: "الاحتياجات" },
  studentSince: { en: "Student since", ar: "طالب منذ" },
  supportThisStudent: { en: "Support This Student", ar: "ادعم هذا الطالب" },
  loadingStudents: { en: "Loading students...", ar: "جارٍ تحميل الطلاب..." },
  failedToLoadStudents: {
    en: "Failed to load students",
    ar: "فشل تحميل الطلاب",
  },
  retry: { en: "Retry", ar: "إعادة المحاولة" },
  noStudentsFound: { en: "No students found", ar: "لا يوجد طلاب" },
  donationPurposeLabel: { en: "Purpose", ar: "الغرض" },
  donationStudentLabel: { en: "Student", ar: "الطالب" },
  paymentMethodLabel: { en: "Payment Method", ar: "طريقة الدفع" },
  dateLabel: { en: "Date", ar: "التاريخ" },
  referenceLabel: { en: "Reference", ar: "المرجع" },
  loadingDonations: {
    en: "Loading donations...",
    ar: "جارٍ تحميل التبرعات...",
  },
  failedToLoadDonations: {
    en: "Failed to load donations",
    ar: "فشل تحميل التبرعات",
  },
  noDonationsYet: { en: "No donations yet", ar: "لا توجد تبرعات بعد" },
  startMakingDifference: {
    en: "Start making a difference today",
    ar: "ابدأ بصناعة الأثر اليوم",
  },
  donationsHeaderSubtitle: { en: "YOUR", ar: "تبرعاتك" },
  donationConfirmed: { en: "Donation confirmed", ar: "تم تأكيد التبرع" },
  donationsConfirmedMany: {
    en: "{count} donations confirmed",
    ar: "تم تأكيد {count} تبرعات",
  },
};

// Font configuration for Arabic
const getFontForLanguage = (lang: Lang) => {
  if (lang === "ar") {
    return Platform.select({
      ios: "Damascus", // Formal Arabic font for iOS
      android: "sans-serif", // Android default with Arabic support
      default: undefined,
    });
  }
  return Platform.select({
    ios: "System",
    android: "Roboto",
    default: undefined,
  });
};

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: keyof typeof STRINGS) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const STORE_KEY = "languagePreference";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Lang>("en");

  // Update font when language changes
  const updateFont = (newLang: Lang) => {
    const TextComponent = RNText as any;
    if (!TextComponent.defaultProps) {
      TextComponent.defaultProps = {};
    }
    if (!TextComponent.defaultProps.style) {
      TextComponent.defaultProps.style = {};
    }
    TextComponent.defaultProps.style.fontFamily = getFontForLanguage(newLang);
  };

  useEffect(() => {
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync(STORE_KEY);
        if (saved === "en" || saved === "ar") {
          setLangState(saved);
          updateFont(saved);
        } else {
          updateFont("en");
        }
      } catch {
        updateFont("en");
      }
    })();
  }, []);

  const setLang = (value: Lang) => {
    setLangState(value);
    updateFont(value);
    SecureStore.setItemAsync(STORE_KEY, value).catch(() => {});
  };

  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");

  const isRTL = lang === "ar";

  const t = (key: keyof typeof STRINGS) => STRINGS[key]?.[lang] ?? key;

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t, isRTL }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: "en" as Lang,
      setLang: () => {},
      toggleLang: () => {},
      t: (k: keyof typeof STRINGS) => STRINGS[k]?.en ?? String(k),
      isRTL: false,
    } as LanguageContextType;
  }
  return ctx;
};
