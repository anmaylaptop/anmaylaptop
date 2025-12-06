-- ============================================
-- ADD SUPPORT REGISTRATION ID TO COMPONENTS
-- ============================================
-- Add column to store the donor_application_id of the person who registered to support this component
ALTER TABLE public.components
ADD COLUMN IF NOT EXISTS support_registration_id UUID REFERENCES public.donor_applications(id);

-- Add comment
COMMENT ON COLUMN public.components.support_registration_id IS 
  'ID of the donor_application from quick support registration. Links to the person who registered to support this component.';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_components_support_registration_id 
ON public.components(support_registration_id);
