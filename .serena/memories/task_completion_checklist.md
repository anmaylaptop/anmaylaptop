# Task Completion Checklist

## Before Committing Changes

### Code Quality
- [ ] Run `npm run lint` and fix any linting errors
- [ ] Ensure TypeScript compiles without errors (`npm run build` should succeed)
- [ ] Verify that all new code follows the project's code style and conventions
- [ ] Check that component imports are properly organized
- [ ] Confirm that error handling is implemented appropriately

### Testing
- [ ] Test functionality in development environment (`npm run dev`)
- [ ] Verify responsive design works on different screen sizes
- [ ] Check that forms validate correctly
- [ ] Test all user flows that were modified
- [ ] Ensure authentication flows still work if changes affect them

### Database Changes
- [ ] If database schema changed, update the migration files
- [ ] Update Supabase types if schema changes were made (`supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts`)
- [ ] Test database operations related to the changes
- [ ] Update RLS policies if needed

### UI/UX
- [ ] Confirm UI changes follow the project's design system
- [ ] Verify that new components use shadcn/ui components where appropriate
- [ ] Check that forms have proper validation
- [ ] Ensure accessibility attributes are present where needed
- [ ] Verify that loading states are handled properly

### SEO
- [ ] If new public pages were added, ensure they have proper SEO components
- [ ] Add new routes to prerender.config.ts if they should be pre-rendered
- [ ] Verify meta tags appear correctly in new pages
- [ ] Test social sharing previews

### Authentication
- [ ] Test that protected routes still require authentication
- [ ] Verify that public forms still work without authentication
- [ ] Check that admin functionality is still properly restricted

### Performance
- [ ] Check that new components don't cause unnecessary re-renders
- [ ] Verify that API calls are efficient and properly cached where appropriate
- [ ] Confirm that no unnecessary dependencies were added

## After Implementation
- [ ] Update any relevant documentation
- [ ] Ensure the README or other docs reflect changes made
- [ ] Run a final build (`npm run build`) to confirm everything works in production mode
- [ ] Verify git status and commit messages follow conventional format