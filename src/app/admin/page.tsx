"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, ShoppingBag, DollarSign, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { title: "إجمالي المبيعات", value: "0 ر.س", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { title: "الطلبات اليوم", value: "0 طلب", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "زوار المنيو", value: "0 زائر", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "نسبة النمو", value: "100%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
  ]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState("مطعم جديد");

  useEffect(() => {
    fetchRealStats();
  }, []);

  async function fetchRealStats() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: tenant } = await supabase.from("tenants").select("*").eq("owner_id", session.user.id).single();
    if (!tenant) { setLoading(false); return; }

    setRestaurantName(tenant.name_ar);

    // 1. Fetch Sales & Orders
    const { data: orders } = await supabase.from("orders").select("*").eq("tenant_id", tenant.id);
    
    if (orders) {
      const totalSales = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total_price, 0);
      const ordersToday = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length;
      
      setStats([
        { title: "إجمالي المبيعات", value: `${totalSales} ر.س`, icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
        { title: "الطلبات اليوم", value: `${ordersToday} طلب`, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "زوار المنيو", value: "0 زائر", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
        { title: "نسبة النمو", value: "+100%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
      ]);

      setRecentOrders(orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5));
    }
    setLoading(false);
  }

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center flex-col gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <span className="text-gray-400 font-bold">جاري جلب إحصائياتك الحقيقية...</span>
    </div>
  );

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">أهلاً بك مجدداً، {restaurantName} 👋</h1>
        <p className="text-gray-500 font-bold">إليك نظرة سريعة على أداء مطعمك اليوم.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <div className="text-gray-500 text-xs font-bold mb-1">{stat.title}</div>
            <div className="text-2xl font-black text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl">
          <h3 className="font-black text-xl mb-6">آخر الطلبات المستلمة</h3>
          <div className="space-y-4">
            {recentOrders.length > 0 ? recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black text-xs">#{order.table_number}</div>
                  <div>
                    <div className="font-black text-xs text-gray-900">طاولة رقم {order.table_number}</div>
                    <div className="text-[10px] text-gray-400 font-bold">{new Date(order.created_at).toLocaleTimeString('ar-SA')}</div>
                  </div>
                </div>
                <div className="text-sm font-black text-primary">{order.total_price} ر.س</div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black ${
                    order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                    order.status === 'preparing' ? 'bg-blue-100 text-blue-600' : 
                    'bg-green-100 text-green-600'
                }`}>
                    {order.status === 'pending' ? 'بانتظار القبول' : order.status === 'preparing' ? 'يتم التحضير' : 'تم التسليم'}
                </div>
              </div>
            )) : <p className="text-center py-10 text-gray-300 font-bold italic">لا توجد طلبات بعد...</p>}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-primary p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32"></div>
            <div className="relative z-10">
                <h3 className="text-3xl font-black mb-4 leading-tight">نصيحة اليوم لنمو مطعمك 🚀</h3>
                <p className="text-white/80 font-bold">تأكد من تحديث صور الوجبات باستمرار، الصور الجميلة تزيد رغبة الزبائن في الطلب بنسبة 40%!</p>
            </div>
            <button className="bg-white text-primary px-8 py-4 rounded-2xl font-black mt-10 hover:bg-gray-100 transition-all w-fit">استعراض المنيو الخاص بك</button>
        </div>
      </div>
    </div>
  );
}
