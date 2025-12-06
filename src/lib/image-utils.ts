/**
 * Image processing utilities for resizing and converting images
 * Optimized for cost-saving: resize to 720p and convert to WebP
 */

interface ResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

/**
 * Resize and convert image to WebP format
 * Target: 720p (1280x720) and max 768KB
 */
export async function resizeAndConvertToWebP(
  file: File,
  options: ResizeOptions = {}
): Promise<File> {
  const {
    maxWidth = 1280,
    maxHeight = 720,
    quality = 0.85,
    maxSizeKB = 768,
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    img.onload = () => {
      try {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and resize image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP with quality optimization
        // Try to achieve target size by adjusting quality
        let currentQuality = quality;
        let attempts = 0;
        const maxAttempts = 15;
        let lastBlob: Blob | null = null;

        const tryConvert = (): void => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to convert image to blob"));
                return;
              }

              const sizeKB = blob.size / 1024;
              lastBlob = blob;

              // If size is acceptable, create file
              if (sizeKB <= maxSizeKB) {
                const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                const webpFile = new File([blob], fileName, {
                  type: "image/webp",
                  lastModified: Date.now(),
                });
                resolve(webpFile);
              } else if (attempts < maxAttempts && currentQuality > 0.1) {
                // Reduce quality and try again
                currentQuality = Math.max(0.1, currentQuality - 0.05);
                attempts++;
                tryConvert();
              } else {
                // If still too large after max attempts, try reducing dimensions
                if (attempts < maxAttempts + 5 && (width > 640 || height > 360)) {
                  // Reduce dimensions by 10% and try again
                  width = Math.round(width * 0.9);
                  height = Math.round(height * 0.9);
                  canvas.width = width;
                  canvas.height = height;
                  ctx.drawImage(img, 0, 0, width, height);
                  currentQuality = 0.85; // Reset quality
                  attempts++;
                  tryConvert();
                } else {
                  // Use the last blob even if slightly over limit (better than failing)
                  if (lastBlob) {
                    const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                    const webpFile = new File([lastBlob], fileName, {
                      type: "image/webp",
                      lastModified: Date.now(),
                    });
                    resolve(webpFile);
                  } else {
                    reject(new Error("Failed to compress image to target size"));
                  }
                }
              }
            },
            "image/webp",
            currentQuality
          );
        };

        tryConvert();
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Load image from file
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Get image dimensions
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}
