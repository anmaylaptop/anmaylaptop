import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Laptop } from "lucide-react";

interface RegistrationSuccessScreenProps {
  type: "donor" | "student";
  onRegisterAgain?: () => void;
}

const successConfig = {
  donor: {
    title: "Đăng ký thành công - Nhà hảo tâm",
    description: "Cảm ơn bạn đã đăng ký tham gia dự án Ăn mày laptop. Chúng tôi sẽ xử lý và liên hệ với bạn sớm nhất.",
    cardTitle: "Đăng ký thành công!",
    cardDescription: 'Cảm ơn bạn đã quan tâm và đăng ký tham gia dự án "Ăn mày laptop"',
    messages: [
      "Đơn đăng ký của bạn đã được gửi thành công và đang chờ xử lý và sẽ liên hệ.",
      "Chúng tôi sẽ xem xét thông tin và liên hệ với bạn qua số điện thoại hoặc Facebook đã đăng ký trong thời gian sớm nhất.",
    ],
    nextSteps: [
      "• Đội ngũ sẽ xử lý thông tin đăng ký",
      "• Bạn sẽ nhận được thông báo qua điện thoại/Facebook",
      "• Chúng tôi sẽ kết nối bạn với sinh viên phù hợp",
    ],
  },
  student: {
    title: "Đăng ký thành công - Sinh viên",
    description: "Đơn đăng ký của bạn đã được gửi đến dự án Ăn mày laptop. Chúng tôi sẽ xem xét và liên hệ với bạn sớm nhất.",
    cardTitle: "Đăng ký thành công!",
    cardDescription: 'Đơn đăng ký của bạn đã được gửi đến dự án "Ăn mày laptop"',
    messages: [
      "Cảm ơn bạn đã tin tưởng và đăng ký với dự án. Đơn đăng ký của bạn đang chờ xét duyệt từ đội ngũ quản lý.",
      "Chúng tôi sẽ xem xét kỹ lưỡng hoàn cảnh và nhu cầu của bạn. Nếu được duyệt, chúng tôi sẽ tìm kiếm nhà hảo tâm phù hợp để hỗ trợ bạn.",
    ],
    nextSteps: [
      "• Đội ngũ sẽ xác minh thông tin và hoàn cảnh khó khăn",
      "• Bạn có thể được liên hệ để cung cấp thêm thông tin/giấy tờ",
      "• Sau khi được duyệt, chúng tôi sẽ tìm nhà hảo tâm phù hợp",
      "• Bạn sẽ được thông báo qua điện thoại/Facebook khi có kết quả",
    ],
  },
};

export function RegistrationSuccessScreen({
  type,
  onRegisterAgain,
}: RegistrationSuccessScreenProps) {
  const navigate = useNavigate();
  const config = successConfig[type];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEO title={config.title} description={config.description} />
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Laptop className="h-6 w-6" />
            <span className="text-xl font-bold">Ăn mày laptop</span>
          </Link>
        </div>
      </header>

      {/* Success Message */}
      <div className="container py-12 md:py-24">
        <div className="mx-auto max-w-2xl">
          <Card className="border-2 border-primary">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl md:text-3xl">{config.cardTitle}</CardTitle>
              <CardDescription className="text-base">{config.cardDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 text-muted-foreground">
                {config.messages.map((message, index) => (
                  <p key={index}>{message}</p>
                ))}
                <div className="p-4 rounded-lg bg-muted">
                  <p className="font-semibold mb-2">Bước tiếp theo:</p>
                  <ul className="space-y-1 text-sm">
                    {config.nextSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => navigate("/")} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Về trang chủ
                </Button>
                {onRegisterAgain && (
                  <Button onClick={onRegisterAgain} variant="outline" className="flex-1">
                    Đăng ký thêm
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
