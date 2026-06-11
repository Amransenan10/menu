"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Settings, 
  ShoppingBag, 
  LogOut,
  ChevronRight,
  Loader2
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [tenantName, setTenantName] = useState("مطعم جديد");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push("/login");
      return;
    }

    // Fetch tenant name
    const { data: tenant } = await supabase
      .from("tenants")
      .select("name_ar")
      .eq("owner_id", session.user.id)
      .single();
    
    if (tenant) setTenantName(tenant.name_ar);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const menuItems = [
    { name: "نظرة عامة", href: "/admin", icon: LayoutDashboard },
    { name: "إدارة المنيو", href: "/admin/menu", icon: UtensilsCrossed },
    { name: "الطلبات الحية", href: "/admin/orders", icon: ShoppingBag },
    { name: "إعدادات المطعم", href: "/admin/settings", icon: Settings },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4 font-bold">
        <Loader2 className="animate-spin text-primary" size={40} />
        <span className="text-gray-400 italic">جاري التحقق من الصلاحيات...</span>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white fixed h-full z-50">
        <div className="p-6">
          <div className="text-2xl font-black text-primary mb-10 tracking-tighter">منيو تيك</div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold ${
                    isActive 
                      ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" 
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-400 hover:text-red-400 font-bold transition-colors w-full px-4 py-2"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-64">
        <header className="bg-white/80 backdrop-blur-md border-b px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
            <span>لوحة التحكم</span>
            <ChevronRight size={14} />
            <span className="text-gray-900">
              {menuItems.find(i => i.href === pathname)?.name || "الرئيسية"}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-left">
                <div className="text-sm font-black text-gray-900 leading-none mb-1">{tenantName}</div>
                <div className="text-[10px] text-primary font-black uppercase tracking-tighter">الحساب نشط</div>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-primary font-black shadow-inner shadow-orange-200">
                {tenantName.substring(0, 2)}
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
