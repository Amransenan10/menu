"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  Utensils, LayoutDashboard, Gift, Globe, CheckCircle2, Zap, 
  Smartphone, BarChart3, ArrowRight, ShieldCheck, Star 
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [settings, setSettings] = useState({
      hero_title: "منيو تيك - طريقك للتحول الرقمي",
      hero_subtitle: "المنصة الشاملة لإدارة المطاعم وزيادة المبيعات عبر الحلول الرقمية الذكية.",
      primary_color: "#FF6B00",
  });

  useEffect(() => {
      fetchSettings();
  }, []);

  async function fetchSettings() {
      try {
        const { data } = await supabase.from("site_settings").select("*").single();
        if (data) setSettings(data);
      } catch (err) {
        console.log("Settings not found yet");
      }
  }

  const plans = [
    {
      name: "الباقة الأساسية",
      price: "199",
      features: ["منيو رقمي كامل", "3 فروع", "نظام الولاء الأساسي", "دعم فني"],
      color: "bg-blue-600",
    },
    {
      name: "الباقة الاحترافية",
      price: "499",
      features: ["باقات مخصصة", "فروع غير محدودة", "نظام ولاء متقدم", "تقارير ذكاء اصطناعي", "دعم 24/7"],
      color: "bg-primary",
      featured: true,
    },
    {
      name: "باقة النخبة",
      price: "999",
      features: ["حلول مخصصة بالكامل", "تطبيق أندرويد و iOS خاص", "تكامل مع أنظمة المحاسبة", "مدير حساب خاص"],
      color: "bg-gray-900",
    },
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-primary selection:text-white" dir="rtl">
      {/* Dynamic Primary Color Style */}
      <style jsx global>{`
        :root { --primary: ${settings.primary_color}; }
        .text-primary { color: ${settings.primary_color}; }
        .bg-primary { background-color: ${settings.primary_color}; }
        .border-primary { border-color: ${settings.primary_color}; }
      `}</style>
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 px-6 py-5 flex justify-between items-center">
          <div className="text-3xl font-black text-gray-900 tracking-tighter">منيو تيك</div>
          <div className="hidden lg:flex gap-10 font-bold text-sm text-gray-400">
              <a href="#features" className="hover:text-primary transition-colors font-black">المميزات</a>
              <a href="#loyalty" className="hover:text-primary transition-colors font-black">نظام الولاء</a>
              <a href="#pricing" className="hover:text-primary transition-colors font-black">الأسعار</a>
          </div>
          <div className="flex items-center gap-4">
              <Link href="/login" className="font-bold text-sm hover:text-primary transition-colors">دخول</Link>
              <Link href="/register" className="bg-primary text-white (settings.primary_color) px-8 py-3.5 rounded-2xl font-black text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">ابدأ مجاناً</Link>
          </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-44 pb-32 px-6 overflow-hidden relative">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 relative z-10 text-right">
                  <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tighter">
                      {settings.hero_title}
                  </h1>
                  <p className="text-xl text-gray-400 font-medium max-w-xl leading-relaxed">
                      {settings.hero_subtitle}
                  </p>
                  <div className="flex flex-wrap gap-6 pt-4">
                      <Link href="/register" className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black shadow-2xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all">اشترك الآن</Link>
                      <Link href="/r/default" className="bg-white border-2 border-gray-100 text-gray-900 px-10 py-5 rounded-[2rem] font-black hover:bg-gray-50 transition-all">مشاهدة ديمو</Link>
                  </div>
              </motion.div>
              
              <div className="relative">
                  <div className="absolute -inset-10 bg-primary/20 blur-[120px] rounded-full"></div>
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white p-4 rounded-[3rem] shadow-2xl border border-gray-100">
                      <img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800" className="w-full h-auto rounded-[2.5rem]" alt="Dashboard Preview" />
                  </motion.div>
              </div>
          </div>
      </section>

      {/* Features Table Style */}
      <section id="features" className="py-32 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-black text-gray-900 mb-4">لماذا تختار منيو تيك؟</h2>
                <p className="text-gray-500 font-bold">نقدم لك كل ما تحتاجه لإدارة مطعمك في مكان واحد.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: Smartphone, title: "منيو ذكي", desc: "تجربة طلب سريعة ومنيو جميل يجذب الزبائن." },
                    { icon: Gift, title: "نظام ولاء", desc: "حول زبائنك لزبائن دائمين عبر نظام النقاط المدمج." },
                    { icon: BarChart3, title: "تحليلات دقيقة", desc: "راقب مبيعاتك وأداء مطعمك لحظة بلحظة." }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 hover:shadow-2xl transition-all group">
                        <div className="bg-primary/10 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                            <item.icon size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                        <p className="text-gray-500 leading-relaxed font-bold">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}
