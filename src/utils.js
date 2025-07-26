export function compressImage(file, maxSizeInBytes = 500 * 1024) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.onload = function () {
        let quality = 0.7;
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let width = img.width;
        let height = img.height;
        let attempt = 0;
        const maxAttempts = 10;

        const compress = () => {
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob.size > maxSizeInBytes && attempt < maxAttempts) {
                attempt++;
                if (quality > 0.1) {
                  quality -= 0.1;
                } else {
                  const ratio = Math.sqrt(maxSizeInBytes / blob.size);
                  width = Math.floor(width * ratio);
                  height = Math.floor(height * ratio);
                }
                compress();
              } else {
                resolve(blob);
              }
            },
            "image/jpeg", // forcé pour stabilité
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
    description: "Quickly compress your images",
    sizeFieldLabel: "Desired max size (KiB)",
    imageFieldLabel: "Image",
    noImageMessage: "None",
    loadingMessage: "Compressing...",
    originalTitle: "Original",
    compressedTitle: "Compressed",
    downloadButtonLabel: "Download",
    errorMessage: "An error occurred! Please try again.",
  },
};
