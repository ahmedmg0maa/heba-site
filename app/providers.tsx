'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import type { User } from 'firebase/auth';
import { onAuthChange, getUserData } from '@/lib/firebase/auth';

// ─── Language Context ─────────────────────────────────────────────────────────

export type Lang = 'en' | 'ar';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

export const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
  dir: 'ltr',
});

export const useLang = () => useContext(LangContext);

// ─── Auth Context ─────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  userData: Record<string, unknown> | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

// ─── Cart Context ─────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  type: 'course' | 'book';
  title: string;
  price: number;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  total: 0,
  count: 0,
});

export const useCart = () => useContext(CartContext);

// ─── Translations ─────────────────────────────────────────────────────────────

const translations: Record<string, Record<string, string>> = {
  en: {
    'nav.home': 'Home', 'nav.about': 'About', 'nav.coaching': 'Coaching',
    'nav.courses': 'Courses', 'nav.books': 'Books', 'nav.blog': 'Blog',
    'nav.contact': 'Contact', 'nav.login': 'Login', 'nav.register': 'Register',
    'nav.account': 'My Account', 'nav.logout': 'Logout', 'nav.cart': 'Cart',
    'hero.tagline': 'Transform Your Life', 'hero.subtitle': 'Professional Coach & Educator',
    'hero.cta': 'Book a Session', 'hero.learn': 'Learn More',
    'section.about': 'About Heba', 'section.services': 'Services',
    'section.courses': 'Online Courses', 'section.testimonials': 'Success Stories',
    'section.blog': 'Latest Insights', 'section.cta': 'Ready to Transform?',
    'coaching.title': 'Coaching Sessions', 'coaching.60min': '60-Minute Session',
    'coaching.90min': '90-Minute Session', 'coaching.price60': '1,500 EGP',
    'coaching.price90': '1,800 EGP', 'coaching.online': 'Online Meeting',
    'coaching.phone': 'Phone Call', 'coaching.book': 'Book Now',
    'auth.email': 'Email Address', 'auth.password': 'Password',
    'auth.name': 'Full Name', 'auth.login': 'Sign In',
    'auth.register': 'Create Account', 'auth.google': 'Continue with Google',
    'auth.forgot': 'Forgot Password?', 'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'common.loading': 'Loading...', 'common.error': 'Something went wrong',
    'common.save': 'Save', 'common.cancel': 'Cancel', 'common.delete': 'Delete',
    'common.edit': 'Edit', 'common.view': 'View', 'common.add': 'Add',
    'common.search': 'Search', 'common.currency': 'EGP', 'common.readMore': 'Read More',
    'common.buyNow': 'Buy Now', 'common.addToCart': 'Add to Cart',
    'cart.title': 'Shopping Cart', 'cart.empty': 'Your cart is empty',
    'cart.checkout': 'Proceed to Checkout', 'cart.total': 'Total', 'cart.remove': 'Remove',
    'account.sessions': 'My Sessions', 'account.courses': 'My Courses',
    'account.orders': 'My Orders', 'account.settings': 'Settings',
  },
  ar: {
    'nav.home': 'الرئيسية', 'nav.about': 'عن هبة', 'nav.coaching': 'التدريب',
    'nav.courses': 'الكورسات', 'nav.books': 'الكتب', 'nav.blog': 'المدونة',
    'nav.contact': 'تواصل معنا', 'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب', 'nav.account': 'حسابي',
    'nav.logout': 'تسجيل الخروج', 'nav.cart': 'السلة',
    'hero.tagline': 'حوّل حياتك', 'hero.subtitle': 'مدربة ومعلمة محترفة',
    'hero.cta': 'احجز جلسة', 'hero.learn': 'اعرف أكثر',
    'section.about': 'عن هبة', 'section.services': 'الخدمات',
    'section.courses': 'الكورسات الأونلاين', 'section.testimonials': 'قصص النجاح',
    'section.blog': 'أحدث المقالات', 'section.cta': 'مستعد للتحول؟',
    'coaching.title': 'جلسات التدريب', 'coaching.60min': 'جلسة 60 دقيقة',
    'coaching.90min': 'جلسة 90 دقيقة', 'coaching.price60': '١٥٠٠ جنيه',
    'coaching.price90': '١٨٠٠ جنيه', 'coaching.online': 'اجتماع أونلاين',
    'coaching.phone': 'مكالمة هاتفية', 'coaching.book': 'احجز الآن',
    'auth.email': 'البريد الإلكتروني', 'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم الكامل', 'auth.login': 'تسجيل الدخول',
    'auth.register': 'إنشاء حساب', 'auth.google': 'المتابعة بـ Google',
    'auth.forgot': 'نسيت كلمة المرور؟', 'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',
    'common.loading': 'جاري التحميل...', 'common.error': 'حدث خطأ ما',
    'common.save': 'حفظ', 'common.cancel': 'إلغاء', 'common.delete': 'حذف',
    'common.edit': 'تعديل', 'common.view': 'عرض', 'common.add': 'إضافة',
    'common.search': 'بحث', 'common.currency': 'جنيه', 'common.readMore': 'اقرأ المزيد',
    'common.buyNow': 'اشتري الآن', 'common.addToCart': 'أضف للسلة',
    'cart.title': 'سلة التسوق', 'cart.empty': 'سلتك فارغة',
    'cart.checkout': 'إتمام الشراء', 'cart.total': 'الإجمالي', 'cart.remove': 'حذف',
    'account.sessions': 'جلساتي', 'account.courses': 'كورساتي',
    'account.orders': 'طلباتي', 'account.settings': 'الإعدادات',
  },
};

// ─── Providers Component ──────────────────────────────────────────────────────

export function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.body.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
  };

  const t = (key: string) => translations[lang]?.[key] ?? key;

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved) setLangState(saved);

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch {}
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const data = await getUserData(u.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const addItem = (item: CartItem) => {
    setCart((prev) => {
      const next = prev.find((i) => i.id === item.id) ? prev : [...prev, item];
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => {
      const next = prev.filter((i) => i.id !== id);
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const total = cart.reduce((sum, i) => sum + i.price, 0);

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <AuthContext.Provider value={{ user, userData, loading }}>
        <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, total, count: cart.length }}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#2a2520',
                color: '#f9f5ee',
                border: '1px solid #6e6751',
                fontFamily: 'inherit',
              },
            }}
          />
        </CartContext.Provider>
      </AuthContext.Provider>
    </LangContext.Provider>
  );
}
