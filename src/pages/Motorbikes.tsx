import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
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
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Plus, Bike } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Motorbike {
  id: string;
  code: string;
  type: string;
  licensePlate?: string;
  year?: number;
  donorName: string;
  status: "received" | "repairing" | "ready" | "donated";
  condition?: string;
  recipientName?: string;
}

const mockMotorbikes: Motorbike[] = [
  { id: "1", code: "XM001", type: "Honda Wave Alpha", licensePlate: "59-X1 12345", year: 2018, donorName: "Nguyễn Văn A", status: "ready", condition: "Tốt, đã bảo dưỡng" },
  { id: "2", code: "XM002", type: "Yamaha Sirius", licensePlate: "59-X2 67890", year: 2016, donorName: "Trần Thị B", status: "donated", recipientName: "Phạm Văn Đức" },
  { id: "3", code: "XM003", type: "Honda Dream", donorName: "Lê Văn C", status: "repairing", condition: "Cần thay lốp và bình ắc quy" },
  { id: "4", code: "XM004", type: "Suzuki Viva", licensePlate: "59-X3 11111", year: 2015, donorName: "Phạm Thị D", status: "received" },
];

const statusLabels: Record<string, string> = {
  received: "Đã nhận",
  repairing: "Đang sửa",
  ready: "Sẵn sàng tặng",
  donated: "Đã tặng",
};

export default function Motorbikes() {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "Tổng xe máy", value: mockMotorbikes.length },
    { label: "Đang sửa", value: mockMotorbikes.filter(m => m.status === "repairing").length },
    { label: "Sẵn sàng tặng", value: mockMotorbikes.filter(m => m.status === "ready").length },
    { label: "Đã tặng", value: mockMotorbikes.filter(m => m.status === "donated").length },
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
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm xe máy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Thêm xe máy
        </Button>
      </div>

      {/* Table */}
      <div className="table-container animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Loại xe</TableHead>
              <TableHead>Biển số</TableHead>
              <TableHead>Người tặng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Tình trạng</TableHead>
              <TableHead>Người nhận</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMotorbikes.map((bike) => (
              <TableRow key={bike.id}>
                <TableCell className="font-mono text-sm">{bike.code}</TableCell>
                <TableCell className="font-medium">{bike.type}</TableCell>
                <TableCell>{bike.licensePlate || "-"}</TableCell>
                <TableCell>{bike.donorName}</TableCell>
                <TableCell>
                  <StatusBadge status={bike.status as StatusType}>
                    {statusLabels[bike.status]}
                  </StatusBadge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{bike.condition || "-"}</TableCell>
                <TableCell>{bike.recipientName || "-"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
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
    </MainLayout>
  );
}
