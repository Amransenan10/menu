"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Globe, Image as ImageIcon, Loader2, Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function MenuManagement() {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State for Categories
  const [newCatNameAr, setNewCatNameAr] = useState("");
  const [newCatNameEn, setNewCatNameEn] = useState("");

  // Form State for Products
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [pNameAr, setPNameAr] = useState("");
  const [pNameEn, setPNameEn] = useState("");
  const [pDescAr, setPDescAr] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategoryId, setPCategoryId] = useState("");
  const [pImagePreview, setPImagePreview] = useState("");

  // Fetch Data
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Get the tenant ID for the current owner
    const { data: tenant } = await supabase.from("tenants").select("id").eq("owner_id", session.user.id).single();
    if (!tenant) { setLoading(false); return; }

    if (activeTab === "categories") {
      const { data } = await supabase.from("categories").select("*").eq("tenant_id", tenant.id).order("sort_order");
      setCategories(data || []);
    } else {
      const { data: cats } = await supabase.from("categories").select("*").eq("tenant_id", tenant.id);
      const { data: prods } = await supabase.from("products").select("*, categories(name_ar)").eq("tenant_id", tenant.id);
      setCategories(cats || []);
      setProducts(prods || []);
    }
    setLoading(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('restaurants').upload(filePath, file);

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('restaurants').getPublicUrl(filePath);
      setPImagePreview(publicUrl);
    }
    setLoading(false);
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const { data: tenant } = await supabase.from("tenants").select("id").eq("owner_id", session?.user.id).single();

    const { error } = await supabase.from("categories").insert([
      { name_ar: newCatNameAr, name_en: newCatNameEn, tenant_id: tenant?.id }
    ]);

    if (!error) {
      setNewCatNameAr(""); setNewCatNameEn(""); setIsModalOpen(false);
      fetchData();
    }
    setLoading(false);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const { data: tenant } = await supabase.from("tenants").select("id").eq("owner_id", session?.user.id).single();
    
    const { error } = await supabase.from("products").insert([
      { 
        name_ar: pNameAr, 
        name_en: pNameEn, 
        description_ar: pDescAr,
        price: parseFloat(pPrice),
        category_id: pCategoryId,
        tenant_id: tenant?.id,
        image_url: pImagePreview
      }
    ]);

    if (!error) {
      setPNameAr(""); setPNameEn(""); setPPrice(""); setPCategoryId(""); setPDescAr(""); setPImagePreview("");
      setIsProductModalOpen(false);
      fetchData();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-10" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-tight">إدارة المنيو الرقمي</h1>
          <p className="text-gray-500 font-bold">أضف وجباتك اللذيذة وصنفها باحترافية.</p>
        </div>
        <button 
          onClick={() => activeTab === "categories" ? setIsModalOpen(true) : setIsProductModalOpen(true)}
          className="bg-gray-900 text-white px-8 py-4 rounded-[2rem] font-black flex items-center gap-2 shadow-2xl hover:scale-105 transition-all text-sm"
        >
          <Plus size={20} />
          {activeTab === "categories" ? "إضافة قسم جديد" : "إضافة منتج جديد"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 p-2 bg-gray-100/50 rounded-[2rem] w-fit">
        <button 
          onClick={() => setActiveTab("categories")}
          className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${
            activeTab === "categories" ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
          }`}
        >الأقسام</button>
        <button 
          onClick={() => setActiveTab("products")}
          className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${
            activeTab === "products" ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
          }`}
        >المنتجات</button>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex-1 flex justify-center py-20"><Loader2 className="animate-spin text-gray-200" size={48} /></div>
        ) : activeTab === "categories" ? (
          <table className="w-full text-right font-bold">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black uppercase">
              <tr>
                <th className="px-8 py-5">اسم القسم (عربي / En)</th>
                <th className="px-8 py-5 text-left">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 flex items-center gap-3">
                    <div className="w-2 bg-primary h-6 rounded-full"></div>
                    {item.name_ar} / {item.name_en}
                  </td>
                  <td className="px-8 py-6 text-left">
                    <button className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-right font-bold">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black uppercase">
              <tr>
                <th className="px-8 py-5">المنتج</th>
                <th className="px-8 py-5">القسم</th>
                <th className="px-8 py-5">السعر</th>
                <th className="px-8 py-5 text-left">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5 flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl border flex items-center justify-center overflow-hidden">
                        {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-200" />}
                    </div>
                    <span>{item.name_ar}</span>
                  </td>
                  <td className="px-8 py-5 text-gray-400 font-medium text-xs">{item.categories?.name_ar}</td>
                  <td className="px-8 py-5 text-primary font-black">{item.price} ر.س</td>
                  <td className="px-8 py-5 text-left">
                    <button className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Categories */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-black mb-8 underline decoration-primary decoration-4">إضافة قسم جديد</h2>
            <form onSubmit={handleAddCategory} className="space-y-6">
              <input required value={newCatNameAr} onChange={(e) => setNewCatNameAr(e.target.value)} placeholder="اسم القسم (عربي)" className="w-full bg-gray-50 border-gray-100 border p-5 rounded-2xl outline-none font-bold" />
              <input value={newCatNameEn} onChange={(e) => setNewCatNameEn(e.target.value)} placeholder="Category Name (En)" className="w-full bg-gray-50 border-gray-100 border p-5 rounded-2xl outline-none font-bold" />
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-gray-900 text-white p-5 rounded-2xl font-black">إضافة</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-50 text-gray-400 p-5 rounded-2xl font-black">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Products */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black mb-8">إضافة منتج جديد</h2>
            <form onSubmit={handleAddProduct} className="space-y-6 font-bold">
              {/* Image Input */}
              <div className="flex items-center justify-center">
                 <div className="w-full h-48 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 flex items-center justify-center relative overflow-hidden">
                    {pImagePreview ? <img src={pImagePreview} className="w-full h-full object-cover" /> : (
                        <div className="flex flex-col items-center gap-2 text-gray-300">
                            <Camera size={32} />
                            <span className="text-xs">ارفع صورة لذيذة للوجبة</span>
                        </div>
                    )}
                    <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-right">
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 pr-2">اسم الوجبة</label>
                    <input required value={pNameAr} onChange={(e) => setPNameAr(e.target.value)} className="w-full bg-gray-50 border-gray-100 border p-4 rounded-2xl outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 pr-2">English Name</label>
                    <input value={pNameEn} onChange={(e) => setPNameEn(e.target.value)} className="w-full bg-gray-50 border-gray-100 border p-4 rounded-2xl outline-none" />
                </div>
              </div>

              <div className="space-y-1 text-right">
                <label className="text-[10px] text-gray-400 pr-2">القسم</label>
                <select required value={pCategoryId} onChange={(e) => setPCategoryId(e.target.value)} className="w-full bg-gray-50 border-gray-100 border p-4 rounded-2xl outline-none appearance-none">
                    <option value="">اختر قسماً...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
                </select>
              </div>

              <div className="space-y-1 text-right">
                <label className="text-[10px] text-gray-400 pr-2">السعر (ر.س)</label>
                <input required type="number" step="0.01" value={pPrice} onChange={(e) => setPPrice(e.target.value)} className="w-full bg-gray-50 border-gray-100 border p-4 rounded-2xl outline-none" />
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" disabled={loading} className="flex-1 bg-gray-900 text-white p-5 rounded-[2rem] font-black shadow-xl">
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "إضافة للـمنيو"}
                </button>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 bg-gray-100 text-gray-400 p-5 rounded-[2rem] font-black">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
