"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { name: "نظرة عامة", href: "/admin", icon: LayoutDashboard },
    { name: "إدارة المنيو", href: "/admin/menu", icon: UtensilsCrossed },
    { name: "الطلبات الحية", href: "/admin/orders", icon: Bell },
    { name: "إعدادات المطعم", href: "/admin/settings", icon: Settings },
  ];

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
    }
    setLoading(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">جاري التحميل...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-50 w-72 bg-[#1A1A1A] text-white p-8 flex flex-col transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex items-center justify-between mb-12">
            <div className="text-2xl font-black text-primary tracking-tighter">منيو تيك</div>
            <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
                <X size={24} />
            </button>
        </div>
        
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
          className="flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-red-400 font-black text-sm mt-auto border-t border-white/5 pt-8"
        >
          <LogOut size={20} />
          تسجيل الخروج
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl">
                <Menu size={24} className="text-gray-600" />
              </button>
              <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>لوحة التحكم</span>
                <ChevronRight size={14} />
                <span className="text-gray-900">{menuItems.find(i => i.href === pathname)?.name || "الرئيسية"}</span>
              </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black italic">الحساب نشط</div>
             <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black">او</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
