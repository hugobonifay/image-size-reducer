import { useState } from "react";
import { compressImage, formatBytes, texts } from "./utils";
import "./App.css";

function App() {
  const t = texts["en"];
  const [uploadedFile, setUploadedFile] = useState(null);
  const [expectedSize, setExpectedSize] = useState("150");
  const [originalUrl, setOriginalUrl] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeExpectedSize = (e) => {
    const regex = /^[0-9]*$/;
    const newValue = e.target.value;

    if (regex.test(newValue) || newValue === "") {
      setExpectedSize(newValue);
    }
  };

  const compressAndSetImage = async (file) => {
    setIsLoading(true);

    try {
      const sizeInBytes =
        Number(expectedSize) > 0 ? Number(expectedSize) * 1024 : 500 * 1024;

      const compressedBlob = await compressImage(file, sizeInBytes);
      setCompressedSize(compressedBlob.size);
      const url = URL.createObjectURL(compressedBlob);
      setCompressedUrl(url);
    } catch (error) {
      alert(t.errorMessage);
      console.error(error);
    }

    setIsLoading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setOriginalSize(file.size);
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    await compressAndSetImage(file);
  };

  const handleRetry = async () => {
    await compressAndSetImage(uploadedFile);
  };

  return (
    <div className="app">
      <h1>{t.title}</h1>

      <div className="description">
        <h3>{t.description[0]}</h3>

        <p>
          {t.description[1]} <b>{t.description[2]}</b>
        </p>

        <p>
          <b>{t.description[3]}</b> {t.description[4]}
        </p>

        <p>
          <b>{t.description[5]}</b> {t.description[6]}
        </p>

        <p>{t.description[7]}</p>
      </div>

      <div className="input-size">
        <label htmlFor="expectedSize" className="input-label">
          {t.sizeFieldLabel}
        </label>
        <input
          className="input"
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
          <div className="input">{fileName || t.noImageMessage}</div>
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
        <>
          <div className="images-container">
            <div>
              <h3>{t.originalTitle}</h3>
              <p>{formatBytes(originalSize)}</p>
              <img
                src={originalUrl}
                alt={t.originalTitle}
                onClick={() => setPreview(originalUrl)}
              />
            </div>

            <div>
              <h3>{t.compressedTitle}</h3>
              <p>{formatBytes(compressedSize)}</p>
              <img
                src={compressedUrl}
                alt={t.compressedTitle}
                onClick={() => setPreview(compressedUrl)}
              />
              <button type="button" onClick={handleRetry}>
                {t.retryButtonLabel}
              </button>
              <a href={compressedUrl} download="compressed.jpg">
                {t.downloadButtonLabel}
              </a>
            </div>
          </div>

          {preview && (
            <div className="preview">
              <button type="button" onClick={() => setPreview(null)}>
                {t.closeButtonLabel}
              </button>
              <img src={preview} alt={t.previewTitle} key={preview} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
