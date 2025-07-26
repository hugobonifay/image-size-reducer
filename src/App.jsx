import { useState } from "react";
import { compressImage, formatBytes, texts } from "./utils";
import "./App.css";

function App() {
  const t = texts["en"];
  const [expectedSize, setExpectedSize] = useState(40);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeExpectedSize = (e) => {
    const regex = /^[0-9]*$/;
    const newValue = e.target.value;

    if (regex.test(newValue) || newValue === "") {
      setExpectedSize(newValue);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setOriginalSize(file.size);
    setFileName(file.name);
    setOriginalUrl(URL.createObjectURL(file));

    try {
      const compressedBlob = await compressImage(
        file,
        (expectedSize || 500) * 1024
      );
      setCompressedSize(compressedBlob.size);
      const url = URL.createObjectURL(compressedBlob);
      setCompressedUrl(url);
    } catch (error) {
      alert(t.errorMessage);
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="app">
      <h1>{t.title}</h1>

      <div className="input-size">
        <label htmlFor="expectedSize" className="input-label">
          {t.sizeFieldLabel}
        </label>
        <input
          type="text"
          inputMode="numeric"
          onChange={handleChangeExpectedSize}
          value={expectedSize || ""}
          id="expectedSize"
          maxLength={5}
        />
      </div>

      <div className="input-file">
        <p className="input-label">{t.imageFieldLabel}</p>
        <label>
          <div>{fileName || t.noImageMessage}</div>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleUpload}
            accept="image/*"
          />
        </label>
      </div>

      {isLoading && <p>{t.loadingMessage}</p>}

      {originalUrl && compressedUrl && (
        <div className="images-container">
          <div>
            <h3>{t.originalTitle}</h3>
            <p>{formatBytes(originalSize)}</p>
            <img src={originalUrl} alt={t.originalTitle} />
          </div>

          <div>
            <h3>{t.compressedTitle}</h3>
            <p>{formatBytes(compressedSize)}</p>
            <img src={compressedUrl} alt={t.compressedTitle} />
            <br />
            <a href={compressedUrl} download="compressed.jpg">
              {t.downloadButtonLabel}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
