# SEO Configuration Guide

## Overview
This project has been configured with SEO optimization including:
- Dynamic meta tags using react-helmet-async
- Pre-rendering support for static HTML generation
- Proper Open Graph and Twitter Card tags
- Structured data for better search engine indexing

## What's Been Implemented

### 1. SEO Component
Location: `src/components/SEO.tsx`

A reusable SEO component that manages:
- Page title
- Meta descriptions
- Keywords
- Open Graph tags (Facebook)
- Twitter Card tags
- Canonical URLs
- Language and robots meta tags

### 2. Pages with SEO

All public pages now include SEO meta tags:
- **Landing Page** (`/`) - Main homepage with project information
- **Donor Registration** (`/dang-ky-nha-hao-tam`) - Registration form for donors
- **Student Registration** (`/dang-ky-sinh-vien`) - Registration form for students

### 3. Pre-rendering Configuration

Location: `prerender.config.ts`

Defines which routes should be pre-rendered for SEO:
- `/` - Landing page
- `/dang-ky-nha-hao-tam` - Donor registration
- `/dang-ky-sinh-vien` - Student registration

## Installation

Install the required dependencies:

```bash
cd connect-uplift
npm install react-helmet-async
npm install -D vite-plugin-ssr
```

## Usage

### Adding SEO to a Page

Import and use the SEO component in any page:

```tsx
import { SEO } from "@/components/SEO";

export default function MyPage() {
  return (
    <div>
      <SEO
        title="Page Title"
        description="Page description for search engines"
        keywords="keyword1, keyword2, keyword3"
      />
      {/* Your page content */}
    </div>
  );
}
```

### SEO Component Props

```typescript
interface SEOProps {
  title?: string;           // Page title (defaults to project title)
  description?: string;     // Meta description
  keywords?: string;        // SEO keywords
  ogImage?: string;         // Open Graph image URL
  ogUrl?: string;          // Canonical URL
}
```

## Build for Production with SEO

### Standard Build
```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Pre-rendering Setup (Optional)

For better SEO, you can set up pre-rendering:

1. **Install vite-plugin-ssr:**
   ```bash
   npm install -D vite-plugin-ssr
   ```

2. **Update `vite.config.ts`:**
   ```typescript
   import { ssr } from 'vite-plugin-ssr/plugin'

   export default defineConfig({
     plugins: [
       react(),
       ssr({ prerender: true })
     ]
   })
   ```

3. **Build with pre-rendering:**
   ```bash
   npm run build
   ```

### Alternative: Static Site Generation with Netlify/Vercel

If deploying to Netlify or Vercel, they automatically handle pre-rendering for React apps. Just push your code and deploy.

## SEO Best Practices Implemented

### 1. Meta Tags
✅ Unique title for each page
✅ Descriptive meta descriptions (150-160 characters)
✅ Relevant keywords
✅ Language set to Vietnamese (vi_VN)
✅ Robots meta tag (index, follow)

### 2. Open Graph Tags
✅ og:title
✅ og:description
✅ og:image (uses project cover photo)
✅ og:type (website)
✅ og:locale (vi_VN)
✅ og:url (canonical URL)

### 3. Twitter Cards
✅ twitter:card (summary_large_image)
✅ twitter:title
✅ twitter:description
✅ twitter:image

### 4. Technical SEO
✅ Canonical URLs
✅ Responsive viewport meta tag
✅ UTF-8 character encoding
✅ Semantic HTML structure
✅ Fast loading times (Vite optimization)

## Testing SEO

### 1. Local Testing
Run the development server and inspect the page:
```bash
npm run dev
```

View page source to see the meta tags in the `<head>`.

### 2. Social Media Testing Tools

**Facebook Debugger:**
https://developers.facebook.com/tools/debug/

**Twitter Card Validator:**
https://cards-dev.twitter.com/validator

**Google Rich Results Test:**
https://search.google.com/test/rich-results

### 3. Lighthouse SEO Audit
1. Open Chrome DevTools
2. Go to "Lighthouse" tab
3. Select "SEO" category
4. Run audit

## Sitemap Generation

To generate a sitemap for search engines:

```bash
# Install sitemap generator
npm install -D vite-plugin-sitemap

# Add to vite.config.ts
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    sitemap({
      hostname: 'https://anmaylaptop.com',
      routes: [
        '/',
        '/dang-ky-nha-hao-tam',
        '/dang-ky-sinh-vien'
      ]
    })
  ]
})
```

## robots.txt

Create `public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth
Disallow: /don-dang-ky
Disallow: /nha-hao-tam
Disallow: /sinh-vien
Disallow: /laptop
Disallow: /xe-may
Disallow: /linh-kien
Disallow: /bao-cao
Disallow: /cai-dat

Sitemap: https://anmaylaptop.com/sitemap.xml
```

## Deployment Considerations

### Netlify
Netlify automatically pre-renders React apps. No additional configuration needed.

### Vercel
Vercel also handles pre-rendering automatically for React apps.

### Traditional Hosting (Apache/Nginx)
For traditional hosting, you need to:
1. Build the app: `npm run build`
2. Upload `dist` folder to your server
3. Configure server to serve `index.html` for all routes

**Nginx configuration:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## Monitoring SEO Performance

### Google Search Console
1. Add your website to Google Search Console
2. Submit sitemap
3. Monitor:
   - Index coverage
   - Search performance
   - Mobile usability
   - Core Web Vitals

### Google Analytics
Track:
- Organic search traffic
- Landing pages
- User behavior
- Conversion rates

## Future Improvements

- [ ] Add structured data (JSON-LD) for rich snippets
- [ ] Implement internationalization (i18n) for multiple languages
- [ ] Add blog/news section for content marketing
- [ ] Implement server-side rendering (SSR) for better SEO
- [ ] Create XML sitemap generator
- [ ] Add breadcrumb navigation
- [ ] Optimize images with lazy loading and WebP format
- [ ] Implement schema.org markup for organizations

## Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [React Helmet Async Documentation](https://github.com/staylor/react-helmet-async)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
