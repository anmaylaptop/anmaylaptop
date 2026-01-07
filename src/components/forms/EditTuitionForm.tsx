import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useUpdateTuitionSupport, useTuition, type TuitionSupportData } from "@/hooks/useInventory";
import { SupportFrequency } from "@/enums";

const formSchema = z.object({
  amount: z.coerce.number().min(100000, "Số tiền phải ít nhất 100,000 VNĐ"),
  frequency: z.nativeEnum(SupportFrequency),
  academic_year: z.string().optional(),
  semester: z.coerce.number().nullable().optional(),
  notes: z.string().optional(),
  status: z.enum(["pledged", "paid", "completed", "cancelled"]),
  pledged_date: z.string().min(1, "Vui lòng chọn ngày cam kết"),
  paid_date: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditTuitionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tuitionId: string | null;
}

export function EditTuitionForm({
  open,
  onOpenChange,
  tuitionId,
}: EditTuitionFormProps) {
  const { data: tuition, isLoading: isLoadingTuition } = useTuition(tuitionId);
  const updateTuition = useUpdateTuitionSupport();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 1000000,
      frequency: SupportFrequency.ONE_TIME,
      academic_year: "",
      semester: null,
      notes: "",
      status: "pledged",
      pledged_date: new Date().toISOString().split("T")[0],
      paid_date: "",
      start_date: "",
      end_date: "",
    },
  });

  useEffect(() => {
    if (tuition && open) {
      form.reset({
        amount: tuition.amount,
        frequency: tuition.frequency as SupportFrequency,
        academic_year: tuition.academic_year || "",
        semester: tuition.semester || null,
        notes: tuition.notes || "",
        status: tuition.status as "pledged" | "paid" | "completed" | "cancelled",
        pledged_date: tuition.pledged_date.split("T")[0],
        paid_date: tuition.paid_date ? tuition.paid_date.split("T")[0] : "",
        start_date: tuition.start_date ? tuition.start_date.split("T")[0] : "",
        end_date: tuition.end_date ? tuition.end_date.split("T")[0] : "",
      });
    }
  }, [tuition, open, form]);

  const onSubmit = async (values: FormValues) => {
    if (!tuitionId) return;

    try {
      await updateTuition.mutateAsync({
        id: tuitionId,
        updates: {
          amount: values.amount,
          frequency: values.frequency,
          academic_year: values.academic_year || null,
          semester: values.semester || null,
          notes: values.notes || null,
          status: values.status,
          pledged_date: values.pledged_date,
          paid_date: values.paid_date || null,
          start_date: values.start_date || null,
          end_date: values.end_date || null,
        },
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error updating tuition support:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa Hỗ trợ học phí</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin hỗ trợ học phí.
          </DialogDescription>
        </DialogHeader>

        {isLoadingTuition ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Tuition Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Thông tin hỗ trợ học phí</h4>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số tiền (VNĐ) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="100000"
                            step="50000"
                            placeholder="1000000"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Tối thiểu 100,000 VNĐ
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tần suất *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={SupportFrequency.ONE_TIME}>
                              Một lần
                            </SelectItem>
                            <SelectItem value={SupportFrequency.RECURRING}>
                              Định kỳ
                            </SelectItem>
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
                    name="academic_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Năm học</FormLabel>
                        <FormControl>
                          <Input placeholder="2024-2025" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Học kỳ</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === "none" ? null : Number(value))}
                          value={field.value?.toString() || "none"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn học kỳ..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Không chọn</SelectItem>
                            <SelectItem value="1">Học kỳ 1</SelectItem>
                            <SelectItem value="2">Học kỳ 2</SelectItem>
                            <SelectItem value="3">Học kỳ 3</SelectItem>
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pledged">Đã cam kết</SelectItem>
                            <SelectItem value="paid">Đã thanh toán</SelectItem>
                            <SelectItem value="completed">Hoàn thành</SelectItem>
                            <SelectItem value="cancelled">Đã hủy</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pledged_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày cam kết *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="paid_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày thanh toán</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày bắt đầu</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Cho hỗ trợ định kỳ
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày kết thúc</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Cho hỗ trợ định kỳ
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ghi chú thêm..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={updateTuition.isPending}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={updateTuition.isPending}>
                  {updateTuition.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cập nhật hỗ trợ học phí
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

