import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  useInfiniteNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead,
  type NotificationType 
} from "@/hooks/useNotifications";
import { 
  Bell, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Notifications() {
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteNotifications(20);

  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const notifications = data?.pages.flatMap((page) => page) || [];

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
    }
  };

  const getStyle = (type: NotificationType) => {
    switch (type) {
      case 'info': return "bg-blue-100/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case 'success': return "bg-green-100/50 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case 'warning': return "bg-yellow-100/50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
      case 'error': return "bg-red-100/50 text-red-600 dark:bg-red-900/20 dark:text-red-400";
    }
  };

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <MainLayout title="Thông báo" description="Xem tất cả thông báo hệ thống">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Thông báo</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} thông báo chưa đọc
                </p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              {markAllAsReadMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Không thể tải thông báo. Vui lòng thử lại sau.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-lg font-medium">Không có thông báo</p>
            <p className="text-muted-foreground">Chưa có thông báo nào trong hệ thống</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "relative flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 hover:bg-muted/40 cursor-pointer group",
                  !notification.read ? "bg-muted/10 border-primary/20" : "bg-card border-border"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm",
                  getStyle(notification.type)
                )}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn(
                      "text-sm leading-tight",
                      !notification.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
                    )}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground/60">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="py-4">
              {isFetchingNextPage && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Đang tải thêm...</span>
                </div>
              )}
            </div>

            {/* End of List */}
            {!hasNextPage && notifications.length > 0 && (
              <div className="py-4 text-center text-sm text-muted-foreground">
                Đã hiển thị tất cả thông báo
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

