import { Laptop, Heart, GraduationCap, Bike, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "laptop" | "donor" | "student" | "motorbike" | "component";
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "laptop",
    title: "Laptop Dell Latitude E7450",
    description: "Đã sửa xong, sẵn sàng tặng",
    time: "2 giờ trước",
  },
  {
    id: "2",
    type: "donor",
    title: "Nguyễn Văn A",
    description: "Đăng ký mới làm nhà hảo tâm",
    time: "3 giờ trước",
  },
  {
    id: "3",
    type: "student",
    title: "Trần Thị B",
    description: "Đã nhận laptop ThinkPad X240",
    time: "5 giờ trước",
  },
  {
    id: "4",
    type: "motorbike",
    title: "Honda Wave Alpha",
    description: "Nhận từ nhà hảo tâm Lê Văn C",
    time: "1 ngày trước",
  },
  {
    id: "5",
    type: "component",
    title: "Pin laptop Dell",
    description: "Đã nhận linh kiện từ nhà hảo tâm",
    time: "1 ngày trước",
  },
];

const iconMap = {
  laptop: Laptop,
  donor: Heart,
  student: GraduationCap,
  motorbike: Bike,
  component: Wrench,
};

const colorMap = {
  laptop: "bg-primary/10 text-primary",
  donor: "bg-secondary/10 text-secondary",
  student: "bg-success/10 text-success",
  motorbike: "bg-info/10 text-info",
  component: "bg-warning/10 text-warning",
};

export function RecentActivity() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Hoạt động gần đây</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn("rounded-lg p-2", colorMap[activity.type])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
