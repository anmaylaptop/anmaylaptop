import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Search, Filter, MoreHorizontal, Eye, Check, X, Plus } from "lucide-react";

interface Application {
  id: string;
  name: string;
  phone: string;
  facebook: string;
  type: "donor" | "student";
  status: "pending" | "approved" | "rejected";
  supportType?: string;
  needType?: string;
  createdAt: string;
}

const mockDonorApplications: Application[] = [
  { id: "1", name: "Nguyễn Văn A", phone: "0901234567", facebook: "fb.com/nguyenvana", type: "donor", status: "pending", supportType: "Laptop, Linh kiện", createdAt: "2024-01-15" },
  { id: "2", name: "Trần Thị B", phone: "0912345678", facebook: "fb.com/tranthib", type: "donor", status: "approved", supportType: "Học phí", createdAt: "2024-01-14" },
  { id: "3", name: "Lê Văn C", phone: "0923456789", facebook: "fb.com/levanc", type: "donor", status: "rejected", supportType: "Xe máy", createdAt: "2024-01-13" },
];

const mockStudentApplications: Application[] = [
  { id: "4", name: "Phạm Thị D", phone: "0934567890", facebook: "fb.com/phamthid", type: "student", status: "pending", needType: "Laptop", createdAt: "2024-01-15" },
  { id: "5", name: "Hoàng Văn E", phone: "0945678901", facebook: "fb.com/hoangvane", type: "student", status: "approved", needType: "Xe máy, Học phí", createdAt: "2024-01-14" },
  { id: "6", name: "Vũ Thị F", phone: "0956789012", facebook: "fb.com/vuthif", type: "student", status: "pending", needType: "Linh kiện", createdAt: "2024-01-13" },
];

const statusMap = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

function ApplicationTable({ applications, type }: { applications: Application[]; type: "donor" | "student" }) {
  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Họ và tên</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>{type === "donor" ? "Loại hỗ trợ" : "Nhu cầu"}</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày đăng ký</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id} className="animate-fade-in">
              <TableCell className="font-medium">{app.name}</TableCell>
              <TableCell>{app.phone}</TableCell>
              <TableCell>{type === "donor" ? app.supportType : app.needType}</TableCell>
              <TableCell>
                <StatusBadge status={app.status}>{statusMap[app.status]}</StatusBadge>
              </TableCell>
              <TableCell>{app.createdAt}</TableCell>
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
                    {app.status === "pending" && (
                      <>
                        <DropdownMenuItem className="text-success">
                          <Check className="mr-2 h-4 w-4" /> Duyệt đơn
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <X className="mr-2 h-4 w-4" /> Từ chối
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Applications() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <MainLayout title="Đơn đăng ký" description="Quản lý đơn đăng ký từ nhà hảo tâm và sinh viên">
      <Tabs defaultValue="donors" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="donors">Nhà hảo tâm</TabsTrigger>
            <TabsTrigger value="students">Sinh viên</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Thêm mới
            </Button>
          </div>
        </div>

        <TabsContent value="donors" className="animate-fade-in">
          <ApplicationTable applications={mockDonorApplications} type="donor" />
        </TabsContent>

        <TabsContent value="students" className="animate-fade-in">
          <ApplicationTable applications={mockStudentApplications} type="student" />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
