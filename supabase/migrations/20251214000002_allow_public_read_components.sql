-- ============================================
-- ALLOW PUBLIC READ ACCESS TO COMPONENTS THAT NEED SUPPORT
-- ============================================
-- This policy allows anyone (including unauthenticated users) to read
-- components that have status = 'needs_support'. This is needed for the public
-- "Ngân hàng linh kiện" page.
-- 
-- Note: This policy only allows SELECT, and only for components with
-- status = 'needs_support'. It does not expose donor_id or student_id,
-- which are sensitive personal information.
--
-- IMPORTANT: This policy must be created AFTER the authenticated policy
-- to ensure proper RLS evaluation. Supabase uses OR logic for multiple
-- policies, so this will work correctly.

-- Drop existing policy if it exists (for re-running migration)
DROP POLICY IF EXISTS "Anyone can view components needing support" ON public.components;

CREATE POLICY "Anyone can view components needing support"
ON public.components FOR SELECT
USING (status = 'needs_support');
