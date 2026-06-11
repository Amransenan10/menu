"use client";

import { useState, useEffect } from "react";
import { Users, Store, TrendingUp, CreditCard, ExternalLink, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  async function fetchTenants() {
    setLoading(true);
    const { data } = await supabase.from("tenants").select("*").order("created_at", { ascending: false });
    setTenants(data || []);
    setLoading(false);
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "Active" ? "Canceled" : "Active";
    const { error } = await supabase.from("tenants").update({ subscription_status: newStatus }).eq("id", id);
    if (!error) fetchTenants();
  }

  async function updatePlan(id: string, newPlan: string) {
    const { error } = await supabase.from("tenants").update({ subscription_plan: newPlan }).eq("id", id);
    if (!error) fetchTenants();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <ShieldCheck className="text-primary" size={32} />
            لوحة تحكم المشرف العام
          </h1>
          <p className="text-gray-500">إدارة الاشتراكات والمطاعم المسجلة في منيو تيك.</p>
        </div>
        <div className="bg-white px-6 py-2 rounded-2xl border font-bold text-sm">
            إجمالي المطاعم: {tenants.length}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
              <Store size={24} />
           </div>
           <div className="text-gray-400 text-sm font-bold">المطاعم النشطة</div>
           <div className="text-3xl font-black">{tenants.filter(t => t.subscription_status === "Active").length}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <div className="bg-green-100 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600 mb-4">
              <CreditCard size={24} />
           </div>
           <div className="text-gray-400 text-sm font-bold">الاشتراكات المتوقعة</div>
           <div className="text-3xl font-black">2,450 ر.س</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <div className="bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
              <TrendingUp size={24} />
           </div>
           <div className="text-gray-400 text-sm font-bold">معدل النمو</div>
           <div className="text-3xl font-black">+15%</div>
        </div>
      </div>

      {/* All Restaurants Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h3 className="font-bold text-xl">إدارة المشتركين</h3>
        </div>
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-400 text-xs font-black uppercase">
            <tr>
              <th className="px-8 py-4">المطعم</th>
              <th className="px-8 py-4">نوع الباقة</th>
              <th className="px-8 py-4">تاريخ الاشتراك</th>
              <th className="px-8 py-4">الحالة</th>
              <th className="px-8 py-4 text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
                <tr><td colSpan={5} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={32} /></td></tr>
            ) : tenants.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors font-bold text-sm">
                <td className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ color: t.primary_color, borderColor: t.primary_color }}>
                        {t.name_ar.substring(0, 2)}
                      </div>
                      <div>
                        <div>{t.name_ar}</div>
                        <a href={`/r/${t.slug}`} target="_blank" className="text-[10px] text-blue-400 font-mono flex items-center gap-1 hover:underline">
                            /r/{t.slug} <ExternalLink size={10} />
                        </a>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <select 
                    value={t.subscription_plan || "Starter"} 
                    onChange={(e) => updatePlan(t.id, e.target.value)}
                    className="bg-gray-100 px-3 py-1.5 rounded-xl outline-none text-xs"
                   >
                      <option value="Starter">Starter</option>
                      <option value="Pro">Pro</option>
                      <option value="Enterprise">Enterprise</option>
                   </select>
                </td>
                <td className="px-8 py-6 text-gray-400 text-xs font-medium">
                  {new Date(t.created_at).toLocaleDateString('ar-SA')}
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] ${
                    t.subscription_status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {t.subscription_status === "Active" ? "نشط" : "متوقف"}
                  </span>
                </td>
                <td className="px-8 py-6 text-left">
                  <button 
                    onClick={() => toggleStatus(t.id, t.subscription_status)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        t.subscription_status === "Active" ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-green-500 bg-green-50 hover:bg-green-100"
                    }`}
                  >
                    {t.subscription_status === "Active" ? "إيقاف الاشتراك" : "تفعيل الآن"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tenants.length === 0 && !loading && (
          <div className="p-20 text-center text-gray-400 font-bold">لا يوجد مطاعم مسجلة حتى الآن.</div>
        )}
      </div>
    </div>
  );
}
