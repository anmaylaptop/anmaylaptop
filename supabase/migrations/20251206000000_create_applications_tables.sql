-- Create function to update timestamps (if not exists from previous migration)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create enum types for application status
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum types for support types
CREATE TYPE support_type AS ENUM ('laptop', 'motorbike', 'components', 'tuition');

-- Create enum types for support frequency
CREATE TYPE support_frequency AS ENUM ('one_time', 'recurring');

-- Create enum types for academic year
CREATE TYPE academic_year AS ENUM ('1', '2', '3', '4');

-- ============================================
-- DONOR APPLICATIONS TABLE
-- ============================================
CREATE TABLE public.donor_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Basic contact information
  full_name TEXT NOT NULL,
  birth_year INTEGER NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  facebook_link TEXT,

  -- Support capabilities
  support_types support_type[] NOT NULL,
  support_frequency support_frequency NOT NULL,
  support_details TEXT,

  -- Status and metadata
  status application_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- STUDENT APPLICATIONS TABLE
-- ============================================
CREATE TABLE public.student_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Basic contact information
  full_name TEXT NOT NULL,
  birth_year INTEGER NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  facebook_link TEXT,

  -- Student information
  academic_year academic_year NOT NULL,
  difficult_situation TEXT NOT NULL,

  -- Needs
  need_laptop BOOLEAN NOT NULL DEFAULT false,
  need_motorbike BOOLEAN NOT NULL DEFAULT false,
  need_tuition BOOLEAN NOT NULL DEFAULT false,
  need_components BOOLEAN NOT NULL DEFAULT false,
  components_details TEXT, -- Details if laptop needs repair

  -- Status and metadata
  status application_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  verification_notes TEXT,
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- DONORS TABLE (Approved donors)
-- ============================================
CREATE TABLE public.donors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.donor_applications(id),

  -- Basic contact information
  full_name TEXT NOT NULL,
  birth_year INTEGER NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  facebook_link TEXT,

  -- Support capabilities
  support_types support_type[] NOT NULL,
  support_frequency support_frequency NOT NULL,
  support_details TEXT,
  support_end_date TIMESTAMP WITH TIME ZONE, -- For recurring support

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Metadata
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- STUDENTS TABLE (Approved students)
-- ============================================
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.student_applications(id),

  -- Basic contact information
  full_name TEXT NOT NULL,
  birth_year INTEGER NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  facebook_link TEXT,

  -- Student information
  academic_year academic_year NOT NULL,
  difficult_situation TEXT NOT NULL,

  -- Needs and status
  need_laptop BOOLEAN NOT NULL DEFAULT false,
  laptop_received BOOLEAN NOT NULL DEFAULT false,
  laptop_received_date TIMESTAMP WITH TIME ZONE,

  need_motorbike BOOLEAN NOT NULL DEFAULT false,
  motorbike_received BOOLEAN NOT NULL DEFAULT false,
  motorbike_received_date TIMESTAMP WITH TIME ZONE,

  need_tuition BOOLEAN NOT NULL DEFAULT false,
  tuition_supported BOOLEAN NOT NULL DEFAULT false,
  tuition_support_start_date TIMESTAMP WITH TIME ZONE,

  need_components BOOLEAN NOT NULL DEFAULT false,
  components_details TEXT,
  components_received BOOLEAN NOT NULL DEFAULT false,

  -- Metadata
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.donor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE POLICIES FOR ADMIN ACCESS
-- ============================================
-- For now, all authenticated users can view (will be restricted to admins later)
CREATE POLICY "Authenticated users can view donor applications"
ON public.donor_applications FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert donor applications"
ON public.donor_applications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can update donor applications"
ON public.donor_applications FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view student applications"
ON public.student_applications FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert student applications"
ON public.student_applications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can update student applications"
ON public.student_applications FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view donors"
ON public.donors FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage donors"
ON public.donors FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view students"
ON public.students FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage students"
ON public.students FOR ALL
USING (auth.role() = 'authenticated');

-- ============================================
-- CREATE TRIGGERS FOR TIMESTAMP UPDATES
-- ============================================
CREATE TRIGGER update_donor_applications_updated_at
BEFORE UPDATE ON public.donor_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_applications_updated_at
BEFORE UPDATE ON public.student_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donors_updated_at
BEFORE UPDATE ON public.donors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_donor_applications_status ON public.donor_applications(status);
CREATE INDEX idx_donor_applications_created_at ON public.donor_applications(created_at DESC);

CREATE INDEX idx_student_applications_status ON public.student_applications(status);
CREATE INDEX idx_student_applications_created_at ON public.student_applications(created_at DESC);

CREATE INDEX idx_donors_is_active ON public.donors(is_active);
CREATE INDEX idx_donors_support_types ON public.donors USING GIN(support_types);

CREATE INDEX idx_students_laptop_received ON public.students(laptop_received);
CREATE INDEX idx_students_motorbike_received ON public.students(motorbike_received);
CREATE INDEX idx_students_tuition_supported ON public.students(tuition_supported);
