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
import { Edit, Loader2, Wrench, ExternalLink, Phone } from "lucide-react";
import type { ComponentData } from "@/hooks/useInventory";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ComponentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  component: ComponentData | null;
  onEdit?: (component: ComponentData) => void;
  isLoading?: boolean;
}

export function ComponentDetailDialog({
  open,
  onOpenChange,
  component,
  onEdit,
  isLoading,
}: ComponentDetailDialogProps) {
  if (!component) return null;

  const statusLabels: Record<string, string> = {
    needs_support: "Cần hỗ trợ",
    pending_support: "Chờ hỗ trợ",
    supported: "Đã được hỗ trợ",
    available: "Sẵn sàng",
    assigned: "Đã phân",
    delivered: "Đã giao",
    installed: "Đã lắp",
  };

  const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
    needs_support: "destructive",
    pending_support: "secondary",
    supported: "default",
    available: "default",
    assigned: "secondary",
    delivered: "default",
    installed: "default",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Chi tiết linh kiện</span>
            <div className="flex items-center gap-2">
              {component.component_code && (
                <Badge variant="outline" className="font-mono">
                  #{component.component_code}
                </Badge>
              )}
              <Badge variant={statusColors[component.status] || "secondary"}>
                {statusLabels[component.status] || component.status}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Component Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Thông tin linh kiện</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Loại linh kiện</p>
                <p className="font-medium">{component.component_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hãng</p>
                <p className="font-medium">{component.brand || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-medium">{component.model || "Chưa cập nhật"}</p>
              </div>
              {component.specifications && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Thông số kỹ thuật</p>
                  <p className="font-medium whitespace-pre-wrap">{component.specifications}</p>
                </div>
              )}
              {component.condition && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Tình trạng</p>
                  <p className="font-medium">{component.condition}</p>
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
                <p className="font-medium">{component.donor_name || "Không xác định"}</p>
              </div>
            </div>
          </div>

          {/* Supporter Information */}
          {component.supporter_name && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Thông tin người hỗ trợ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tên người hỗ trợ</p>
                    <p className="font-medium">{component.supporter_name}</p>
                  </div>
                  {component.supporter_phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Số điện thoại</p>
                      <a
                        href={`tel:${component.supporter_phone}`}
                        className="font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {component.supporter_phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Delivery Information */}
          {(component.delivery_address || component.delivery_phone || component.purchase_link) && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Thông tin giao hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {component.delivery_address && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Địa chỉ giao hàng</p>
                      <p className="font-medium">{component.delivery_address}</p>
                    </div>
                  )}
                  {component.delivery_phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Số điện thoại giao hàng</p>
                      <a
                        href={`tel:${component.delivery_phone}`}
                        className="font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {component.delivery_phone}
                      </a>
                    </div>
                  )}
                  {component.purchase_link && (
                    <div>
                      <p className="text-sm text-muted-foreground">Link mua hàng</p>
                      <a
                        href={component.purchase_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Xem link
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Assignment Information */}
          {component.student_name && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Thông tin phân phối</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Người nhận</p>
                    <p className="font-medium">{component.student_name}</p>
                  </div>
                  {component.assigned_date && (
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày phân phối</p>
                      <p className="font-medium">
                        {format(new Date(component.assigned_date), "dd/MM/yyyy", { locale: vi })}
                      </p>
                    </div>
                  )}
                  {component.delivered_date && (
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày giao</p>
                      <p className="font-medium">
                        {format(new Date(component.delivered_date), "dd/MM/yyyy", { locale: vi })}
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
                    {format(new Date(component.received_date), "dd/MM/yyyy", { locale: vi })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">
                    {format(new Date(component.created_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                  <p className="font-medium">
                    {format(new Date(component.updated_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </p>
                </div>
              </div>
              {component.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Ghi chú</p>
                  <p className="font-medium whitespace-pre-wrap">{component.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {onEdit && (
          <DialogFooter>
            <Button onClick={() => onEdit(component)} disabled={isLoading}>
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

