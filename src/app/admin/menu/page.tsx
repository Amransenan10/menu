"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Image as ImageIcon, Loader2, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function MenuManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);

  // Modals state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [activeCatId, setActiveCatId] = useState<string | null>(null);

  const [newCat, setNewCat] = useState({ name_ar: "", name_en: "" });
  const [newProd, setNewProd] = useState({ name_ar: "", name_en: "", price: 0, description_ar: "", category_id: "", image_url: "" });

  useEffect(() => {
    fetchMenuData();
  }, []);

  async function fetchMenuData() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: tenantData } = await supabase.from("tenants").select("*").eq("owner_id", session.user.id).single();
    if (tenantData) {
      setTenant(tenantData);
      const { data: cats } = await supabase.from("categories").select("*").eq("tenant_id", tenantData.id).order("sort_order");
      const { data: prods } = await supabase.from("products").select("*").eq("tenant_id", tenantData.id);
      setCategories(cats || []);
      setProducts(prods || []);
    }
    setLoading(false);
  }

  async function handleAddCategory() {
    if (!newCat.name_ar) return;
    const { error } = await supabase.from("categories").insert([{ ...newCat, tenant_id: tenant.id }]);
    if (!error) {
        setIsCatModalOpen(false);
        setNewCat({ name_ar: "", name_en: "" });
        fetchMenuData();
    }
  }

  async function handleDeleteCategory(id: string) {
    if (confirm("هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الوجبات بداخله!")) {
        await supabase.from("products").delete().eq("category_id", id);
        await supabase.from("categories").delete().eq("id", id);
        fetchMenuData();
    }
  }

  async function handleAddProduct() {
    if (!newProd.name_ar || !newProd.price) return;
    const { error } = await supabase.from("products").insert([{ ...newProd, tenant_id: tenant.id, category_id: activeCatId }]);
    if (!error) {
        setIsProdModalOpen(false);
        setNewProd({ name_ar: "", name_en: "", price: 0, description_ar: "", category_id: "", image_url: "" });
        fetchMenuData();
    }
  }

  async function handleDeleteProduct(id: string) {
    if (confirm("حذف هذه الوجبة؟")) {
        await supabase.from("products").delete().eq("id", id);
        fetchMenuData();
    }
  }

  async function uploadImage(e: any, productId?: string) {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${tenant.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file);

    if (!uploadError) {
      const { data } = supabase.storage.from('menu-images').getPublicUrl(filePath);
      if (productId) {
         await supabase.from("products").update({ image_url: data.publicUrl }).eq("id", productId);
         fetchMenuData();
      } else {
         setNewProd({...newProd, image_url: data.publicUrl});
      }
    }
  }

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={40} /></div>;

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">إدارة القائمة (المنيو)</h1>
          <p className="text-gray-500 font-bold text-sm">أضف أقسامك ووجباتك وصورها الاحترافية هنا.</p>
        </div>
        <button 
            onClick={() => setIsCatModalOpen(true)}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
            <Plus size={20} /> إضافة قسم جديد
        </button>
      </div>

      <div className="space-y-10">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="bg-gray-50 px-8 py-6 flex justify-between items-center border-b border-gray-100">
               <h3 className="text-xl font-black text-gray-900">{cat.name_ar}</h3>
               <div className="flex gap-2">
                  <button 
                    onClick={() => { setActiveCatId(cat.id); setIsProdModalOpen(true); }}
                    className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
               </div>
            </div>

            <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.filter(p => p.category_id === cat.id).map(product => (
                    <div key={product.id} className="bg-gray-50 rounded-3xl p-4 flex gap-4 border border-gray-100 group relative">
                        <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden border border-gray-100 relative shadow-inner">
                            {product.image_url ? <img src={product.image_url} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-gray-300 absolute inset-0 m-auto" />}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => uploadImage(e, product.id)} />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <h4 className="font-black text-gray-900 text-sm">{product.name_ar}</h4>
                                <p className="text-[10px] text-gray-400 font-bold line-clamp-1">{product.description_ar || "لا يوجد وصف"}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-black text-primary text-sm">{product.price} ر.س</span>
                                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => { setActiveCatId(cat.id); setIsProdModalOpen(true); }}
                    className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-gray-300 hover:text-primary hover:border-primary/30 transition-all font-bold gap-2"
                  >
                        <Plus size={32} />
                        <span className="text-xs">إضافة صنف لهذا القسم</span>
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals - Simplified for brevity but fully functional */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6" dir="rtl">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl space-y-6">
                <h3 className="text-2xl font-black">إضافة قسم جديد</h3>
                <input 
                    placeholder="اسم القسم (مثلاً: مشويات)" 
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-900 border border-gray-100 focus:border-primary"
                    value={newCat.name_ar}
                    onChange={(e) => setNewCat({...newCat, name_ar: e.target.value})}
                />
                <div className="flex gap-4">
                    <button onClick={handleAddCategory} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20">حفظ القسم</button>
                    <button onClick={() => setIsCatModalOpen(false)} className="px-6 py-4 bg-gray-100 rounded-2xl font-black">إلغاء</button>
                </div>
            </div>
        </div>
      )}

      {isProdModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6" dir="rtl">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl space-y-6">
                <h3 className="text-2xl font-black">إضافة وجبة جديدة</h3>
                <div className="space-y-4">
                    <input 
                        placeholder="اسم الوجبة" 
                        className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-900 border border-gray-100"
                        value={newProd.name_ar}
                        onChange={(e) => setNewProd({...newProd, name_ar: e.target.value})}
                    />
                    <div className="flex gap-4">
                        <input 
                            placeholder="السعر" 
                            type="number"
                            className="flex-1 p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-900 border border-gray-100"
                            value={newProd.price}
                            onChange={(e) => setNewProd({...newProd, price: parseFloat(e.target.value)})}
                        />
                        <div className="w-20 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-xs font-black">ر.س</div>
                    </div>
                    <textarea 
                        placeholder="وصف الوجبة (اختياري)" 
                        className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-900 border border-gray-100 h-24"
                        value={newProd.description_ar}
                        onChange={(e) => setNewProd({...newProd, description_ar: e.target.value})}
                    />
                </div>
                <div className="flex gap-4">
                    <button onClick={handleAddProduct} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20">إضافة للمنيو</button>
                    <button onClick={() => setIsProdModalOpen(false)} className="px-6 py-4 bg-gray-100 rounded-2xl font-black">إلغاء</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
