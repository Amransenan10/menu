import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "إجمالي المبيعات", value: "12,450 ر.س", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { title: "الطلبات اليوم", value: "48 طلب", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "زوار المنيو", value: "1,204 زائر", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "نسبة النمو", value: "+12.5%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">أهلاً بك مجدداً، مطعم جمر التنور 👋</h1>
        <p className="text-gray-500">إليك نظرة سريعة على أداء مطعمك اليوم.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <div className="text-gray-500 text-sm mb-1">{stat.title}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4">آخر الطلبات</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">#12</div>
                  <div>
                    <div className="font-medium text-sm">طاولة رقم 4</div>
                    <div className="text-xs text-gray-400">منذ 5 دقائق</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-primary">85 ر.س</div>
                <div className="px-3 py-1 bg-orange-100 text-primary text-[10px] font-bold rounded-full">قيد التحضير</div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Ordered */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4">الأكثر طلباً</h3>
          <div className="space-y-4">
            {[
              { name: "ريش غنم مشوية", count: 120, price: "45 ر.س" },
              { name: "بيتزا مارجريتا", count: 85, price: "32 ر.س" },
              { name: "حمص باللحمة", count: 64, price: "18 ر.س" },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center text-gray-400 text-xs italic">IMG</div>
                  <div>
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-gray-400">{product.count} طلب</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-700">{product.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
