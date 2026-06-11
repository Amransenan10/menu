"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Star, Clock, Loader2, Image as ImageIcon, Search, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function RestaurantMenuClient({ params }: { params: { slug: string } }) {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [tenant, setTenant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const cartCount = cart.length;
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    fetchTenantData();
  }, [params.slug]);

  async function fetchTenantData() {
    setLoading(true);
    const { data: tenantData } = await supabase.from("tenants").select("*").eq("slug", params.slug).single();

    if (tenantData) {
      setTenant(tenantData);
      const { data: cats } = await supabase.from("categories").select("*").eq("tenant_id", tenantData.id).order("sort_order");
      setCategories(cats || []);
      if (cats && cats.length > 0) setActiveCategory(cats[0].id);

      const { data: prods } = await supabase.from("products").select("*").eq("tenant_id", tenantData.id).eq("is_available", true);
      setProducts(prods || []);
    }
    setLoading(false);
  }

  function addToCart(product: any) {
    setCart([...cart, product]);
  }

  async function submitOrder() {
    if (cart.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    
    const { error } = await supabase.from("orders").insert([
      {
        tenant_id: tenant.id,
        table_number: "جوال", // يمكن تغييرها لاحقاً
        total_price: totalPrice,
        status: "pending"
      }
    ]);

    if (!error) {
      alert(lang === "ar" ? "✅ تم إرسال طلبك بنجاح!" : "✅ Order sent successfully!");
      setCart([]);
    }
    setIsSubmitting(false);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white flex-col gap-4 font-bold">
        <Loader2 className="animate-spin text-primary" size={40} />
        <span className="text-gray-400">جاري تزيين المنيو...</span>
    </div>
  );

  if (!tenant) return (
    <div className="min-h-screen flex items-center justify-center font-bold text-red-500">المطعم غير موجود!</div>
  );

  const primaryColor = tenant.primary_color || "#FF6B00";

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-32" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Premium Header */}
      <div className="relative h-[300px] bg-gray-900">
        <img 
          src={tenant.banner_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"} 
          className="w-full h-full object-cover opacity-50 contrast-125"
          alt="Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-black/20"></div>
        
        {/* Logo and Info Overlay */}
        <div className="absolute -bottom-10 inset-x-0 px-6">
           <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl shadow-gray-200 border border-white flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-3xl -mt-20 shadow-xl border-4 border-white overflow-hidden mb-4">
                  {tenant.logo_url ? <img src={tenant.logo_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-primary flex items-center justify-center text-white font-black text-2xl">{tenant.name_ar.substring(0,2)}</div>}
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-1">
                {lang === "ar" ? tenant.name_ar : (tenant.name_en || tenant.name_ar)}
              </h1>
              <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 tracking-widest">
                  <span className="flex items-center gap-1 text-yellow-500"><Star size={14} className="fill-yellow-500" /> 4.9 (1K+)</span>
                  <span className="flex items-center gap-1 uppercase"><Clock size={14} /> 20 MINS</span>
                  <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="text-primary hover:scale-110 transition-transform">
                      {lang === "ar" ? "ENGLISH" : "عربي"}
                  </button>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-16 px-6">
          {/* Categories Horizontal */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
            {categories.map((cat) => (
                <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-8 py-3.5 rounded-2xl whitespace-nowrap text-xs font-black transition-all ${
                    activeCategory === cat.id ? "text-white shadow-xl" : "bg-white text-gray-400 border border-gray-100"
                }`}
                style={{ backgroundColor: activeCategory === cat.id ? primaryColor : undefined, boxShadow: activeCategory === cat.id ? `0 10px 25px -10px ${primaryColor}` : undefined }}
                >
                {lang === "ar" ? cat.name_ar : (cat.name_en || cat.name_ar)}
                </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="mt-10 space-y-12">
            {categories.filter(c => !activeCategory || c.id === activeCategory).map(cat => (
                <div key={cat.id}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-6 w-1 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                        <h2 className="text-xl font-black text-gray-900">{lang === "ar" ? cat.name_ar : (cat.name_en || cat.name_ar)}</h2>
                    </div>
                    <div className="grid gap-6">
                        {products.filter(p => p.category_id === cat.id).map(product => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={product.id} 
                                className="bg-white rounded-[2rem] p-4 flex gap-5 shadow-sm border border-gray-100 relative overflow-hidden group"
                            >
                                <div className="w-32 h-32 bg-gray-50 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center text-gray-200">
                                    {product.image_url ? (
                                        <img src={product.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : <ImageIcon size={32} />}
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1 font-bold">
                                    <div>
                                        <h3 className="text-gray-900 text-lg mb-1 leading-tight">{lang === "ar" ? product.name_ar : (product.name_en || product.name_ar)}</h3>
                                        {product.description_ar && <p className="text-[10px] text-gray-400 font-medium line-clamp-2 leading-relaxed">{product.description_ar}</p>}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-xl font-black" style={{ color: primaryColor }}>{product.price}<span className="text-[10px] mr-1 opacity-60">ر.س</span></div>
                                        <button 
                                            onClick={() => addToCart(product)}
                                            className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg active:scale-90 transition-all font-black text-xl"
                                            style={{ backgroundColor: primaryColor, boxShadow: `0 8px 20px -8px ${primaryColor}` }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
          </div>
      </div>

      {/* Floating Checkout Button */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-8 left-8 right-8 z-50 space-y-3">
            {/* Loyalty Badge */}
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl shadow-xl border border-primary/20 w-fit mx-auto flex items-center gap-2">
                <div className="bg-primary/20 p-1.5 rounded-lg text-primary"><Star size={14} className="fill-primary" /></div>
                <span className="text-[10px] font-black text-gray-700">ستربح <span className="text-primary">{Math.floor(totalPrice)} نقطة</span> من هذا الطلب!</span>
            </motion.div>

            <button 
                onClick={submitOrder}
                disabled={isSubmitting}
                className="w-full text-white p-5 rounded-[2.5rem] shadow-2xl flex items-center justify-between font-black text-lg transition-transform active:scale-95"
                style={{ backgroundColor: primaryColor, boxShadow: `0 20px 40px -15px ${primaryColor}` }}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white text-gray-900 w-12 h-12 rounded-2xl flex items-center justify-center">
                    {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : cartCount}
                </div>
                <span>{lang === "ar" ? "إرسال الطلب للكاشير" : "Confirm & Send"}</span>
              </div>
              <ShoppingCart size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
