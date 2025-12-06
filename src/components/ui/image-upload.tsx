import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { resizeAndConvertToWebP } from "@/lib/image-utils";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  bucket?: string;
  folder?: string;
  maxSizeMB?: number;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  bucket = "laptop-images",
  folder = "laptops",
  maxSizeMB = 0.75, // 768KB = 0.75MB
  className,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    // Initial file size check (before processing)
    const initialSizeMB = file.size / (1024 * 1024);
    if (initialSizeMB > 10) {
      toast.error("File ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 10MB");
      return;
    }

    setUploading(true);
    try {
      // Resize and convert to WebP (720p, max 768KB)
      toast.info("Đang xử lý ảnh...", { duration: 2000 });
      const processedFile = await resizeAndConvertToWebP(file, {
        maxWidth: 1280,
        maxHeight: 720,
        quality: 0.85,
        maxSizeKB: 768,
      });

      // Show preview of processed image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(processedFile);

      // Upload processed image
      await uploadImage(processedFile);
    } catch (error: any) {
      console.error("Error processing image:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xử lý ảnh");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      // Generate unique filename (always .webp since we convert to WebP)
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

      if (data?.publicUrl) {
        onChange(data.publicUrl);
        const finalSizeKB = (file.size / 1024).toFixed(1);
        toast.success(`Upload ảnh thành công (${finalSizeKB}KB)`);
      } else {
        throw new Error("Không thể lấy URL công khai của ảnh");
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Có lỗi xảy ra khi upload ảnh");
      setPreview(null);
      throw error; // Re-throw to be caught by handleFileSelect
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg border-2 border-border"
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="h-32 w-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/50">
            <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}

        <div className="flex-1">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || uploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={disabled || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {preview ? "Thay đổi ảnh" : "Chọn ảnh"}
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG (tự động resize 720p, WebP, tối đa 768KB)
          </p>
        </div>
      </div>
    </div>
  );
}
