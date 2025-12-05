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
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Plus, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Student {
  id: string;
  name: string;
  phone: string;
  facebook: string;
  year: number;
  needs: string;
  receivedSupport: boolean;
  lastReceived?: string;
}

const mockStudents: Student[] = [
  { id: "1", name: "Nguyễn Thị Hoa", phone: "0901234567", facebook: "fb.com/nguyenthihoa", year: 2, needs: "Laptop", receivedSupport: false },
  { id: "2", name: "Trần Văn Bình", phone: "0912345678", facebook: "fb.com/tranvanbinh", year: 3, needs: "Xe máy, Học phí", receivedSupport: true, lastReceived: "2024-01-10" },
  { id: "3", name: "Lê Thị Mai", phone: "0923456789", facebook: "fb.com/lethimai", year: 1, needs: "Laptop", receivedSupport: true, lastReceived: "2024-01-05" },
  { id: "4", name: "Phạm Văn Đức", phone: "0934567890", facebook: "fb.com/phamvanduc", year: 4, needs: "Linh kiện", receivedSupport: false },
  { id: "5", name: "Hoàng Thị Lan", phone: "0945678901", facebook: "fb.com/hoangthilan", year: 2, needs: "Học phí", receivedSupport: false },
];

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "Tổng sinh viên", value: mockStudents.length },
    { label: "Đã nhận hỗ trợ", value: mockStudents.filter(s => s.receivedSupport).length },
    { label: "Chưa nhận hỗ trợ", value: mockStudents.filter(s => !s.receivedSupport).length },
  ];

  return (
    <MainLayout title="Sinh viên" description="Quản lý thông tin sinh viên cần hỗ trợ">
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-secondary" />
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
              placeholder="Tìm kiếm sinh viên..."
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
          <Plus className="mr-2 h-4 w-4" /> Thêm sinh viên
        </Button>
      </div>

      {/* Table */}
      <div className="table-container animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Năm học</TableHead>
              <TableHead>Nhu cầu</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Lần nhận cuối</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>Năm {student.year}</TableCell>
                <TableCell>{student.needs}</TableCell>
                <TableCell>
                  <StatusBadge status={student.receivedSupport ? "approved" : "pending"}>
                    {student.receivedSupport ? "Đã nhận" : "Chưa nhận"}
                  </StatusBadge>
                </TableCell>
                <TableCell>{student.lastReceived || "-"}</TableCell>
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
