import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { NeedsOverview } from "@/components/dashboard/NeedsOverview";
import { Heart, GraduationCap, Laptop, Bike, FileText, Wrench } from "lucide-react";

const stats = [
  {
    title: "Nhà hảo tâm",
    value: 156,
    subtitle: "42 đang hoạt động",
    icon: Heart,
    trend: { value: 12, isPositive: true },
    variant: "primary" as const,
  },
  {
    title: "Sinh viên",
    value: 234,
    subtitle: "89 đã nhận hỗ trợ",
    icon: GraduationCap,
    trend: { value: 8, isPositive: true },
    variant: "secondary" as const,
  },
  {
    title: "Laptop",
    value: 78,
    subtitle: "23 sẵn sàng tặng",
    icon: Laptop,
    trend: { value: 15, isPositive: true },
    variant: "success" as const,
  },
  {
    title: "Xe máy",
    value: 15,
    subtitle: "5 sẵn sàng tặng",
    icon: Bike,
    trend: { value: 5, isPositive: true },
    variant: "warning" as const,
  },
];

const quickStats = [
  { title: "Đơn đăng ký mới", value: 12, icon: FileText },
  { title: "Linh kiện cần hỗ trợ", value: 8, icon: Wrench },
];

export default function Index() {
  return (
    <MainLayout title="Tổng quan" description="Chào mừng đến với hệ thống quản lý Ăn mày laptop">
      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.title} style={{ animationDelay: `${index * 100}ms` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <div
            key={stat.title}
            className="flex items-center gap-4 rounded-xl border bg-card p-4 animate-slide-up"
            style={{ animationDelay: `${(index + 4) * 100}ms` }}
          >
            <div className="rounded-lg bg-accent p-2">
              <stat.icon className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <NeedsOverview />
      </div>
    </MainLayout>
  );
}
