"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Palette, Loader2, Camera, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RestaurantSettings() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name_ar: "",
    name_en: "",
    slug: "",
    primary_color: "#FF6B00",
    logo_url: "",
    banner_url: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("tenants")
      .select("*")
      .eq("owner_id", session.user.id)
      .single();
    
    if (data) setProfile(data);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, field: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('restaurants')
      .upload(filePath, file);

    if (uploadError) {
      alert("خطأ في الرفع: " + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('restaurants').getPublicUrl(filePath);
    setProfile(prev => ({ ...prev, [field]: publicUrl }));
    setLoading(false);
  }

  async function handleSaveSettings() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const { error } = await supabase.from("tenants").upsert({
      owner_id: session?.user.id,
      name_ar: profile.name_ar,
      name_en: profile.name_en,
      slug: profile.slug,
      primary_color: profile.primary_color,
      logo_url: profile.logo_url,
      banner_url: profile.banner_url
    });
    
    if (!error) alert("✅ تم حفظ إعدادات المطعم بنجاح!");
    else alert("❌ خطأ: " + error.message);
    setLoading(false);
  }

  return (
    <div className="max-w-4xl space-y-8" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">إعدادات المطعم</h1>
        <p className="text-gray-500 font-medium">تحكم بهوية علامتك التجارية والروابط المباشرة.</p>
      </div>

      <div className="grid gap-6">
        {/* Branding Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center gap-2 text-primary font-black">
            <Palette size={20} />
            <span>الهوية البصرية</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Logo Upload */}
            <div className="space-y-4">
               <label className="text-sm font-bold text-gray-400">لوجو المطعم</label>
               <div className="flex items-center gap-5">
                  <div className="w-24 h-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                    {profile.logo_url ? <img src={profile.logo_url} className="w-full h-full object-cover" /> : <Camera size={32} className="text-gray-200" />}
                  </div>
                  <div className="relative">
                    <button className="bg-gray-100 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">اختيار صورة</button>
                    <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "logo_url")} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
               </div>
            </div>

            {/* Banner Upload */}
            <div className="space-y-4 font-bold">
               <label className="text-sm font-bold text-gray-400">صورة خلفية المنيو (Banner)</label>
               <div className="h-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden">
                  {profile.banner_url ? <img src={profile.banner_url} className="w-full h-full object-cover" /> : <Camera size={24} className="text-gray-200" />}
                  <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "banner_url")} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 pr-2">اسم المطعم (بالعربي)</label>
              <input value={profile.name_ar} onChange={(e) => setProfile({...profile, name_ar: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 pr-2">اسم المطعم (English)</label>
              <input value={profile.name_en} onChange={(e) => setProfile({...profile, name_en: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none font-bold" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 pr-2 italic">رقم الهوية (Slug)</label>
                <input value={profile.slug} onChange={(e) => setProfile({...profile, slug: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none font-bold text-primary font-mono" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 pr-2">لون المنيو الأساسي</label>
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                    <input type="color" value={profile.primary_color} onChange={(e) => setProfile({...profile, primary_color: e.target.value})} className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none" />
                    <span className="text-sm font-mono font-bold uppercase">{profile.primary_color}</span>
                </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
            <button 
              onClick={handleSaveSettings}
              disabled={loading}
              className="bg-gray-900 text-white px-12 py-5 rounded-[2rem] font-black flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                حفظ التعديلات النهائية
            </button>
        </div>
      </div>
    </div>
  );
}
