import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
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
import { Label } from "@/components/ui/label";
import { SupportFrequency } from "@/enums";
import { AreaSelect } from "./AreaSelect";
import { useFindDonor } from "@/hooks/useFindDonor";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DonorSelectorProps {
  supportType: "laptop" | "motorbike" | "components" | "tuition";
}

export function DonorSelector({ supportType }: DonorSelectorProps) {
  const form = useFormContext();
  const [searchPhone, setSearchPhone] = useState("");
  const [searchFacebook, setSearchFacebook] = useState("");
  const [debouncedPhone, setDebouncedPhone] = useState("");
  const [debouncedFacebook, setDebouncedFacebook] = useState("");

  // Debounce phone input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPhone(searchPhone);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchPhone]);

  // Debounce Facebook input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFacebook(searchFacebook);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchFacebook]);

  // Search for donor
  const { data: foundDonor, isLoading: isSearching } = useFindDonor({
    phone: debouncedPhone,
    facebookLink: debouncedFacebook,
    enabled: !!(debouncedPhone || debouncedFacebook),
  });

  // Auto-fill when donor is found
  useEffect(() => {
    if (foundDonor) {
      // Check if this donor supports the required type
      const supportsType = foundDonor.support_types.includes(supportType);

      if (supportsType) {
        form.setValue("donor_id", foundDonor.id);
        form.setValue("donor_full_name", foundDonor.full_name);
        form.setValue("donor_phone", foundDonor.phone);
        form.setValue("donor_address", foundDonor.address);
        form.setValue("donor_facebook_link", foundDonor.facebook_link || "");
        form.setValue("donor_area_id", foundDonor.area_id || "");

        if (supportType === "tuition" && foundDonor.tuition_frequency) {
          form.setValue("donor_tuition_frequency", foundDonor.tuition_frequency);
        }
      }
    }
  }, [foundDonor, form, supportType]);

  const supportTypeName =
    supportType === "laptop"
      ? "laptop"
      : supportType === "motorbike"
      ? "xe máy"
      : supportType === "components"
      ? "linh kiện"
      : "học phí";

  const donorSupportsType = foundDonor?.support_types.includes(supportType);

  return (
    <div className="space-y-4">
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Thông tin nhà hảo tâm</h4>
          {isSearching && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Nhập số điện thoại hoặc link Facebook. Nếu nhà hảo tâm đã có trong hệ thống, thông tin sẽ được tự động điền.
        </p>

        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="donor_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0123456789"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setSearchPhone(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="donor_facebook_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link Facebook</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://facebook.com/username"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      setSearchFacebook(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status Messages */}
        {foundDonor && donorSupportsType && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Tìm thấy nhà hảo tâm: <strong>{foundDonor.full_name}</strong>. Thông tin đã được tự động điền.
            </AlertDescription>
          </Alert>
        )}

        {foundDonor && !donorSupportsType && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertDescription className="text-amber-800">
              Tìm thấy nhà hảo tâm <strong>{foundDonor.full_name}</strong>, nhưng họ không hỗ trợ {supportTypeName}.
              Bạn có thể tiếp tục nhập thông tin để thêm mới.
            </AlertDescription>
          </Alert>
        )}

        {/* Other Donor Fields */}
        <FormField
          control={form.control}
          name="donor_full_name"
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

        <FormField
          control={form.control}
          name="donor_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ *</FormLabel>
              <FormControl>
                <Textarea placeholder="Địa chỉ liên lạc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="donor_area_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khu vực *</FormLabel>
              <FormControl>
                <AreaSelect
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  placeholder="Chọn khu vực..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {supportType === "tuition" && (
          <FormField
            control={form.control}
            name="donor_tuition_frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tần suất hỗ trợ</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tần suất..." />
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
        )}

        {/* Hidden field for donor_id */}
        <input type="hidden" {...form.register("donor_id")} />
      </div>
    </div>
  );
}
