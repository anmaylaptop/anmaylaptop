import { StudentRegistrationForm } from "@/components/forms/StudentRegistrationForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RegistrationSuccessScreen } from "@/components/RegistrationSuccessScreen";
import { PublicRegistrationLayout } from "@/components/PublicRegistrationLayout";

export default function PublicStudentRegistration() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <RegistrationSuccessScreen
        type="student"
        onRegisterAgain={() => setIsSuccess(false)}
      />
    );
  }

  return (
    <PublicRegistrationLayout
      title="Đăng ký sinh viên cần hỗ trợ"
      description="Chúng tôi hiểu khó khăn của bạn. Vui lòng điền đầy đủ và trung thực thông tin để chúng tôi có thể hỗ trợ bạn tốt nhất."
      seoTitle="Đăng ký sinh viên cần hỗ trợ - Ăn mày laptop"
      seoDescription="Sinh viên có hoàn cảnh khó khăn đăng ký nhận hỗ trợ laptop, xe máy, linh kiện hoặc học phí từ dự án Ăn mày laptop."
      seoKeywords="đăng ký sinh viên, hỗ trợ sinh viên, laptop miễn phí, xe máy miễn phí, học phí, ăn mày laptop"
    >
      <StudentRegistrationForm
        onSuccess={handleSuccess}
        onCancel={() => navigate("/")}
      />
    </PublicRegistrationLayout>
  );
}
