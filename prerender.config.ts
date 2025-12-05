// Pre-render configuration for SEO
export const prerenderRoutes = [
  '/',
  '/dang-ky-nha-hao-tam',
  '/dang-ky-sinh-vien',
];

export const siteUrl = 'https://anmaylaptop.com'; // Update with your actual domain

export const sitemap = {
  hostname: siteUrl,
  routes: prerenderRoutes.map(route => ({
    url: route,
    changefreq: 'weekly',
    priority: route === '/' ? 1.0 : 0.8,
  })),
};
