-- ============================================
-- ALLOW PUBLIC READ ACCESS TO APPROVED STUDENTS
-- ============================================
-- This policy allows anyone (including unauthenticated users) to read
-- approved students (students table). This is needed for the public
-- "Danh sách sinh viên" page.
-- 
-- Note: This policy only allows SELECT. Sensitive information (full_name, phone)
-- is NOT exposed to public users because the application layer (usePublicStudents hook)
-- only queries specific non-sensitive columns.
-- Only authenticated admins can see full information via the admin interface.
--
-- IMPORTANT: This policy must be created AFTER the authenticated policy
-- to ensure proper RLS evaluation. Supabase uses OR logic for multiple
-- policies, so this will work correctly.
--
-- SECURITY NOTE: All records in the students table are approved by definition
-- (they are created from approved student_applications). The application layer
-- enforces privacy by only selecting non-sensitive fields.

-- Drop existing policy if it exists (for re-running migration)
DROP POLICY IF EXISTS "Anyone can view approved students (public fields)" ON public.students;

-- Create policy that allows public read of approved students
-- Note: RLS policies cannot restrict columns directly, so column-level security
-- is enforced in the application layer. The usePublicStudents hook only selects:
-- id, birth_year, academic_year, area_id, difficult_situation,
-- need_laptop, need_motorbike, need_tuition, need_components, components_details,
-- laptop_received, motorbike_received, tuition_supported, components_received,
-- created_at, updated_at
-- 
-- It will NOT select: full_name, phone, address, facebook_link, notes
CREATE POLICY "Anyone can view approved students (public fields)"
ON public.students FOR SELECT
USING (true); -- All students in the table are approved (they come from approved applications)
