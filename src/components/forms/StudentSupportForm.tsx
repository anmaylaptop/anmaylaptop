import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReCaptcha } from "@/components/captcha/ReCaptchaProvider";
import { Loader2 } from "lucide-react";
import { useStudentSupport } from "@/hooks/useStudentSupport";

const formSchema = z.object({
  full_name: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
  facebook_link: z.string().url("Link Facebook không hợp lệ").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface StudentSupportFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  onSuccess?: () => void;
}

export function StudentSupportForm({
  open,
  onOpenChange,
  studentId,
  onSuccess,
}: StudentSupportFormProps) {
  const { executeRecaptcha } = useReCaptcha();
  const { mutate: submitSupport, isPending } = useStudentSupport();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      facebook_link: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // Execute reCAPTCHA
      let recaptchaToken = null;
      try {
        recaptchaToken = await executeRecaptcha("student_support");
      } catch (error) {
        console.warn("reCAPTCHA error:", error);
        // Continue without token if reCAPTCHA fails (for development)
      }

      submitSupport(
        {
          studentId,
          fullName: values.full_name,
          phone: values.phone,
          facebookLink: values.facebook_link || null,
          recaptchaToken,
        },
        {
          onSuccess: () => {
            form.reset();
            onOpenChange(false);
            onSuccess?.();
          },
        }
      );
    } catch (error) {
      console.error("Error submitting student support:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Đăng ký hỗ trợ sinh viên</DialogTitle>
          <DialogDescription>
            Điền thông tin để đăng ký hỗ trợ sinh viên này. Chúng tôi sẽ liên hệ với bạn để xác nhận.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại (10-11 chữ số)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facebook_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Facebook</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://facebook.com/..."
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Đăng ký hỗ trợ
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
