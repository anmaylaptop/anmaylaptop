import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupportType, SupportFrequency } from "@/enums";
import { useAreas } from "@/hooks/useAreas";
import { ImageUploadMultiple } from "@/components/ui/image-upload-multiple";

const formSchema = z.object({
  full_name: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  facebook_link: z.string().url("Link Facebook không hợp lệ").optional().or(z.literal("")),
  area_id: z.string().min(1, "Vui lòng chọn khu vực"),
  support_types: z.array(z.nativeEnum(SupportType)).min(1, "Vui lòng chọn ít nhất một loại hỗ trợ"),

  laptop_quantity: z.coerce.number().min(0).optional(),
  laptop_images: z.array(z.string().url()).optional(),
  motorbike_quantity: z.coerce.number().min(0).optional(),
  motorbike_images: z.array(z.string().url()).optional(),
  components_quantity: z.coerce.number().min(0).optional(),
  tuition_amount: z.coerce.number().min(0).optional(),
  tuition_frequency: z.nativeEnum(SupportFrequency).optional(),
  support_frequency: z.nativeEnum(SupportFrequency),
}).superRefine((data, ctx) => {
  // Validate required fields based on support types
  if (data.support_types.includes(SupportType.LAPTOP) && (!data.laptop_quantity || data.laptop_quantity < 1)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Vui lòng nhập số lượng laptop (tối thiểu 1)",
      path: ["laptop_quantity"],
    });
  }

  if (data.support_types.includes(SupportType.MOTORBIKE) && (!data.motorbike_quantity || data.motorbike_quantity < 1)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Vui lòng nhập số lượng xe máy (tối thiểu 1)",
      path: ["motorbike_quantity"],
    });
  }

  if (data.support_types.includes(SupportType.COMPONENTS) && (!data.components_quantity || data.components_quantity < 1)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Vui lòng nhập số lượng linh kiện (tối thiểu 1)",
      path: ["components_quantity"],
    });
  }

  if (data.support_types.includes(SupportType.TUITION)) {
    if (!data.tuition_amount || data.tuition_amount < 100000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng nhập số tiền hỗ trợ học phí (tối thiểu 100,000 VNĐ)",
        path: ["tuition_amount"],
      });
    }
    if (!data.tuition_frequency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn tần suất hỗ trợ học phí",
        path: ["tuition_frequency"],
      });
    }
  }
});

type FormValues = z.infer<typeof formSchema>;

