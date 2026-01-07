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
import { Loader2, Trash2, Wrench } from "lucide-react";

interface DeleteComponentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  componentInfo: {
    component_code: number | null;
    component_type: string;
    model: string | null;
    brand: string | null;
  };
}

export function DeleteComponentDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  componentInfo,
}: DeleteComponentDialogProps) {
  const componentName = componentInfo.component_code
    ? `#${componentInfo.component_code} - ${componentInfo.component_type}${componentInfo.brand ? ` ${componentInfo.brand}` : ""}${componentInfo.model ? ` ${componentInfo.model}` : ""}`
    : `${componentInfo.component_type}${componentInfo.brand ? ` ${componentInfo.brand}` : ""}${componentInfo.model ? ` ${componentInfo.model}` : ""}`.trim() || "linh kiện này";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Xóa linh kiện
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa linh kiện <strong>{componentName}</strong>?
            <span className="block mt-2">
              Hành động này không thể hoàn tác. Linh kiện sẽ bị xóa vĩnh viễn khỏi hệ thống.
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

