"use client";

import { useState, useEffect } from "react";
import { Save, Image as ImageIcon, Palette, Type, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CSMSettings() {
  const [settings, setSettings] = useState({
    hero_title: "منيو تيك - طريقك للتحول الرقمي",
    hero_subtitle: "المنصة الشاملة لإدارة المطاعم وزيادة المبيعات عبر الحلول الرقمية الذكية.",
    primary_color: "#FF6B00",
    contact_whatsapp: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    const { data } = await supabase.from("site_settings").select("*").single();
    if (data) setSettings(data);
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert([settings]);
    if (!error) alert("✅ تم تحديث إعدادات الواجهة بنجاح!");
    setSaving(false);
  }

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-gray-900">التحكم في الواجهة الرئيسية</h1>
        <p className="text-gray-500 font-bold">عدل العناوين، الألوان، والنصوص التي تظهر للزوار في الصفحة الأولى.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-10 space-y-8">
        {/* Hero Section Edit */}
        <div className="space-y-4">
            <label className="flex items-center gap-2 font-black text-gray-700 text-sm"><Type size={18} /> عنوان البطاقة الرئيسية (Hero Title)</label>
            <input 
                className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-primary font-bold"
                value={settings.hero_title}
                onChange={(e) => setSettings({...settings, hero_title: e.target.value})}
            />
        </div>

        <div className="space-y-4">
            <label className="flex items-center gap-2 font-black text-gray-700 text-sm"><Type size={18} /> الوصف الفرعي</label>
            <textarea 
                className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-primary font-bold h-32"
                value={settings.hero_subtitle}
                onChange={(e) => setSettings({...settings, hero_subtitle: e.target.value})}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <label className="flex items-center gap-2 font-black text-gray-700 text-sm"><Palette size={18} /> اللون الرئيسي للموقع</label>
                <div className="flex gap-4 items-center">
                    <input 
                        type="color"
                        className="w-16 h-16 rounded-2xl cursor-pointer border-none"
                        value={settings.primary_color}
                        onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                    />
                    <input 
                        className="flex-1 p-4 bg-gray-50 rounded-2xl border border-gray-100 font-mono text-sm"
                        value={settings.primary_color}
                        onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="flex items-center gap-2 font-black text-gray-700 text-sm"><ImageIcon size={18} /> واتساب التواصل (للتفعيل)</label>
                <input 
                    placeholder="966XXXXXXXXX"
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none font-bold"
                    value={settings.contact_whatsapp}
                    onChange={(e) => setSettings({...settings, contact_whatsapp: e.target.value})}
                />
            </div>
        </div>

        <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-white py-5 rounded-[2rem] font-black shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
        >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={24} />}
            حفظ التغييرات ونشرها فوراً
        </button>
      </div>

      <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl">
          <p className="text-orange-700 text-sm font-bold leading-relaxed">
              💡 ملحوظة: التغييرات التي تقوم بها هنا ستظهر لجميع زوار موقعك الرئيسي (Landing Page) والتطبيق فور الضغط على زر الحفظ.
          </p>
      </div>
    </div>
  );
}
