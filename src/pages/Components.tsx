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
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Plus, Wrench, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComponentItem {
  id: string;
  type: string;
  model: string;
  quantity: number;
  received: number;
  price: string;
  orderLink: string;
  laptopCode?: string;
  status: "pending" | "processing" | "received" | "completed";
  donorName?: string;
}

const mockComponents: ComponentItem[] = [
  { id: "1", type: "Pin laptop", model: "Dell E7450 68Wh", quantity: 2, received: 1, price: "450,000đ", orderLink: "https://shopee.vn/...", laptopCode: "LP001, LP003", status: "processing", donorName: "Nguyễn Văn A" },
  { id: "2", type: "RAM", model: "DDR3L 8GB 1600MHz", quantity: 3, received: 3, price: "350,000đ", orderLink: "https://lazada.vn/...", laptopCode: "LP002", status: "completed" },
  { id: "3", type: "Ổ cứng SSD", model: "Kingston A400 240GB", quantity: 2, received: 0, price: "550,000đ", orderLink: "https://tiki.vn/...", laptopCode: "LP004", status: "pending" },
  { id: "4", type: "Màn hình", model: "HP EliteBook 840 G3 14inch", quantity: 1, received: 0, price: "1,200,000đ", orderLink: "https://shopee.vn/...", laptopCode: "LP003", status: "pending" },
  { id: "5", type: "Bàn phím", model: "ThinkPad X240 US", quantity: 1, received: 1, price: "280,000đ", orderLink: "https://lazada.vn/...", laptopCode: "LP005", status: "received" },
];

const statusLabels: Record<string, string> = {
  pending: "Đang cần",
  processing: "Có người hỗ trợ",
  received: "Đã nhận",
  completed: "Đã lắp đặt",
};

export default function Components() {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "Tổng linh kiện", value: mockComponents.length },
    { label: "Đang cần", value: mockComponents.filter(c => c.status === "pending").length },
    { label: "Có người hỗ trợ", value: mockComponents.filter(c => c.status === "processing").length },
    { label: "Đã hoàn thành", value: mockComponents.filter(c => c.status === "completed").length },
  ];

  return (
    <MainLayout title="Quản lý Linh kiện" description="Theo dõi linh kiện cần hỗ trợ">
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <Wrench className="h-4 w-4 text-warning" />
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
              placeholder="Tìm kiếm linh kiện..."
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
          <Plus className="mr-2 h-4 w-4" /> Thêm linh kiện
        </Button>
      </div>

      {/* Table */}
      <div className="table-container animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loại</TableHead>
              <TableHead>Mẫu mã</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Laptop</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockComponents.map((comp) => (
              <TableRow key={comp.id}>
                <TableCell className="font-medium">{comp.type}</TableCell>
                <TableCell>{comp.model}</TableCell>
                <TableCell>{comp.received}/{comp.quantity}</TableCell>
                <TableCell>{comp.price}</TableCell>
                <TableCell className="font-mono text-sm">{comp.laptopCode || "-"}</TableCell>
                <TableCell>
                  <StatusBadge status={comp.status as StatusType}>
                    {statusLabels[comp.status]}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <a
                    href={comp.orderLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Đặt hàng <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
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
