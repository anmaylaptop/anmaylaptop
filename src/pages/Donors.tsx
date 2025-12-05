import { useState } from "react";
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
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Plus, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Donor {
  id: string;
  name: string;
  phone: string;
  facebook: string;
  supportType: string;
  frequency: string;
  totalSupported: number;
  lastSupport?: string;
  status: "approved" | "pending";
}

const mockDonors: Donor[] = [
  { id: "1", name: "Nguyễn Văn A", phone: "0901234567", facebook: "fb.com/nguyenvana", supportType: "Laptop, Linh kiện", frequency: "Định kỳ", totalSupported: 5, lastSupport: "2024-01-10", status: "approved" },
  { id: "2", name: "Trần Thị B", phone: "0912345678", facebook: "fb.com/tranthib", supportType: "Học phí", frequency: "Một lần", totalSupported: 2, lastSupport: "2024-01-05", status: "approved" },
  { id: "3", name: "Lê Văn C", phone: "0923456789", facebook: "fb.com/levanc", supportType: "Xe máy", frequency: "Định kỳ", totalSupported: 3, lastSupport: "2024-01-12", status: "approved" },
  { id: "4", name: "Phạm Thị D", phone: "0934567890", facebook: "fb.com/phamthid", supportType: "Laptop", frequency: "Một lần", totalSupported: 1, lastSupport: "2024-01-08", status: "approved" },
];

export default function Donors() {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "Tổng nhà hảo tâm", value: mockDonors.length },
    { label: "Đang hoạt động", value: mockDonors.filter(d => d.status === "approved").length },
    { label: "Tổng lượt hỗ trợ", value: mockDonors.reduce((acc, d) => acc + d.totalSupported, 0) },
  ];

  return (
    <MainLayout title="Nhà hảo tâm" description="Quản lý thông tin nhà hảo tâm">
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <Heart className="h-4 w-4 text-primary" />
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
              placeholder="Tìm kiếm nhà hảo tâm..."
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
          <Plus className="mr-2 h-4 w-4" /> Thêm nhà hảo tâm
        </Button>
      </div>

      {/* Table */}
      <div className="table-container animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Loại hỗ trợ</TableHead>
              <TableHead>Tần suất</TableHead>
              <TableHead>Đã hỗ trợ</TableHead>
              <TableHead>Lần cuối</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDonors.map((donor) => (
              <TableRow key={donor.id}>
                <TableCell className="font-medium">{donor.name}</TableCell>
                <TableCell>{donor.phone}</TableCell>
                <TableCell>{donor.supportType}</TableCell>
                <TableCell>
                  <StatusBadge status={donor.frequency === "Định kỳ" ? "approved" : "processing"}>
                    {donor.frequency}
                  </StatusBadge>
                </TableCell>
                <TableCell>{donor.totalSupported} lần</TableCell>
                <TableCell>{donor.lastSupport || "-"}</TableCell>
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
