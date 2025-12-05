import { cn } from "@/lib/utils";

export type StatusType = 
  | "pending" 
  | "approved" 
  | "rejected" 
  | "processing" 
  | "completed" 
  | "ready"
  | "received"
  | "repairing"
  | "donated";

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  pending: "badge-status badge-pending",
  approved: "badge-status badge-approved",
  rejected: "badge-status badge-rejected",
  processing: "badge-status badge-processing",
  completed: "badge-status badge-approved",
  ready: "badge-status bg-secondary/15 text-secondary",
  received: "badge-status bg-info/15 text-info",
  repairing: "badge-status badge-pending",
  donated: "badge-status badge-approved",
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusStyles[status], className)}>
      {children}
    </span>
  );
}
