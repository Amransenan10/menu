"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, XCircle, ChevronRight, Loader2, Bell, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();

    // 🔔 Real-time subscription
    const channel = supabase
      .channel('orders_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        console.log('New order received!', payload);
        alert("🔔 طلب جديد وصل!");
        fetchOrders(); // Refresh list
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data: tenant } = await supabase.from("tenants").select("id").limit(1).single();
    if (tenant) {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("tenant_id", tenant.id)
        .order("created_at", { ascending: false });
      setOrders(data || []);
    }
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    if (!error) fetchOrders();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
             الطلبات الحية
             <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          </h1>
          <p className="text-gray-500 font-medium">راقب الطلبات الواردة وحدث حالاتها فوراً.</p>
        </div>
        <button onClick={fetchOrders} className="bg-white border p-3 rounded-2xl hover:bg-gray-50 transition-all">
            <Bell size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Pending Column */}
         <div className="bg-gray-50 rounded-[2rem] p-6 space-y-4 border border-dashed border-gray-200">
            <h3 className="font-black text-orange-600 flex items-center gap-2 mb-6">
                <Clock size={20} /> طلبات قيد الانتظار ({orders.filter(o => o.status === 'pending').length})
            </h3>
            {loading ? <Loader2 className="animate-spin mx-auto text-gray-300" /> : 
             orders.filter(o => o.status === 'pending').map(order => (
                <div key={order.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex justify-between items-start">
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black italic">طاولة #{order.table_number}</span>
                        <span className="text-[10px] text-gray-400">{new Date(order.created_at).toLocaleTimeString('ar-SA')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="font-black text-xl text-gray-800">{order.total_price} ر.س</div>
                        <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100">
                            <Star size={12} className="text-orange-500 fill-orange-500" />
                            <span className="text-[10px] font-black text-orange-600">+{order.total_price} نقطة</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => updateStatus(order.id, 'preparing')}
                            className="flex-1 bg-primary text-white py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                        >قبول الطلب</button>
                        <button 
                            onClick={() => updateStatus(order.id, 'cancelled')}
                            className="p-2.5 text-red-500 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
                        ><XCircle size={18} /></button>
                    </div>
                </div>
             ))
            }
         </div>

         {/* Preparing Column */}
         <div className="bg-gray-50 rounded-[2rem] p-6 space-y-4 border border-dashed border-gray-200">
            <h3 className="font-black text-blue-600 flex items-center gap-2 mb-6">
                <Loader2 size={20} /> جاري التحضير ({orders.filter(o => o.status === 'preparing').length})
            </h3>
            {orders.filter(o => o.status === 'preparing').map(order => (
                <div key={order.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-black text-gray-800">طاولة #{order.table_number}</span>
                        <span className="text-blue-600 animate-pulse text-[10px] font-black">يتم التحضير...</span>
                    </div>
                    <button 
                        onClick={() => updateStatus(order.id, 'delivered')}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-blue-200"
                    >تم الإنجاز</button>
                </div>
            ))}
         </div>

         {/* Delivered Column */}
         <div className="bg-gray-50 rounded-[2rem] p-6 space-y-4 border border-dashed border-gray-200">
            <h3 className="font-black text-green-600 flex items-center gap-2 mb-6">
                <CheckCircle2 size={20} /> طلبات مكتملة ({orders.filter(o => o.status === 'delivered').length})
            </h3>
            {orders.filter(o => o.status === 'delivered').map(order => (
                <div key={order.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 opacity-60">
                    <div className="flex justify-between items-center">
                        <span className="font-black text-gray-500 line-through">طاولة #{order.table_number}</span>
                        <span className="text-green-500"><CheckCircle2 size={16} /></span>
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
}
