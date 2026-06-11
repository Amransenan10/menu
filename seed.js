const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://guevhrarjysjenqaeecm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1ZXZocmFyanlzamVucWFlZWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1Mzg2OTAsImV4cCI6MjA5NjExNDY5MH0.HX5k_vDRzn-Y6nKjuMMg0wRcAUZNKo84U1T-pp0ophk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🚀 Starting data injection with CORRECT URL...");

  try {
    // 1. Create Restaurants (Tenants)
    const { data: tenants, error: tErr } = await supabase.from('tenants').insert([
        { name_ar: 'برجر هيفن', name_en: 'Burger Heaven', slug: 'burger-heaven', primary_color: '#E63946' },
        { name_ar: 'قهوة وكيف', name_en: 'Kief Coffee', slug: 'kief-coffee', primary_color: '#8B4513' },
        { name_ar: 'بيتزا روما', name_en: 'Pizza Roma', slug: 'pizza-roma', primary_color: '#FF6347' }
    ]).select();

    if (tErr) throw tErr;
    console.log("✅ 3 Restaurants added.");

    const burgerId = tenants[0].id;
    const coffeeId = tenants[1].id;
    const pizzaId = tenants[2].id;

    // 2. Create Categories
    const { data: cats, error: cErr } = await supabase.from('categories').insert([
        { tenant_id: burgerId, name_ar: 'الوجبات الأساسية', name_en: 'Main Meals' },
        { tenant_id: burgerId, name_ar: 'المشروبات', name_en: 'Drinks' },
        { tenant_id: coffeeId, name_ar: 'القهوة المختصة', name_en: 'Specialty Coffee' },
        { tenant_id: coffeeId, name_ar: 'الحلويات', name_en: 'Desserts' },
        { tenant_id: pizzaId, name_ar: 'بيتزا كلاسيك', name_en: 'Classic Pizza' }
    ]).select();

    if (cErr) throw cErr;
    console.log("✅ 5 Categories added.");

    // 3. Create Products
    const { error: pErr } = await supabase.from('products').insert([
        { tenant_id: burgerId, category_id: cats[0].id, name_ar: 'كلاسيك برجر', price: 28 },
        { tenant_id: burgerId, category_id: cats[0].id, name_ar: 'دبل برجر مع جبن', price: 38 },
        { tenant_id: coffeeId, category_id: cats[2].id, name_ar: 'سبانش لاتيه بارد', price: 22 },
        { tenant_id: coffeeId, category_id: cats[3].id, name_ar: 'كيكة العسل', price: 18 },
        { tenant_id: pizzaId, category_id: cats[4].id, name_ar: 'بيتزا بيبروني', price: 42 }
    ]);

    if (pErr) throw pErr;
    console.log("✅ 5 Products added.");

    console.log("✨ All data injected successfully!");
  } catch (err) {
    console.error("❌ Error during seeding:", err.message);
  }
}

seed();
