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
import { Edit, Loader2, Bike } from "lucide-react";
import type { MotorbikeData } from "@/hooks/useInventory";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface MotorbikeDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  motorbike: MotorbikeData | null;
  onEdit?: (motorbike: MotorbikeData) => void;
  isLoading?: boolean;
}

export function MotorbikeDetailDialog({
  open,
  onOpenChange,
  motorbike,
  onEdit,
  isLoading,
}: MotorbikeDetailDialogProps) {
  if (!motorbike) return null;

  const statusLabels: Record<string, string> = {
    available: "Sẵn sàng",
    assigned: "Đã phân",
    delivered: "Đã giao",
    needs_repair: "Cần sửa",
  };

  const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
    available: "default",
    assigned: "secondary",
    delivered: "default",
    needs_repair: "destructive",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Chi tiết xe máy</span>
            <Badge variant={statusColors[motorbike.status] || "secondary"}>
              {statusLabels[motorbike.status] || motorbike.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          {motorbike.image_url && (
            <div className="flex justify-center">
              <img
                src={motorbike.image_url}
                alt={`${motorbike.brand} ${motorbike.model}`}
                className="max-h-64 rounded-lg border"
              />
            </div>
          )}

          {/* Vehicle Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Thông tin xe máy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Hãng</p>
                <p className="font-medium">{motorbike.brand || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-medium">{motorbike.model || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Biển số</p>
                <p className="font-medium">{motorbike.license_plate || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Năm sản xuất</p>
                <p className="font-medium">{motorbike.year || "-"}</p>
              </div>
              {motorbike.condition && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Tình trạng</p>
                  <p className="font-medium">{motorbike.condition}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Donor Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Thông tin người tặng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tên người tặng</p>
                <p className="font-medium">{motorbike.donor_name || "Không xác định"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Assignment Information */}
          {motorbike.student_name && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Thông tin phân phối</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Người nhận</p>
                    <p className="font-medium">{motorbike.student_name}</p>
                  </div>
                  {motorbike.assigned_date && (
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày phân phối</p>
                      <p className="font-medium">
                        {format(new Date(motorbike.assigned_date), "dd/MM/yyyy", { locale: vi })}
                      </p>
                    </div>
                  )}
                  {motorbike.delivered_date && (
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày giao</p>
                      <p className="font-medium">
                        {format(new Date(motorbike.delivered_date), "dd/MM/yyyy", { locale: vi })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Additional Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Thông tin bổ sung</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ngày nhận</p>
                  <p className="font-medium">
                    {format(new Date(motorbike.received_date), "dd/MM/yyyy", { locale: vi })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">
                    {format(new Date(motorbike.created_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                  <p className="font-medium">
                    {format(new Date(motorbike.updated_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </p>
                </div>
              </div>
              {motorbike.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Ghi chú</p>
                  <p className="font-medium whitespace-pre-wrap">{motorbike.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {onEdit && (
          <DialogFooter>
            <Button onClick={() => onEdit(motorbike)} disabled={isLoading}>
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

