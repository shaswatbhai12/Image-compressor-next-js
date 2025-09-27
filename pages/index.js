import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [file, setFile] = useState(null);
  const [reduction, setReduction] = useState(30);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleCompress = async (e) => {
    e.preventDefault();
    if (!file) return alert('Select a file first');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('reduction', reduction);

    try {
      const res = await fetch('/api/compress', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) setResult(data);
      else alert(data.error);
    } catch (err) {
      alert('Compression failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.preview;
    link.download = result.filename.replace(/\..+$/, '_compressed.jpg');
    link.click();
  };

  return (
    <>
      <Head>
        <title>Image Compressor</title>
        <link rel="stylesheet" href="/css/style.css" />
      </Head>

      <div className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <i className="fas fa-compress-alt"></i> ImageCompress
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <h1>Compress Your Images</h1>
          <p>Reduce image file size while maintaining quality</p>

          <form onSubmit={handleCompress} className="upload-form">
            <div className="file-upload-area">
              <input type="file" id="file" onChange={handleFileChange} accept="image/*" />
              <label htmlFor="file">{file ? file.name : 'Choose File'}</label>
            </div>

            <div className="slider-container">
              <label>Size Reduction: {reduction}%</label>
              <input
                type="range"
                min="10"
                max="70"
                value={reduction}
                onChange={(e) => setReduction(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Compressing...' : 'Compress Image'}
            </button>
          </form>

          {result && (
            <div className="result-card">
              <h2>Compression Complete!</h2>
              <p>Original Size: {result.originalSizeKB} KB</p>
              <p>Compressed Size: {result.compressedSizeKB} KB</p>
              <p>Reduction: {result.actualReduction}%</p>
              <img src={result.preview} alt="Preview" className="preview-image" />
              <button onClick={handleDownload}>Download Compressed</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
