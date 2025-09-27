import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [file, setFile] = useState(null)
  const [reduction, setReduction] = useState(30)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('reduction', reduction)

    try {
      const response = await fetch('/api/compress', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      if (response.ok) {
        console.log('API Response:', data)
        setResult(data)
        setError('')
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Upload failed')
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Image Compressor</title>
        <link rel="icon" href="/favicon.svg" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </Head>

      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.navBrand}>
            <i className="fas fa-compress-alt"></i>
            <span>ImageCompress</span>
          </div>
          <div className={styles.navLinks}>
            <a href="/" className={styles.navLink}>Compress</a>
            <a href="/about" className={styles.navLink}>About</a>
          </div>
        </div>
      </nav>

      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.headerSection}>
            <h1><i className="fas fa-image"></i> Compress Your Images</h1>
            <p>Reduce image file size while maintaining quality</p>
          </div>

          {error && (
            <div className={styles.alert}>
              <p>{error}</p>
            </div>
          )}

          <div className={styles.uploadCard}>
            <form onSubmit={handleSubmit} className={styles.uploadForm}>
              <div className={styles.fileUploadArea}>
                <i className={`fas fa-cloud-upload-alt ${styles.uploadIcon}`}></i>
                <p>Drag & drop your image here or</p>
                <input 
                  type="file" 
                  id="file" 
                  accept=".png,.jpg,.jpeg,.gif,.bmp,.webp" 
                  onChange={handleFileChange}
                  required 
                />
                <label htmlFor="file" className={styles.fileLabel}>
                  {file ? file.name : 'Choose File'}
                </label>
              </div>
              
              <div className={styles.sliderContainer}>
                <label htmlFor="reduction">Size Reduction</label>
                <div className={styles.sliderWrapper}>
                  <input 
                    type="range" 
                    id="reduction" 
                    min="10" 
                    max="70" 
                    value={reduction}
                    onChange={(e) => setReduction(e.target.value)}
                  />
                  <div className={styles.sliderValue}>
                    <span>{reduction}</span>%
                  </div>
                </div>
              </div>
              
              <button type="submit" className={styles.compressBtn} disabled={loading}>
                <i className="fas fa-compress-arrows-alt"></i>
                {loading ? 'Compressing...' : 'Compress Image'}
              </button>
            </form>
          </div>

          {result && (
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <i className="fas fa-check-circle success-icon"></i>
                <h2>Compression Complete!</h2>
              </div>
              
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Original</div>
                  <div className={styles.statValue}>{result.originalSize} KB</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Compressed</div>
                  <div className={styles.statValue}>{result.compressedSize} KB</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Reduction</div>
                  <div className={styles.statValue}>{result.actualReduction}%</div>
                </div>
              </div>
              
              <div className={styles.previewSection}>
                <h3><i className="fas fa-eye"></i> Preview</h3>
                <div className={styles.imageContainer}>
                  {result.imageData ? (
                    <img 
                      src={result.imageData} 
                      alt="Compressed Image" 
                      className={styles.previewImage}
                      onError={(e) => {
                        console.error('Image load error:', e)
                        console.log('Image data length:', result.imageData?.length)
                      }}
                      onLoad={() => console.log('Image loaded successfully')}
                    />
                  ) : (
                    <p>No image data available</p>
                  )}
                </div>
              </div>
              
              <div className={styles.actionButtons}>
                <a href={result.imageData} className={styles.downloadBtn} download="compressed-image.jpg">
                  <i className="fas fa-download"></i>
                  Download
                </a>
                <button onClick={() => window.location.reload()} className={styles.newCompressionBtn}>
                  <i className="fas fa-plus"></i>
                  New Compression
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}