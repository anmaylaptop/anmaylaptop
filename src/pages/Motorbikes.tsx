import { useState } from "react";
import { CreateMotorbikeForm } from "@/components/forms/CreateMotorbikeForm";
import { EditMotorbikeForm } from "@/components/forms/EditMotorbikeForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataPagination } from "@/components/ui/data-pagination";
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Plus, Bike, AlertCircle, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMotorbikes, useMotorbike, useDeleteMotorbike, type MotorbikeData } from "@/hooks/useInventory";
import { usePagination } from "@/hooks/usePagination";
import { MotorbikeDetailDialog } from "@/components/motorbikes/MotorbikeDetailDialog";
import { DeleteMotorbikeDialog } from "@/components/motorbikes/DeleteMotorbikeDialog";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const statusLabels: Record<string, string> = {
  available: "Sẵn sàng",
  assigned: "Đã phân",
  delivered: "Đã giao",
  needs_repair: "Cần sửa",
};

const statusColors: Record<string, "approved" | "pending" | "rejected"> = {
  available: "approved",
  assigned: "pending",
  delivered: "approved",
  needs_repair: "rejected",
};

// Motorbike image thumbnail component
function MotorbikeImageThumbnail({ imageUrl, brand, model }: { imageUrl: string | null; brand: string | null; model: string | null }) {
  const [imageError, setImageError] = useState(false);

  if (!imageUrl || imageError) {
    return <Bike className="h-8 w-8 text-muted-foreground" />;
  }

  return (
    <img
      src={imageUrl}
      alt={`${brand} ${model}`}
      className="h-12 w-12 object-cover rounded border"
      onError={() => setImageError(true)}
    />
  );
}

export default function Motorbikes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMotorbikeId, setSelectedMotorbikeId] = useState<string | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [motorbikeToDelete, setMotorbikeToDelete] = useState<{ id: string; model: string | null; brand: string | null; license_plate: string | null } | null>(null);

  const deleteMotorbikeMutation = useDeleteMotorbike();
  const { data: selectedMotorbike } = useMotorbike(detailDialogOpen ? selectedMotorbikeId : null);

  const pagination = usePagination({ initialPageSize: 10 });

  const {
    data: motorbikesResult,
    isLoading,
    error,
  } = useMotorbikes({
    search: searchTerm,
    status: statusFilter,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });

  const motorbikes = motorbikesResult?.data || [];
  const totalCount = motorbikesResult?.totalCount || 0;
  const totalPages = motorbikesResult?.totalPages || 0;

  const stats = [
    { label: "Tổng xe máy", value: totalCount },
    { label: "Cần sửa", value: motorbikes.filter(m => m.status === "needs_repair").length },
    { label: "Sẵn sàng", value: motorbikes.filter(m => m.status === "available").length },
    { label: "Đã giao", value: motorbikes.filter(m => m.status === "delivered").length },
  ];

  return (
    <MainLayout title="Quản lý Xe máy" description="Theo dõi và quản lý xe máy đã nhận">
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <Bike className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm xe máy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="available">Sẵn sàng</SelectItem>
              <SelectItem value="assigned">Đã phân</SelectItem>
              <SelectItem value="delivered">Đã giao</SelectItem>
              <SelectItem value="needs_repair">Cần sửa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm xe máy
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Không thể tải dữ liệu xe máy. Vui lòng thử lại sau.
          </AlertDescription>
        </Alert>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : motorbikes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Không có xe máy nào</p>
          <p className="text-muted-foreground">Chưa có xe máy nào trong kho hoặc phù hợp với bộ lọc hiện tại</p>
        </div>
      ) : (
        <div className="table-container animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Ảnh</TableHead>
                <TableHead>Hãng</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Biển số</TableHead>
                <TableHead>Năm SX</TableHead>
                <TableHead>Người tặng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người nhận</TableHead>
                <TableHead>Ngày nhận</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {motorbikes.map((bike) => (
                <TableRow key={bike.id}>
                  <TableCell>
                    <MotorbikeImageThumbnail
                      imageUrl={bike.image_url}
                      brand={bike.brand}
                      model={bike.model}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{bike.brand || "Chưa cập nhật"}</TableCell>
                  <TableCell>{bike.model || "Chưa cập nhật"}</TableCell>
                  <TableCell>{bike.license_plate || "-"}</TableCell>
                  <TableCell>{bike.year || "-"}</TableCell>
                  <TableCell>{bike.donor_name || "Không xác định"}</TableCell>
                  <TableCell>
                    <StatusBadge status={statusColors[bike.status] || "pending"}>
                      {statusLabels[bike.status] || bike.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{bike.student_name || "-"}</TableCell>
                  <TableCell>
                    {format(new Date(bike.received_date), "dd/MM/yyyy", { locale: vi })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedMotorbikeId(bike.id);
                          setDetailDialogOpen(true);
                        }}>
                          <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedMotorbikeId(bike.id);
                          setEditDialogOpen(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setMotorbikeToDelete({
                              id: bike.id,
                              model: bike.model,
                              brand: bike.brand,
                              license_plate: bike.license_plate,
                            });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && motorbikes.length > 0 && (
        <div className="mt-6">
          <DataPagination
            currentPage={pagination.page}
            totalPages={totalPages}
            pageSize={pagination.pageSize}
            totalItems={totalCount}
            onPageChange={pagination.setPage}
            onPageSizeChange={pagination.setPageSize}
          />
        </div>
      )}

      <CreateMotorbikeForm
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <EditMotorbikeForm
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setSelectedMotorbikeId(null);
          }
        }}
        motorbikeId={selectedMotorbikeId}
      />

      {/* Motorbike Detail Dialog */}
      <MotorbikeDetailDialog
        open={detailDialogOpen}
        onOpenChange={(open) => {
          setDetailDialogOpen(open);
          if (!open) {
            setSelectedMotorbikeId(null);
          }
        }}
        motorbike={selectedMotorbike || null}
        onEdit={(motorbike) => {
          setDetailDialogOpen(false);
          setSelectedMotorbikeId(motorbike.id);
          setEditDialogOpen(true);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteMotorbikeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          if (motorbikeToDelete) {
            deleteMotorbikeMutation.mutate(
              { id: motorbikeToDelete.id },
              {
                onSuccess: () => {
                  setDeleteDialogOpen(false);
                  setMotorbikeToDelete(null);
                },
              }
            );
          }
        }}
        isLoading={deleteMotorbikeMutation.isPending}
        motorbikeInfo={{
          model: motorbikeToDelete?.model || null,
          brand: motorbikeToDelete?.brand || null,
          license_plate: motorbikeToDelete?.license_plate || null,
        }}
      />
    </MainLayout>
  );
}
