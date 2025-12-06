# Development Commands

## Essential Commands

### Installation
```bash
npm install
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Database Commands

### Supabase Setup
```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Start local Supabase
supabase start

# Reset local database (applies migrations)
supabase db reset
```

## Environment Configuration

### Required Environment Variables
Create `.env.local` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

## Database Migrations
- Migration files are in `supabase/migrations/`
- Run migrations locally: `supabase db reset`
- For production, run SQL manually in Supabase Dashboard

## Testing
- Currently no test scripts are defined in package.json
- Add testing framework as needed

## SEO Commands
- SEO is handled via react-helmet-async
- Pre-rendering is configured via prerender.config.ts
- Build process includes SEO optimization

## Deployment
- Production builds are created with `npm run build`
- For Vercel/Netlify, push code to repository for automatic deployment
- For traditional hosting, upload the `dist` folder