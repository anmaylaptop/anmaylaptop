-- Add motorbike_images column to donor_applications table
-- Similar to laptop_images, stores array of image URLs from registration
ALTER TABLE public.donor_applications
ADD COLUMN motorbike_images JSONB;

-- Add comment
COMMENT ON COLUMN public.donor_applications.motorbike_images IS 'Array of motorbike image URLs uploaded during registration (WebP format, 720p max, 768KB max)';

-- Add GIN index for better JSONB query performance
CREATE INDEX IF NOT EXISTS idx_donor_applications_motorbike_images
ON public.donor_applications USING GIN (motorbike_images);