interface CreateDonorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDonorDialog({ open, onOpenChange }: CreateDonorDialogProps) {
  const queryClient = useQueryClient();
  const { data: areasResult } = useAreas();
  const areas = areasResult?.data || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      address: "",
      facebook_link: "",
      area_id: "",
      support_types: [],
      laptop_quantity: 0,
      laptop_images: [],
      motorbike_quantity: 0,
      motorbike_images: [],
      components_quantity: 0,
      tuition_amount: 0,
      support_frequency: SupportFrequency.ONE_TIME,
    },
  });

  const createDonorMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Create donor record
      const donorData = {
        application_id: null,
        full_name: values.full_name,
        phone: values.phone,
        address: values.address,
        facebook_link: values.facebook_link || null,
        area_id: values.area_id,
        support_types: values.support_types,
        support_details: null,
        laptop_quantity: values.support_types.includes(SupportType.LAPTOP) ? values.laptop_quantity : null,
        motorbike_quantity: values.support_types.includes(SupportType.MOTORBIKE) ? values.motorbike_quantity : null,
        components_quantity: values.support_types.includes(SupportType.COMPONENTS) ? values.components_quantity : null,
        tuition_amount: values.support_types.includes(SupportType.TUITION) ? values.tuition_amount : null,
        tuition_frequency: values.support_types.includes(SupportType.TUITION) ? values.tuition_frequency : null,
        support_frequency: values.support_frequency,
        support_end_date: null,
        is_active: true,
        notes: "Tạo bởi admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: donor, error: donorError } = await supabase
        .from("donors")
        .insert(donorData)
        .select()
        .single();

      if (donorError) {
        console.error("Error creating donor:", donorError);
        throw donorError;
      }

      const donorId = donor.id;

      // Create inventory records based on support types
      // Create laptop records with image distribution
      if (values.support_types.includes(SupportType.LAPTOP) && values.laptop_quantity && values.laptop_quantity > 0) {
        const laptopImages = values.laptop_images || [];
        const laptopInserts = [];
        for (let i = 0; i < values.laptop_quantity; i++) {
          // Distribute images: each laptop gets one image, round-robin if fewer images than laptops
          const imageUrl = laptopImages.length > 0
            ? laptopImages[i % laptopImages.length]
            : null;

          laptopInserts.push({
            donor_id: donorId,
            status: 'available',
            image_url: imageUrl,
            notes: `Từ nhà hảo tâm: ${values.full_name} (Tạo bởi admin)`,
          });
        }
        const { error: laptopError } = await supabase.from("laptops").insert(laptopInserts);
        if (laptopError) {
          console.error("Error creating laptops:", laptopError);
          throw laptopError;
        }
      }

      // Create motorbike records with image distribution
      if (values.support_types.includes(SupportType.MOTORBIKE) && values.motorbike_quantity && values.motorbike_quantity > 0) {
        const motorbikeImages = values.motorbike_images || [];
        const motorbikeInserts = [];
        for (let i = 0; i < values.motorbike_quantity; i++) {
          // Distribute images: each motorbike gets one image, round-robin if fewer images than motorbikes
          const imageUrl = motorbikeImages.length > 0
            ? motorbikeImages[i % motorbikeImages.length]
            : null;

          motorbikeInserts.push({
            donor_id: donorId,
            status: 'available',
            image_url: imageUrl,
            notes: `Từ nhà hảo tâm: ${values.full_name} (Tạo bởi admin)`,
          });
        }
        const { error: motorbikeError } = await supabase.from("motorbikes").insert(motorbikeInserts);
        if (motorbikeError) {
          console.error("Error creating motorbikes:", motorbikeError);
          throw motorbikeError;
        }
      }

      // Create component records
      if (values.support_types.includes(SupportType.COMPONENTS) && values.components_quantity && values.components_quantity > 0) {
        const componentInserts = [];
        for (let i = 0; i < values.components_quantity; i++) {
          componentInserts.push({
            donor_id: donorId,
            component_type: 'General',
            status: 'available',
            notes: `Từ nhà hảo tâm: ${values.full_name} (Tạo bởi admin)`,
          });
        }
        const { error: componentError } = await supabase.from("components").insert(componentInserts);
        if (componentError) {
          console.error("Error creating components:", componentError);
          throw componentError;
        }
      }

      // Create tuition support record
      if (values.support_types.includes(SupportType.TUITION) && values.tuition_amount && values.tuition_amount > 0) {
        const { error: tuitionError } = await supabase.from("tuition_support").insert({
          donor_id: donorId,
          amount: values.tuition_amount,
          frequency: values.tuition_frequency || SupportFrequency.ONE_TIME,
          status: 'pledged',
          notes: `Từ nhà hảo tâm: ${values.full_name} (Tạo bởi admin)`,
        });
        if (tuitionError) {
          console.error("Error creating tuition support:", tuitionError);
          throw tuitionError;
        }
      }

      return donor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
      toast.success("Thêm nhà hảo tâm thành công");
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error creating donor:", error);
      toast.error("Có lỗi xảy ra khi thêm nhà hảo tâm");
    },
  });

  const onSubmit = (values: FormValues) => {
    createDonorMutation.mutate(values);
  };

  const supportTypes = form.watch("support_types");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm nhà hảo tâm mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin nhà hảo tâm. Hệ thống sẽ tự động tạo các bản ghi tài sản tương ứng.
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
              name="support_frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tần suất hỗ trợ *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SupportFrequency.ONE_TIME}>Một lần</SelectItem>
                      <SelectItem value={SupportFrequency.RECURRING}>Định kỳ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="support_types"
              render={() => (
                <FormItem>
                  <FormLabel>Loại hỗ trợ *</FormLabel>
                  <div className="space-y-2">
                    {[
                      { value: SupportType.LAPTOP, label: "Laptop" },
                      { value: SupportType.MOTORBIKE, label: "Xe máy" },
                      { value: SupportType.COMPONENTS, label: "Linh kiện" },
                      { value: SupportType.TUITION, label: "Học phí" },
                    ].map((item) => (
                      <FormField
                        key={item.value}
                        control={form.control}
                        name="support_types"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.value)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  field.onChange(
                                    checked
                                      ? [...currentValues, item.value]
                                      : currentValues.filter((value) => value !== item.value)
                                  );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional quantity fields */}
            {supportTypes.includes(SupportType.LAPTOP) && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="laptop_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng laptop *</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="laptop_images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ảnh laptop (tùy chọn)</FormLabel>
                      <FormControl>
                        <ImageUploadMultiple
                          value={field.value || []}
                          onChange={field.onChange}
                          bucket="laptop-images"
                          folder="admin-donors"
                          maxImages={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {supportTypes.includes(SupportType.MOTORBIKE) && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="motorbike_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng xe máy *</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="motorbike_images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ảnh xe máy (tùy chọn)</FormLabel>
                      <FormControl>
                        <ImageUploadMultiple
                          value={field.value || []}
                          onChange={field.onChange}
                          bucket="laptop-images"
                          folder="admin-donors"
                          maxImages={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {supportTypes.includes(SupportType.COMPONENTS) && (
              <FormField
                control={form.control}
                name="components_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng linh kiện *</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {supportTypes.includes(SupportType.TUITION) && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="tuition_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số tiền hỗ trợ học phí (VNĐ) *</FormLabel>
                      <FormControl>
                        <Input type="number" min={100000} placeholder="1000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tuition_frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tần suất hỗ trợ học phí *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn tần suất" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={SupportFrequency.ONE_TIME}>Một lần</SelectItem>
                          <SelectItem value={SupportFrequency.RECURRING}>Định kỳ</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createDonorMutation.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={createDonorMutation.isPending}>
                {createDonorMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Thêm nhà hảo tâm
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
