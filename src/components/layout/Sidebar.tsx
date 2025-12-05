import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Laptop,
  Bike,
  Wrench,
  FileText,
  BarChart3,
  Heart,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Tổng quan", href: "/", icon: LayoutDashboard },
  { name: "Đơn đăng ký", href: "/don-dang-ky", icon: FileText },
  { name: "Nhà hảo tâm", href: "/nha-hao-tam", icon: Heart },
  { name: "Sinh viên", href: "/sinh-vien", icon: GraduationCap },
  { name: "Laptop", href: "/laptop", icon: Laptop },
  { name: "Xe máy", href: "/xe-may", icon: Bike },
  { name: "Linh kiện", href: "/linh-kien", icon: Wrench },
  { name: "Báo cáo", href: "/bao-cao", icon: BarChart3 },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Laptop className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Ăn mày laptop</h1>
            <p className="text-xs text-sidebar-foreground/60">Hệ thống quản lý</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn("nav-item", isActive && "active")}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <Link to="/cai-dat" className="nav-item">
            <Settings className="h-5 w-5" />
            <span>Cài đặt</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
