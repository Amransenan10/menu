"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, Store, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [slug, setSlug] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Create User in Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Create Tenant record
      const { error: tenantError } = await supabase.from("tenants").insert([
        {
          owner_id: authData.user.id,
          name_ar: restaurantName,
          slug: slug.toLowerCase().replace(/\s+/g, '-'),
          subscription_plan: "Starter",
          subscription_status: "Active"
        }
      ]);

      if (tenantError) {
          setError("تم إنشاء الحساب ولكن فشل إنشاء المطعم. تواصل مع الدعم.");
          setLoading(false);
      } else {
          router.push("/admin");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6" dir="rtl">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side: Steps Progress */}
        <div className="bg-gray-900 md:w-1/3 p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mt-32"></div>
            <div>
                <h2 className="text-2xl font-black mb-10 italic">منيو تيك</h2>
                <div className="space-y-8">
                    <div className={`flex items-center gap-4 transition-all ${step === 1 ? 'opacity-100' : 'opacity-40'}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm border-2 ${step === 1 ? 'border-primary bg-primary' : 'border-gray-700'}`}>1</div>
                        <div className="font-bold text-sm">بيانات الحساب</div>
                    </div>
                    <div className={`flex items-center gap-4 transition-all ${step === 2 ? 'opacity-100' : 'opacity-40'}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm border-2 ${step === 2 ? 'border-primary bg-primary' : 'border-gray-700'}`}>2</div>
                        <div className="font-bold text-sm">هوية المطعم</div>
                    </div>
                </div>
            </div>
            <div className="text-[10px] text-gray-500 font-bold">بإتمامك للتسجيل أنت توافق على شروط الخدمة.</div>
        </div>

        {/* Right Side: Form Content */}
        <div className="flex-1 p-10 md:p-14">
          <form onSubmit={handleRegister} className="h-full flex flex-col justify-center">
            
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-2 underline decoration-primary decoration-4">لنبدأ الرحلة</h1>
                    <p className="text-gray-400 font-bold text-sm">أنشئ حسابك الإداري أولاً.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 pr-2">البريد الإلكتروني</label>
                      <div className="relative">
                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border-gray-100 border rounded-2xl px-12 py-4 font-bold text-sm outline-none focus:ring-4 focus:ring-primary/5" />
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 pr-2">كلمة السر</label>
                      <div className="relative">
                        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border-gray-100 border rounded-2xl px-12 py-4 font-bold text-sm outline-none focus:ring-4 focus:ring-primary/5" />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>
                  </div>

                  <button type="button" onClick={() => setStep(2)} className="w-full bg-primary text-white py-5 rounded-[2rem] font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mt-10">
                    التالي <ArrowRight size={20} className="rotate-180" />
                  </button>
                </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">بيانات المطعم</h1>
                    <p className="text-gray-400 font-bold text-sm">أخبرنا عن مشروعك المميز.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 pr-2">اسم المطعم / المقهى</label>
                      <div className="relative">
                        <input required type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className="w-full bg-gray-50 border-gray-100 border rounded-2xl px-12 py-4 font-bold text-sm outline-none" />
                        <Store className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 pr-2">رابط المنيو المختصر (Slug)</label>
                      <div className="relative">
                        <input required type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="مثلاً: my-restaurant" className="w-full bg-gray-50 border-gray-100 border rounded-2xl px-12 py-4 font-bold text-sm outline-none" />
                        <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 font-mono">/r/</div>
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                  <div className="flex gap-4 mt-10">
                    <button type="submit" disabled={loading} className="flex-[2] bg-gray-900 text-white py-5 rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-3">
                      {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                      إكمال التسجيل
                    </button>
                    <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-[2rem] font-black">رجوع</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </form>
          
          <div className="mt-8 text-center text-xs font-bold">
            <span className="text-gray-400">لديك حساب بالفعل؟</span>
            <Link href="/login" className="text-primary mr-1 hover:underline">سجل دخولك</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
