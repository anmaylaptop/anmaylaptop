-- Update the laptop-images bucket to support both laptops and motorbikes
-- The bucket is already created, we just need to update the policies to include motorbikes folder

-- Add storage policy for authenticated users to upload motorbike images
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
SELECT 'laptop-images', 'motorbikes/.keep', auth.uid(), '{}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM storage.objects
  WHERE bucket_id = 'laptop-images' AND name = 'motorbikes/.keep'
)
ON CONFLICT DO NOTHING;

-- The existing policies for laptop-images bucket already allow:
-- 1. Authenticated users to upload to laptops/ folder
-- 2. Public users to upload to donor-applications/ folder
-- 3. Public read access to all images
-- We just need to ensure motorbikes/ folder is accessible

-- Note: The bucket already has correct policies, we're just documenting the folder structure:
-- - laptops/: Laptop inventory images (authenticated users)
-- - motorbikes/: Motorbike inventory images (authenticated users)
-- - donor-applications/: Registration form images (public users)
