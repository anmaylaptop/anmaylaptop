import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAreas } from "@/hooks/useAreas";

const formSchema = z.object({
  full_name: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  birth_year: z.coerce.number().min(1990, "Năm sinh không hợp lệ").max(new Date().getFullYear(), "Năm sinh không hợp lệ"),
  phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  facebook_link: z.string().url("Link Facebook không hợp lệ").optional().or(z.literal("")),
  area_id: z.string().min(1, "Vui lòng chọn khu vực"),
  academic_year: z.string().min(1, "Vui lòng chọn năm học"),
  difficult_situation: z.string().min(10, "Vui lòng mô tả hoàn cảnh khó khăn (tối thiểu 10 ký tự)"),
  need_laptop: z.boolean().default(false),
  need_motorbike: z.boolean().default(false),
  need_tuition: z.boolean().default(false),
  need_components: z.boolean().default(false),
  components_details: z.string().optional(),
}).refine(
  (data) => data.need_laptop || data.need_motorbike || data.need_tuition || data.need_components,
  {
    message: "Vui lòng chọn ít nhất một loại hỗ trợ cần thiết",
    path: ["need_laptop"],
  }
);

type FormValues = z.infer<typeof formSchema>;

interface CreateStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStudentDialog({ open, onOpenChange }: CreateStudentDialogProps) {
  const queryClient = useQueryClient();
  const { data: areasResult } = useAreas();
  const areas = areasResult?.data || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      birth_year: new Date().getFullYear() - 20,
      phone: "",
      address: "",
      facebook_link: "",
      area_id: "",
      academic_year: "1",
      difficult_situation: "",
      need_laptop: false,
      need_motorbike: false,
      need_tuition: false,
      need_components: false,
      components_details: "",
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Create student record
      const studentData = {
        application_id: null,
        full_name: values.full_name,
        birth_year: values.birth_year,
        phone: values.phone,
        address: values.address,
        facebook_link: values.facebook_link || null,
        area_id: values.area_id,
        academic_year: values.academic_year,
        difficult_situation: values.difficult_situation,
        need_laptop: values.need_laptop,
        laptop_received: false,
        laptop_received_date: null,
        need_motorbike: values.need_motorbike,
        motorbike_received: false,
        motorbike_received_date: null,
        need_tuition: values.need_tuition,
        tuition_supported: false,
        tuition_support_start_date: null,
        need_components: values.need_components,
        components_details: values.components_details || null,
        components_received: false,
        notes: "Tạo bởi admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: student, error: studentError } = await supabase
        .from("students")
        .insert(studentData)
        .select()
        .single();

      if (studentError) {
        console.error("Error creating student:", studentError);
        throw studentError;
      }

      return student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Thêm sinh viên thành công");
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error creating student:", error);
      toast.error("Có lỗi xảy ra khi thêm sinh viên");
    },
  });

  const onSubmit = (values: FormValues) => {
    createStudentMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm sinh viên mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin sinh viên cần hỗ trợ
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
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birth_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Năm sinh *</FormLabel>
                    <FormControl>
                      <Input type="number" min={1990} max={new Date().getFullYear()} placeholder="2000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academic_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Năm học *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn năm học" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Năm 1</SelectItem>
                        <SelectItem value="2">Năm 2</SelectItem>
                        <SelectItem value="3">Năm 3</SelectItem>
                        <SelectItem value="4">Năm 4</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại *</FormLabel>
                    <FormControl>
                      <Input placeholder="0912345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khu vực *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn khu vực" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ *</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Đường ABC, Quận XYZ" {...field} />
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
                    <Input placeholder="https://facebook.com/profile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficult_situation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hoàn cảnh khó khăn *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả hoàn cảnh khó khăn của sinh viên..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Nhu cầu hỗ trợ *</FormLabel>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="need_laptop"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Laptop
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="need_motorbike"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Xe máy
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="need_tuition"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Học phí
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="need_components"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Linh kiện
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <FormMessage />
            </div>

            {form.watch("need_components") && (
              <FormField
                control={form.control}
                name="components_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chi tiết linh kiện cần hỗ trợ</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết các linh kiện cần thiết..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createStudentMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={createStudentMutation.isPending}>
                {createStudentMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Thêm sinh viên
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
