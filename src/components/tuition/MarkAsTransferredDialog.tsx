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
import { Loader2, CheckCircle, GraduationCap } from "lucide-react";

interface MarkAsTransferredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  tuitionInfo: {
    amount: number;
    donor_name: string | null;
    student_name: string | null;
  };
}

export function MarkAsTransferredDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  tuitionInfo,
}: MarkAsTransferredDialogProps) {
  const tuitionDescription = tuitionInfo.donor_name
    ? `hỗ trợ học phí ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(tuitionInfo.amount)} từ ${tuitionInfo.donor_name}`
    : `hỗ trợ học phí ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(tuitionInfo.amount)}`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Đánh dấu đã thanh toán
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn đánh dấu {tuitionDescription} là đã thanh toán?
            <span className="block mt-2">
              Trạng thái sẽ được chuyển từ "Đã cam kết" sang "Đã thanh toán" và ngày thanh toán sẽ được cập nhật.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-success text-success-foreground hover:bg-success/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Xác nhận thanh toán
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

