-- Add support-specific fields to donor_applications table
ALTER TABLE public.donor_applications 
ADD COLUMN laptop_quantity INTEGER,
ADD COLUMN motorbike_quantity INTEGER, 
ADD COLUMN components_quantity INTEGER,
ADD COLUMN tuition_amount DECIMAL(10,2),
ADD COLUMN tuition_frequency support_frequency;

-- Add same fields to donors table  
ALTER TABLE public.donors
ADD COLUMN laptop_quantity INTEGER,
ADD COLUMN motorbike_quantity INTEGER,
ADD COLUMN components_quantity INTEGER, 
ADD COLUMN tuition_amount DECIMAL(10,2),
ADD COLUMN tuition_frequency support_frequency;

-- ============================================
-- CREATE INVENTORY TABLES
-- ============================================

-- Laptop inventory table
CREATE TABLE public.laptops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID REFERENCES public.donors(id),
  student_id UUID REFERENCES public.students(id), -- null if not assigned
  
  -- Laptop details
  brand TEXT,
  model TEXT,
  specifications TEXT,
  condition TEXT,
  notes TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'available', -- available, assigned, delivered, needs_repair
  received_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_date TIMESTAMP WITH TIME ZONE,
  delivered_date TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Motorbike inventory table
CREATE TABLE public.motorbikes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID REFERENCES public.donors(id),
  student_id UUID REFERENCES public.students(id), -- null if not assigned
  
  -- Motorbike details
  brand TEXT,
  model TEXT,
  year INTEGER,
  license_plate TEXT,
  condition TEXT,
  notes TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'available', -- available, assigned, delivered, needs_repair
  received_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_date TIMESTAMP WITH TIME ZONE,
  delivered_date TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Components inventory table  
CREATE TABLE public.components (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID REFERENCES public.donors(id),
  student_id UUID REFERENCES public.students(id), -- null if not assigned
  
  -- Component details
  component_type TEXT NOT NULL, -- RAM, SSD, HDD, Screen, etc.
  brand TEXT,
  model TEXT,
  specifications TEXT,
  condition TEXT,
  notes TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'available', -- available, assigned, delivered, installed
  received_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_date TIMESTAMP WITH TIME ZONE,
  delivered_date TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tuition support table
CREATE TABLE public.tuition_support (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID REFERENCES public.donors(id),
  student_id UUID REFERENCES public.students(id), -- null if not assigned
  
  -- Tuition details
  amount DECIMAL(10,2) NOT NULL,
  frequency support_frequency NOT NULL,
  academic_year academic_year,
  semester INTEGER, -- 1 or 2
  notes TEXT,
  
  -- Payment tracking
  status TEXT NOT NULL DEFAULT 'pledged', -- pledged, paid, completed
  pledged_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_date TIMESTAMP WITH TIME ZONE,
  
  -- For recurring support
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY ON NEW TABLES
-- ============================================
ALTER TABLE public.laptops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motorbikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tuition_support ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE POLICIES FOR ADMIN ACCESS
-- ============================================
CREATE POLICY "Authenticated users can manage laptops"
ON public.laptops FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage motorbikes"
ON public.motorbikes FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage components"
ON public.components FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage tuition support"
ON public.tuition_support FOR ALL
USING (auth.role() = 'authenticated');

-- ============================================
-- CREATE TRIGGERS FOR TIMESTAMP UPDATES
-- ============================================
CREATE TRIGGER update_laptops_updated_at
BEFORE UPDATE ON public.laptops
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_motorbikes_updated_at
BEFORE UPDATE ON public.motorbikes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_components_updated_at
BEFORE UPDATE ON public.components
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tuition_support_updated_at
BEFORE UPDATE ON public.tuition_support
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_laptops_status ON public.laptops(status);
CREATE INDEX idx_laptops_donor_id ON public.laptops(donor_id);
CREATE INDEX idx_laptops_student_id ON public.laptops(student_id);

CREATE INDEX idx_motorbikes_status ON public.motorbikes(status);
CREATE INDEX idx_motorbikes_donor_id ON public.motorbikes(donor_id);
CREATE INDEX idx_motorbikes_student_id ON public.motorbikes(student_id);

CREATE INDEX idx_components_status ON public.components(status);
CREATE INDEX idx_components_donor_id ON public.components(donor_id);
CREATE INDEX idx_components_student_id ON public.components(student_id);
CREATE INDEX idx_components_type ON public.components(component_type);

CREATE INDEX idx_tuition_support_status ON public.tuition_support(status);
CREATE INDEX idx_tuition_support_donor_id ON public.tuition_support(donor_id);
CREATE INDEX idx_tuition_support_student_id ON public.tuition_support(student_id);