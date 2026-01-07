import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, Loader2, GraduationCap, Clock, CheckCircle } from "lucide-react";
import type { TuitionSupportData } from "@/hooks/useInventory";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { 
  SupportFrequency,
  supportFrequencyLabels,
  academicYearLabels,
  AcademicYear 
} from "@/enums";

interface TuitionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tuition: TuitionSupportData | null;
  onEdit?: (tuition: TuitionSupportData) => void;
  isLoading?: boolean;
}

export function TuitionDetailDialog({
  open,
  onOpenChange,
  tuition,
  onEdit,
  isLoading,
}: TuitionDetailDialogProps) {
  if (!tuition) return null;

  const statusLabels: Record<string, string> = {
    pledged: "Đã cam kết",
    paid: "Đã thanh toán",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
    pledged: "secondary",
    paid: "default",
    completed: "default",
    cancelled: "destructive",
  };

  const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    pledged: Clock,
    paid: CheckCircle,
    completed: CheckCircle,
    cancelled: Clock,
  };

  const StatusIcon = statusIcons[tuition.status] || Clock;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Chi tiết hỗ trợ học phí</span>
            <div className="flex items-center gap-2">
              <StatusIcon className="h-4 w-4" />
              <Badge variant={statusColors[tuition.status] || "secondary"}>
                {statusLabels[tuition.status] || tuition.status}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Financial Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Thông tin tài chính</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Số tiền</p>
                <p className="font-medium text-lg font-mono">
                  {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND',
                    minimumFractionDigits: 0
                  }).format(tuition.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tần suất</p>
                <p className="font-medium">
                  {supportFrequencyLabels[tuition.frequency as SupportFrequency] || tuition.frequency}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Academic Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Thông tin học tập</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Năm học</p>
                <p className="font-medium">
                  {tuition.academic_year ? academicYearLabels[tuition.academic_year as AcademicYear] || tuition.academic_year : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Học kỳ</p>
                <p className="font-medium">{tuition.semester ? `Học kỳ ${tuition.semester}` : "-"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Donor Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Thông tin người tặng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tên người tặng</p>
                <p className="font-medium">{tuition.donor_name || "Không xác định"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Student Information */}
          {tuition.student_name && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Thông tin sinh viên</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tên sinh viên</p>
                    <p className="font-medium">{tuition.student_name}</p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Date Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Thông tin ngày tháng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Ngày cam kết</p>
                <p className="font-medium">
                  {format(new Date(tuition.pledged_date), "dd/MM/yyyy", { locale: vi })}
                </p>
              </div>
              {tuition.paid_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Ngày thanh toán</p>
                  <p className="font-medium">
                    {format(new Date(tuition.paid_date), "dd/MM/yyyy", { locale: vi })}
                  </p>
                </div>
              )}
              {tuition.start_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
                  <p className="font-medium">
                    {format(new Date(tuition.start_date), "dd/MM/yyyy", { locale: vi })}
                  </p>
                </div>
              )}
              {tuition.end_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Ngày kết thúc</p>
                  <p className="font-medium">
                    {format(new Date(tuition.end_date), "dd/MM/yyyy", { locale: vi })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Thông tin bổ sung</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">
                    {format(new Date(tuition.created_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                  <p className="font-medium">
                    {format(new Date(tuition.updated_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </p>
                </div>
              </div>
              {tuition.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Ghi chú</p>
                  <p className="font-medium whitespace-pre-wrap">{tuition.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {onEdit && (
          <DialogFooter>
            <Button onClick={() => onEdit(tuition)} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Edit className="mr-2 h-4 w-4" />
              )}
              Chỉnh sửa
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

