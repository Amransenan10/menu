"use client";

import Link from "next/link";
import { Utensils, LayoutDashboard, Gift, Globe, CheckCircle2, Zap, Smartphone, BarChart3, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const plans = [
    {
      name: "الباقة الأساسية",
      price: "149",
      description: "للأعمال الناشئة التي تريد منيو بسيط واحترافي.",
      features: ["منيو رقمي QR", "تعديل غير محدود", "دعم لغة واحدة", "لوحة تحكم أساسية"],
      recommend: false,
      color: "gray"
    },
    {
      name: "باقة المحترفين",
      price: "299",
      description: "مثالية للمطاعم التي تريد زيادة ولاء عملائها.",
      features: ["كل مميزات الأساسية", "نظام ولاء (نقاط ومكافآت)", "دعم لغتين (عربي/إنجليزي)", "نظام استقبال الطلبات الحية", "دعم فني 24/7"],
      recommend: true,
      color: "orange"
    },
    {
      name: "باقة المؤسسات",
      price: "899",
      description: "للسلاسل والمتاجر الكبيرة التي تطلب التكامل الشامل.",
      features: ["إدارة فروع غير محدودة", "دومين خاص (restaurant.com)", "ربط مع أنظمة POS المحاسبية", "إحصائيات متقدمة بالذكاء الاصطناعي", "مدير حساب خاص"],
      recommend: false,
      color: "black"
    },
  ];

  return (
    <main className="min-h-screen bg-white text-right" dir="rtl">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 sticky top-0 bg-white/90 backdrop-blur-xl z-50 border-b border-gray-50 font-bold">
        <div className="flex items-center gap-2">
            <div className="bg-primary w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Utensils size={20} />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">منيو تيك</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-gray-500">
          <a href="#features" className="hover:text-primary transition-colors">المميزات</a>
          <a href="#loyalty" className="hover:text-primary transition-colors">نظام الولاء</a>
          <a href="#pricing" className="hover:text-primary transition-colors">الأسعار</a>
        </div>
        <div className="flex gap-3">
          <Link href="/admin" className="px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all">دخول</Link>
          <button className="px-6 py-2.5 text-sm text-white bg-primary rounded-xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all">ابدأ مجاناً</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 pt-24 pb-32 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-50/50 via-white to-white -z-10"></div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white border border-gray-100 rounded-2xl shadow-sm animate-bounce">
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
              <span className="text-xs font-black text-gray-600 tracking-wider">المنصة رقم #1 في الشرق الأوسط</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 text-gray-900 leading-tight">
            حوّل مطعمك إلى <span className="text-primary italic">تجربة رقمية</span> متكاملة
          </h1>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
             من المنيو الرقمي إلى أنظمة الولاء والتحكم بالفروع، "منيو تيك" هو شريكك لنمو مطعمك وزيادة مبيعاتك.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-gray-900 text-white px-10 py-5 rounded-2xl text-lg font-black shadow-2xl shadow-black/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 justify-center">
              اشترك الآن <ArrowRight size={20} className="rotate-180" />
            </button>
            <button className="bg-white border-2 border-gray-100 text-gray-700 px-10 py-5 rounded-2xl text-lg font-black hover:bg-gray-50 transition-all">
              شاهد مثال مباشر
            </button>
          </div>
        </motion.div>
      </section>

      {/* Loyalty System Highlight */}
      <section id="loyalty" className="px-8 py-32 bg-gray-900 text-white overflow-hidden relative">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
             <div className="relative">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">حفّز عملاءك للعودة مع <span className="text-primary">نظام الولاء</span></h2>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">
                   لا يقتصر الأمر على الطلب فقط، بل اجعل كل ريال يدفعه العميل يتحول إلى نقاط ومكافآت تشجعه على تكرار الزيارة. نظامنا يقوم بالباقي تلقائياً!
                </p>
                <div className="space-y-6">
                   <div className="flex gap-4 items-start">
                      <div className="bg-primary/20 p-3 rounded-xl text-primary"><Gift size={24}/></div>
                      <div>
                         <h4 className="font-bold text-xl mb-1">مكافآت مخصصة</h4>
                         <p className="text-gray-500 text-sm">حدد المكافآت التي تناسب مطعمك (وجبة مجانية، خصم، حلى).</p>
                      </div>
                   </div>
                   <div className="flex gap-4 items-start">
                      <div className="bg-primary/20 p-3 rounded-xl text-primary"><Smartphone size={24}/></div>
                      <div>
                         <h4 className="font-bold text-xl mb-1">تحصيل النقاط عبر الجوال</h4>
                         <p className="text-gray-500 text-sm">ببساطة عبر رقم الجوال أو مسح الباركود، يجمع عملاؤك نقاطهم.</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="relative flex justify-center">
                <div className="w-72 h-[600px] bg-white rounded-[3rem] p-4 shadow-2xl relative z-10 overflow-hidden border-8 border-gray-800">
                    <div className="bg-primary h-40 rounded-b-3xl -mx-4 -mt-4 p-8 flex flex-col items-center justify-center text-center">
                        <div className="text-xs font-bold opacity-80 mb-2">نقاطك الحالية</div>
                        <div className="text-4xl font-black">1,250</div>
                    </div>
                    <div className="pt-8 space-y-4">
                        <div className="text-black font-black text-center mb-6">المكافآت المتاحة</div>
                        {[1,2,3].map(i => (
                            <div key={i} className="bg-gray-50 p-4 rounded-3xl flex items-center gap-3 border border-gray-100">
                                <div className="bg-orange-100 p-2 rounded-xl text-primary"><Gift size={16}/></div>
                                <div className="flex-1">
                                    <div className="text-black text-xs font-bold">وجبة برجر مجانية</div>
                                    <div className="text-[10px] text-gray-400">تحتاج 500 نقطة</div>
                                </div>
                                <button className="bg-primary text-white text-[10px] px-3 py-1.5 rounded-full font-black">استبدال</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[80px]"></div>
             </div>
          </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-8 py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-4">خطط نمو تناسب طموحك</h2>
            <p className="text-gray-500 text-lg font-medium">سواء كنت مطعماً واحداً أو سلسلة عالمية، لدينا الباقة المناسبة.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`relative p-10 rounded-[3rem] bg-white border-2 ${plan.recommend ? "border-primary shadow-2xl scale-105 z-10" : "border-gray-50 shadow-sm"} flex flex-col`}
              >
                {plan.recommend && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full text-xs font-black shadow-lg">الأكثر نمواً</span>
                )}
                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-8 font-medium">{plan.description}</p>
                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-5xl font-black">{plan.price}</span>
                  <span className="text-gray-400 text-sm font-bold">ر.س / شهر</span>
                </div>
                <ul className="space-y-5 mb-12 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-gray-700 font-bold">
                      <CheckCircle2 size={20} className={plan.recommend ? "text-primary" : "text-green-500"} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-5 rounded-[2rem] font-black transition-all text-lg ${
                  plan.recommend ? "bg-primary text-white hover:bg-primary-dark shadow-2xl shadow-primary/30" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                  ابدأ التجربة
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-20 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
           <div>
               <div className="text-3xl font-black text-gray-900 tracking-tighter mb-4">منيو تيك</div>
               <p className="text-gray-400 text-sm max-w-xs leading-relaxed font-medium">المنصة الشاملة لإدارة المطاعم وزيادة المبيعات عبر الحلول الرقمية الذكية.</p>
           </div>
           <div className="flex gap-12 font-bold text-sm text-gray-600">
                <div className="space-y-3 flex flex-col">
                    <span className="text-gray-900 font-black mb-2">المنتج</span>
                    <a href="#" className="hover:text-primary">نظام المنيو</a>
                    <a href="#" className="hover:text-primary">نظام الولاء</a>
                    <a href="#" className="hover:text-primary">إدارة الفروع</a>
                </div>
                <div className="space-y-3 flex flex-col">
                    <span className="text-gray-900 font-black mb-2">الدعم</span>
                    <a href="#" className="hover:text-primary">تواصل معنا</a>
                    <a href="#" className="hover:text-primary">الأسئلة الشائعة</a>
                    <a href="#" className="hover:text-primary">التوثيق</a>
                </div>
           </div>
           <div className="flex flex-col items-center md:items-end gap-4">
                <div className="text-xs text-gray-400">© 2026 جميع الحقوق محفوظة لـ منيو تيك.</div>
                <div className="flex gap-4">
                    {/* Social Icons Mockup */}
                    <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                    <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                </div>
           </div>
        </div>
      </footer>
    </main>
  );
}
