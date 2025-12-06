-- ============================================
-- FUNCTION TO REGISTER STUDENT SUPPORT
-- ============================================
-- This function handles student support registration:
-- 1. Creates a donor application for the supporter
-- 2. Creates a notification for admins
-- 3. Links the support to the student (via donor application)
CREATE OR REPLACE FUNCTION public.register_student_support(
  p_student_id UUID,
  p_full_name TEXT,
  p_phone TEXT,
  p_facebook_link TEXT DEFAULT NULL,
  p_recaptcha_token TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student RECORD;
  v_donor_application_id UUID;
  v_notification_title TEXT;
  v_notification_message TEXT;
  v_support_types support_type[] := ARRAY[]::support_type[];
BEGIN
  -- Get student information
  SELECT * INTO v_student
  FROM public.students
  WHERE id = p_student_id;
  
  -- Check if student exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student not found';
  END IF;

  -- Determine support types based on student needs
  IF v_student.need_laptop AND NOT v_student.laptop_received THEN
    v_support_types := array_append(v_support_types, 'laptop');
  END IF;
  
  IF v_student.need_motorbike AND NOT v_student.motorbike_received THEN
    v_support_types := array_append(v_support_types, 'motorbike');
  END IF;
  
  IF v_student.need_tuition AND NOT v_student.tuition_supported THEN
    v_support_types := array_append(v_support_types, 'tuition');
  END IF;
  
  IF v_student.need_components AND NOT v_student.components_received THEN
    v_support_types := array_append(v_support_types, 'components');
  END IF;

  -- If student has no unmet needs, raise exception
  IF array_length(v_support_types, 1) IS NULL THEN
    RAISE EXCEPTION 'Student has no unmet needs';
  END IF;

  -- Create donor application for the supporter
  -- Note: address and birth_year are required but not provided in quick registration, using placeholders
  INSERT INTO public.donor_applications (
    full_name,
    birth_year,
    phone,
    address,
    facebook_link,
    support_types,
    status,
    recaptcha_token,
    created_at,
    updated_at
  ) VALUES (
    p_full_name,
    1990, -- Placeholder birth year since it's required
    p_phone,
    'Chưa cập nhật - Đăng ký hỗ trợ nhanh', -- Placeholder address since it's required
    p_facebook_link,
    v_support_types,
    'pending',
    p_recaptcha_token,
    now(),
    now()
  )
  RETURNING id INTO v_donor_application_id;

  -- Create notification
  v_notification_title := 'Đăng ký hỗ trợ sinh viên';
  v_notification_message := p_full_name || ' vừa đăng ký hỗ trợ sinh viên (ID: ' || LEFT(p_student_id::TEXT, 8) || '...). Nhu cầu: ' || array_to_string(v_support_types, ', ');

  INSERT INTO public.notifications (
    title,
    message,
    type,
    related_type,
    related_id,
    read,
    created_at
  ) VALUES (
    v_notification_title,
    v_notification_message,
    'info',
    'student_support',
    p_student_id,
    false,
    now()
  );

  -- Return success
  RETURN json_build_object(
    'success', true,
    'student_id', p_student_id,
    'donor_application_id', v_donor_application_id,
    'support_types', v_support_types
  );
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.register_student_support TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_student_support TO anon;
