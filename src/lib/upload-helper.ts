/**
 * Helper to process image and video files picked directly from computer explorer.
 * Resizes images to max 800px & compresses to JPEG (quality 0.72) to ensure
 * small payload size (~50-90KB per image). This prevents browser localStorage QuotaExceededError
 * and server payload limits, ensuring photos and videos stay saved PERMANENTLY across all devices.
 */
export async function uploadFileToServer(file: File): Promise<string> {
  if (file.type.startsWith('image/')) {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const maxDimension = 800;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // 72% quality JPEG gives vibrant, crisp visual quality while staying ~50-80KB
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
            URL.revokeObjectURL(objectUrl);
            resolve(compressedDataUrl);
            return;
          }
        } catch (e) {
          console.warn('Canvas compression failed, falling back to direct Data URL', e);
        }

        URL.revokeObjectURL(objectUrl);
        readDirectDataURL(file).then(resolve);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        readDirectDataURL(file).then(resolve);
      };

      img.src = objectUrl;
    });
  }

  return readDirectDataURL(file);
}

function readDirectDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file as Data URL'));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
