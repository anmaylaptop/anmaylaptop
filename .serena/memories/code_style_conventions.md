# Code Style and Conventions

## Naming Conventions
- **Components**: PascalCase (e.g., PublicHome, DonorRegistrationForm)
- **Functions**: camelCase (e.g., handleSubmit, validateForm)
- **Constants**: UPPER_SNAKE_CASE (e.g., MAX_FILE_SIZE, DEFAULT_PAGE_SIZE)
- **Files**: kebab-case for non-components, PascalCase for components
- **Variables**: camelCase (e.g., userName, isPending)

## TypeScript Conventions
- Use TypeScript for all new code
- Define interfaces for component props
- Use strict null checks (though currently disabled in config)
- Leverage utility types where appropriate
- Type all function parameters and return values

## Component Structure
- Use functional components with hooks
- Keep components focused and single-purpose
- Organize components in feature-based directories
- Use shadcn/ui components for consistent UI
- Implement responsive design with Tailwind CSS

## File and Directory Organization
- Components organized by feature in `/src/components/`
- Pages organized in `/src/pages/` by route
- Shared utilities in `/src/lib/`
- Custom hooks in `/src/hooks/`
- Custom types in `/src/types/`
- Third-party integrations in `/src/integrations/`

## Code Formatting
- Use 2 space indentation
- Use single quotes for strings (except template literals)
- Use arrow functions for component definitions
- Prefer functional components over class components
- Use React hooks instead of lifecycle methods

## Imports
- Order: React imports first, then external libraries, then local imports
- Use absolute imports with @/ alias (e.g., "@/components/ui/button")
- Group related imports
- Use destructuring where appropriate

## Comments
- Use JSDoc for public functions and components
- Use inline comments sparingly for complex logic
- Update comments when code changes
- Avoid obvious comments

## Error Handling
- Use React Query error handling for API calls
- Implement proper error boundaries
- Display user-friendly error messages
- Log errors appropriately in development