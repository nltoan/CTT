/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  i18n: {
    locales: ['vi', 'en'],
    defaultLocale: 'vi'
  }
};

module.exports = nextConfig;
