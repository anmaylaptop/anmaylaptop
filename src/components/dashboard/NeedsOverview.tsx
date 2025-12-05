import { Laptop, Bike, GraduationCap, Wrench } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface NeedItem {
  type: string;
  icon: React.ElementType;
  needed: number;
  fulfilled: number;
  color: string;
}

const needs: NeedItem[] = [
  { type: "Laptop", icon: Laptop, needed: 45, fulfilled: 28, color: "bg-primary" },
  { type: "Xe máy", icon: Bike, needed: 12, fulfilled: 5, color: "bg-secondary" },
  { type: "Học phí", icon: GraduationCap, needed: 20, fulfilled: 8, color: "bg-success" },
  { type: "Linh kiện", icon: Wrench, needed: 35, fulfilled: 22, color: "bg-warning" },
];

export function NeedsOverview() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Tổng quan nhu cầu</h3>
      <div className="space-y-5">
        {needs.map((need, index) => {
          const percentage = Math.round((need.fulfilled / need.needed) * 100);
          return (
            <div
              key={need.type}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <need.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{need.type}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {need.fulfilled}/{need.needed} ({percentage}%)
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
