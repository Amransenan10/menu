/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // تأكد من أن الروابط تعمل بشكل صحيح في البيئة المحلية للتطبيق
  trailingSlash: true,
};

export default nextConfig;
