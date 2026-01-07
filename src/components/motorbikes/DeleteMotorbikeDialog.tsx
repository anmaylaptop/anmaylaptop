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
import { Loader2, Trash2, Bike } from "lucide-react";

interface DeleteMotorbikeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  motorbikeInfo: {
    model: string | null;
    brand: string | null;
    license_plate: string | null;
  };
}

export function DeleteMotorbikeDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  motorbikeInfo,
}: DeleteMotorbikeDialogProps) {
  const motorbikeName = motorbikeInfo.license_plate 
    ? `${motorbikeInfo.brand || ""} ${motorbikeInfo.model || ""} (${motorbikeInfo.license_plate})`.trim()
    : `${motorbikeInfo.brand || ""} ${motorbikeInfo.model || ""}`.trim() || "xe máy này";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Xóa xe máy
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa xe máy <strong>{motorbikeName}</strong>?
            <span className="block mt-2">
              Hành động này không thể hoàn tác. Xe máy sẽ bị xóa vĩnh viễn khỏi hệ thống.
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

