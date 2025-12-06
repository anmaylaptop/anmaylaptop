# Connect Uplift Project Information

## Project Purpose
The "Ăn mày laptop" (Begging Laptop) project is a charitable initiative aimed at:
- Collecting old laptops to repair and give to students in difficult circumstances
- Expanding support to motorcycles for students who need them to earn a living
- Connecting donors with students in need (laptops, motorcycles, components, tuition fees)
- Ensuring transparency through public reporting on Facebook

## Tech Stack
- **Frontend**: React (TypeScript), Vite
- **UI Framework**: shadcn/ui with Tailwind CSS
- **Database**: Supabase (PostgreSQL-based)
- **Authentication**: Supabase Auth
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom CSS variables
- **SEO**: React Helmet Async

## Architecture Overview
- Public routes for registration without authentication
- Admin routes requiring authentication
- Supabase database with RLS (Row Level Security)
- TypeScript throughout the codebase
- Responsive UI using shadcn components

## Project Structure
```
src/
├── components/      # UI components and feature-specific components
├── contexts/        # React contexts (AuthContext)
├── enums/          # TypeScript enums
├── hooks/          # Custom React hooks
├── integrations/   # Third-party integrations (Supabase)
├── lib/            # Utility functions and libraries
├── pages/          # Route components
├── types/          # TypeScript type definitions
├── App.tsx        # Main routing component
├── main.tsx       # Entry point
└── index.css      # Global styles
```