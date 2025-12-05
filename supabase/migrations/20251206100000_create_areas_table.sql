-- ============================================
-- AREAS TABLE
-- ============================================
CREATE TABLE public.areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- ADD AREA FIELDS TO EXISTING TABLES
-- ============================================

-- Add area_id to donor_applications
ALTER TABLE public.donor_applications 
ADD COLUMN area_id UUID REFERENCES public.areas(id);

-- Add area_id to donors
ALTER TABLE public.donors 
ADD COLUMN area_id UUID REFERENCES public.areas(id);

-- Add area_id to student_applications
ALTER TABLE public.student_applications 
ADD COLUMN area_id UUID REFERENCES public.areas(id);

-- Add area_id to students
ALTER TABLE public.students 
ADD COLUMN area_id UUID REFERENCES public.areas(id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE POLICIES FOR AREAS
-- ============================================
-- Anyone can view active areas (for registration forms)
CREATE POLICY "Anyone can view active areas"
ON public.areas FOR SELECT
USING (is_active = true);

-- Authenticated users can view all areas
CREATE POLICY "Authenticated users can view all areas"
ON public.areas FOR SELECT
USING (auth.role() = 'authenticated');

-- Authenticated users can manage areas
CREATE POLICY "Authenticated users can manage areas"
ON public.areas FOR ALL
USING (auth.role() = 'authenticated');

-- ============================================
-- CREATE TRIGGER FOR TIMESTAMP UPDATES
-- ============================================
CREATE TRIGGER update_areas_updated_at
BEFORE UPDATE ON public.areas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_areas_is_active ON public.areas(is_active);
CREATE INDEX idx_donor_applications_area_id ON public.donor_applications(area_id);
CREATE INDEX idx_donors_area_id ON public.donors(area_id);
CREATE INDEX idx_student_applications_area_id ON public.student_applications(area_id);
CREATE INDEX idx_students_area_id ON public.students(area_id);

-- ============================================
-- INSERT SAMPLE AREAS
-- ============================================
INSERT INTO public.areas (name, description) VALUES
('Hà Nội', 'Thành phố Hà Nội và các quận huyện xung quanh'),
('TP. Hồ Chí Minh', 'Thành phố Hồ Chí Minh và các quận huyện'),
('Đà Nẵng', 'Thành phố Đà Nẵng'),
('Hải Phòng', 'Thành phố Hải Phòng'),
('Cần Thơ', 'Thành phố Cần Thơ'),
('Miền Bắc', 'Các tỉnh miền Bắc khác'),
('Miền Trung', 'Các tỉnh miền Trung'),
('Miền Nam', 'Các tỉnh miền Nam khác');
