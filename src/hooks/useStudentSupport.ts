import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StudentSupportParams {
  studentId: string;
  fullName: string;
  phone: string;
  facebookLink: string | null;
  recaptchaToken: string | null;
}

export function useStudentSupport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: StudentSupportParams) => {
      const { studentId, fullName, phone, facebookLink, recaptchaToken } = params;

      // Call RPC function to handle student support registration
      // This will create a donor application and notification
      const { data, error } = await supabase.rpc("register_student_support", {
        p_student_id: studentId,
        p_full_name: fullName,
        p_phone: phone,
        p_facebook_link: facebookLink,
        p_recaptcha_token: recaptchaToken,
      });

      if (error) {
        console.error("Error registering student support:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["public-students"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["donor-applications"] });
      
      toast.success("Đăng ký hỗ trợ thành công!", {
        description: "Cảm ơn bạn đã đăng ký hỗ trợ. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.",
      });
    },
    onError: (error: any) => {
      console.error("Error registering student support:", error);
      const errorMessage = error?.message || "Không thể đăng ký hỗ trợ. Vui lòng thử lại sau.";
      toast.error("Có lỗi xảy ra", {
        description: errorMessage,
      });
    },
  });
}
