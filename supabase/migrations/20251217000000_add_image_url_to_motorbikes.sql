-- Add image_url column to motorbikes table
ALTER TABLE public.motorbikes
ADD COLUMN image_url TEXT;

-- Add comment
COMMENT ON COLUMN public.motorbikes.image_url IS 'URL of the motorbike image stored in Supabase Storage (WebP format, 720p max, 768KB max)';
