import RestaurantMenuClient from "./RestaurantMenuClient";

export async function generateStaticParams() {
  // نقوم بتوليد رابط واحد افتراضي للسماح بعملية التصدير الثابت
  return [{ slug: 'default' }];
}

export default function Page({ params }: { params: { slug: string } }) {
  return <RestaurantMenuClient params={params} />;
}
