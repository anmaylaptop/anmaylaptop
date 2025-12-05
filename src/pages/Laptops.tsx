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
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Plus, Laptop } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LaptopItem {
  id: string;
  code: string;
  model: string;
  brand: string;
  donorName: string;
  status: "received" | "repairing" | "ready" | "donated";
  issues?: string;
  recipientName?: string;
  donatedAt?: string;
}

const mockLaptops: LaptopItem[] = [
  { id: "1", code: "LP001", model: "Latitude E7450", brand: "Dell", donorName: "Nguyễn Văn A", status: "ready", issues: "Đã thay pin mới" },
  { id: "2", code: "LP002", model: "ThinkPad X240", brand: "Lenovo", donorName: "Trần Thị B", status: "donated", recipientName: "Lê Thị Mai", donatedAt: "2024-01-10" },
  { id: "3", code: "LP003", model: "EliteBook 840 G3", brand: "HP", donorName: "Lê Văn C", status: "repairing", issues: "Hỏng màn hình, cần thay" },
  { id: "4", code: "LP004", model: "Inspiron 5558", brand: "Dell", donorName: "Phạm Thị D", status: "received", issues: "Chưa kiểm tra" },
  { id: "5", code: "LP005", model: "MacBook Air 2015", brand: "Apple", donorName: "Hoàng Văn E", status: "ready" },
];

const statusLabels: Record<string, string> = {
  received: "Đã nhận",
  repairing: "Đang sửa",
  ready: "Sẵn sàng tặng",
  donated: "Đã tặng",
};

export default function Laptops() {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "Tổng laptop", value: mockLaptops.length, color: "text-foreground" },
    { label: "Đang sửa", value: mockLaptops.filter(l => l.status === "repairing").length, color: "text-warning" },
    { label: "Sẵn sàng tặng", value: mockLaptops.filter(l => l.status === "ready").length, color: "text-success" },
    { label: "Đã tặng", value: mockLaptops.filter(l => l.status === "donated").length, color: "text-secondary" },
  ];

  return (
    <MainLayout title="Quản lý Laptop" description="Theo dõi và quản lý laptop đã nhận">
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <Laptop className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
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
              placeholder="Tìm kiếm laptop..."
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
          <Plus className="mr-2 h-4 w-4" /> Thêm laptop
        </Button>
      </div>

      {/* Table */}
      <div className="table-container animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Hãng</TableHead>
              <TableHead>Người tặng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Vấn đề/Ghi chú</TableHead>
              <TableHead>Người nhận</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLaptops.map((laptop) => (
              <TableRow key={laptop.id}>
                <TableCell className="font-mono text-sm">{laptop.code}</TableCell>
                <TableCell className="font-medium">{laptop.model}</TableCell>
                <TableCell>{laptop.brand}</TableCell>
                <TableCell>{laptop.donorName}</TableCell>
                <TableCell>
                  <StatusBadge status={laptop.status as StatusType}>
                    {statusLabels[laptop.status]}
                  </StatusBadge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{laptop.issues || "-"}</TableCell>
                <TableCell>{laptop.recipientName || "-"}</TableCell>
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
