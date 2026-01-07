import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Power } from "lucide-react";

interface DeactivateDonorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  donorName: string;
}

export function DeactivateDonorDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  donorName,
}: DeactivateDonorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Power className="h-5 w-5 text-warning" />
            Vô hiệu hóa nhà hảo tâm
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn vô hiệu hóa nhà hảo tâm <strong>{donorName}</strong>?
            <span className="block mt-2">
              Nhà hảo tâm này sẽ không còn được hiển thị trong danh sách các nhà hảo tâm đang hoạt động và 
              sẽ không thể được gán cho các sinh viên cần hỗ trợ. Bạn có thể kích hoạt lại bất cứ lúc nào.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-warning text-warning-foreground hover:bg-warning/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Power className="mr-2 h-4 w-4" />
                Xác nhận vô hiệu hóa
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

