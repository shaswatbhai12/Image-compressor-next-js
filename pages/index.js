import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [reduction, setReduction] = useState(30);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleCompress = async () => {
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
    <div style={{ maxWidth: 600, margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>Image Compressor</h1>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <div style={{ marginTop: 10 }}>
        <label>Size Reduction: {reduction}%</label>
        <input
          type="range"
          min="10"
          max="70"
          value={reduction}
          onChange={(e) => setReduction(e.target.value)}
        />
      </div>
      <button onClick={handleCompress} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? 'Compressing...' : 'Compress Image'}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Compression Complete!</h2>
          <p>Original Size: {result.originalSizeKB} KB</p>
          <p>Compressed Size: {result.compressedSizeKB} KB</p>
          <p>Reduction: {result.actualReduction}%</p>
          <img src={result.preview} alt="Preview" style={{ maxWidth: '100%' }} />
          <button onClick={handleDownload} style={{ marginTop: 10 }}>
            Download Compressed
          </button>
        </div>
      )}
    </div>
  );
}
