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
import { Loader2, Trash2, Laptop } from "lucide-react";

interface DeleteLaptopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  laptopInfo: {
    model: string | null;
    brand: string | null;
  };
}

export function DeleteLaptopDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  laptopInfo,
}: DeleteLaptopDialogProps) {
  const laptopName = laptopInfo.model || laptopInfo.brand || "laptop này";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Xóa laptop
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa laptop <strong>{laptopName}</strong>?
            <span className="block mt-2">
              Hành động này không thể hoàn tác. Laptop sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Xác nhận xóa
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

