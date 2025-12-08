import { useState, useEffect } from "react";
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
import { useUpdateMotorbike, MotorbikeData } from "@/hooks/useInventory";
import { ImageUpload } from "@/components/ui/image-upload";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  brand: z.string().min(1, "Vui lòng nhập hãng xe"),
  model: z.string().min(1, "Vui lòng nhập model xe"),
  year: z.coerce.number().nullable().optional(),
  license_plate: z.string().optional(),
  condition: z.string().optional(),
  notes: z.string().optional(),
  image_url: z.string().nullable().optional(),
  status: z.enum(["available", "assigned", "delivered", "needs_repair"]),
  received_date: z.string().min(1, "Vui lòng chọn ngày nhận"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditMotorbikeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  motorbikeId: string | null;
}

// Hook to fetch single motorbike
function useMotorbike(id: string | null) {
  return useQuery({
    queryKey: ["motorbike", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("motorbikes")
        .select(`
          *,
          donors:donor_id(full_name),
          students:student_id(full_name)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching motorbike:", error);
        throw error;
      }

      return {
        ...data,
        donor_name: data.donors?.full_name || null,
        student_name: data.students?.full_name || null,
      } as MotorbikeData;
    },
    enabled: !!id,
  });
}

export function EditMotorbikeForm({ open, onOpenChange, motorbikeId }: EditMotorbikeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateMotorbike = useUpdateMotorbike();
  const { data: motorbike, isLoading } = useMotorbike(motorbikeId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "",
      model: "",
      year: null,
      license_plate: "",
      condition: "",
      notes: "",
      image_url: null,
      status: "available",
      received_date: new Date().toISOString().split("T")[0],
    },
  });

  // Load motorbike data when it's available
  useEffect(() => {
    if (motorbike && open) {
      form.reset({
        brand: motorbike.brand || "",
        model: motorbike.model || "",
        year: motorbike.year || null,
        license_plate: motorbike.license_plate || "",
        condition: motorbike.condition || "",
        notes: motorbike.notes || "",
        image_url: motorbike.image_url || null,
        status: motorbike.status as "available" | "assigned" | "delivered" | "needs_repair",
        received_date: motorbike.received_date.split("T")[0],
      });
    }
  }, [motorbike, open, form]);

  const onSubmit = async (values: FormValues) => {
    if (!motorbikeId) return;

    setIsSubmitting(true);
    try {
      await updateMotorbike.mutateAsync({
        id: motorbikeId,
        updates: {
          brand: values.brand,
          model: values.model,
          year: values.year || null,
          license_plate: values.license_plate || null,
          condition: values.condition || null,
          notes: values.notes || null,
          image_url: values.image_url || null,
          status: values.status,
          received_date: values.received_date,
        },
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating motorbike:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa Xe máy</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin xe máy và upload ảnh mới nếu cần.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Motorbike Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Thông tin xe máy</h4>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hãng *</FormLabel>
                        <FormControl>
                          <Input placeholder="Honda, Yamaha, SYM..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model *</FormLabel>
                        <FormControl>
                          <Input placeholder="Wave, Exciter..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Năm sản xuất</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2020"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="license_plate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biển số</FormLabel>
                        <FormControl>
                          <Input placeholder="29A-12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tình trạng</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mới, đã qua sử dụng, cần sửa chữa..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ảnh xe máy</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value || null}
                          onChange={field.onChange}
                          bucket="laptop-images"
                          folder="motorbikes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            <SelectItem value="available">Sẵn sàng</SelectItem>
                            <SelectItem value="assigned">Đã phân</SelectItem>
                            <SelectItem value="delivered">Đã giao</SelectItem>
                            <SelectItem value="needs_repair">Cần sửa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="received_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày nhận *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cập nhật
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
