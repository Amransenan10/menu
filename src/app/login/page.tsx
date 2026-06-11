"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("خطأ في البيانات! تأكد من البريد الإلكتروني وكلمة السر.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-bold" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100 overflow-hidden">
        <div className="bg-primary p-10 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <h1 className="text-3xl font-black mb-2">منيو تيك</h1>
            <p className="text-white/80 text-sm">مرحباً بك مجدداً في لوحة التحكم</p>
        </div>

        <div className="p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    {error}
                </div>
            )}

            <div className="space-y-2 text-right">
              <label className="text-sm font-medium text-gray-500 pr-2 italic">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono text-sm"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="space-y-2 text-right">
              <label className="text-sm font-medium text-gray-500 pr-2 italic">كلمة السر</label>
              <div className="relative">
                <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono text-sm"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-gray-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
              تسجيل الدخول
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-xs">ليس لديك حساب؟</p>
            <Link href="/" className="text-primary text-sm font-black mt-2 inline-block hover:underline">اطلب انضمامك الآن</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
