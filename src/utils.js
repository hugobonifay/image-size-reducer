export function compressImage(file, maxSizeInBytes = 500 * 1024) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        let quality = 0.99;
        const minQuality = 0.5;
        const qualityStep = 0.01;
        let width = img.width;
        let height = img.height;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const compress = () => {
          canvas.width = width;
          canvas.height = height;
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const format = "image/jpeg";

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Compression failed"));
                return;
              }

              if (blob.size > maxSizeInBytes) {
                if (quality > minQuality) {
                  quality -= qualityStep;
                  compress();
                } else {
                  // Dernier recours : réduction de dimensions
                  const ratio = Math.sqrt(maxSizeInBytes / blob.size);
                  width = Math.floor(width * ratio);
                  height = Math.floor(height * ratio);
                  quality = 0.85; // on repart avec une qualité moyenne
                  compress();
                }
              } else {
                resolve(blob);
              }
            },
            format,
            quality
          );
        };

        compress();
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
  });
}

export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const texts = {
  en: {
    title: "Image size reducer",
    description: {
      0: "How it works",
      1: "This tool lets you reduce the size of your images instantly, everything happens in your browser.",
      2: "Your image is never uploaded or stored on any server.",
      3: "You can optionally specify a maximum desired size (in KiB).",
      4: "If left blank, the app will use a default target of 500 KiB.",
      5: "Then, simply import an image (JPG or PNG),",
      6: "and it will be automatically compressed to stay under the desired limit while preserving as much quality as possible.",
      7: "Once compressed, you can preview the result side by side with the original and download the optimized version.",
    },
    sizeFieldLabel: "Desired max size (KiB)",
    imageFieldLabel: "Choose an image",
    noImageMessage: "No image",
    loadingMessage: "Compressing...",
    originalTitle: "Original",
    compressedTitle: "Compressed",
    downloadButtonLabel: "Download",
    errorMessage: "An error occurred! Please try again.",
    retryButtonLabel: "Retry",
    closeButtonLabel: "Close",
    previewTitle: "Preview",
  },
};
