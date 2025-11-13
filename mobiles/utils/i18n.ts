export type Lang = 'en' | 'ar';

const BACKEND_MAP: Record<string, { en: string; ar: string }> = {
  male: { en: 'Male', ar: 'ذكر' },
  female: { en: 'Female', ar: 'أنثى' },
  other: { en: 'Other', ar: 'آخر' },
  active: { en: 'Active', ar: 'نشط' },
  dropout: { en: 'Dropout', ar: 'منقطع' },
  at_risk: { en: 'At Risk', ar: 'معرض للخطر' },
  returned: { en: 'Returned', ar: 'عاد' },
  arabic: { en: 'Arabic', ar: 'العربية' },
  english: { en: 'English', ar: 'الإنجليزية' },
  french: { en: 'French', ar: 'الفرنسية' },
  spanish: { en: 'Spanish', ar: 'الإسبانية' },
  tuition: { en: 'Tuition', ar: 'الرسوم الدراسية' },
  books: { en: 'Books', ar: 'الكتب' },
  transportation: { en: 'Transportation', ar: 'المواصلات' },
  meals: { en: 'Meals', ar: 'الوجبات' },
  pending: { en: 'Pending', ar: 'قيد الانتظار' },
  completed: { en: 'Completed', ar: 'مكتمل' },
  failed: { en: 'Failed', ar: 'فشل' },
  cancelled: { en: 'Cancelled', ar: 'أُلغي' },
  usd: { en: 'USD', ar: 'دولار أمريكي' },
  eur: { en: 'EUR', ar: 'يورو' },
  egp: { en: 'EGP', ar: 'جنيه مصري' },
  donor: { en: 'Donor', ar: 'المتبرع' },
  admin: { en: 'Admin', ar: 'مسؤول' },
  en: { en: 'English', ar: 'الإنجليزية' },
  ar: { en: 'Arabic', ar: 'العربية' },
};

export function translateBackend(value?: string | null, lang: Lang = 'en'): string {
  if (!value) return '';
  const raw = String(value).trim().toLowerCase();
  const candidates = [raw, raw.replace(/\s+/g, '_'), raw.replace(/-/g, '_'), raw.replace(/[^a-z0-9_]/g, '')];
  for (const c of candidates) {
    const hit = (BACKEND_MAP as any)[c];
    if (hit) return hit[lang as 'en' | 'ar'];
  }
  return value;
}
