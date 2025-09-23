import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function About() {
  return (
    <>
      <Head>
        <title>About - Image Compressor</title>
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
            <a href="/about" className={`${styles.navLink} ${styles.active}`}>About</a>
          </div>
        </div>
      </nav>

      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.aboutHeader}>
            <h1><i className="fas fa-info-circle"></i> About ImageCompress</h1>
            <p>Fast, secure, and efficient image compression</p>
          </div>

          <div className={styles.aboutContent}>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <i className={`fas fa-shield-alt ${styles.featureIcon}`}></i>
                <h3>Secure</h3>
                <p>Your images are processed locally and automatically deleted after compression</p>
              </div>
              
              <div className={styles.featureCard}>
                <i className={`fas fa-tachometer-alt ${styles.featureIcon}`}></i>
                <h3>Fast</h3>
                <p>Quick compression using advanced algorithms while maintaining image quality</p>
              </div>
              
              <div className={styles.featureCard}>
                <i className={`fas fa-cogs ${styles.featureIcon}`}></i>
                <h3>Smart</h3>
                <p>Intelligent resizing that preserves aspect ratio and visual quality</p>
              </div>
            </div>

            <div className={styles.infoSection}>
              <h2>How It Works</h2>
              <div className={styles.steps}>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepContent}>
                    <h4>Upload Image</h4>
                    <p>Select your image file (PNG, JPG, JPEG, GIF, BMP, WebP)</p>
                  </div>
                </div>
                
                <div className={styles.step}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepContent}>
                    <h4>Choose Reduction</h4>
                    <p>Set your desired size reduction percentage (10-70%)</p>
                  </div>
                </div>
                
                <div className={styles.step}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepContent}>
                    <h4>Download Result</h4>
                    <p>Preview and download your compressed image</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.techSection}>
              <h2>Technology</h2>
              <p>Built with Next.js and Sharp library, using LANCZOS resampling for high-quality image resizing. The compression maintains 95% JPEG quality while reducing file size through intelligent dimension scaling.</p>
            </div>

            <div className={styles.ctaSection}>
              <a href="/" className={styles.ctaButton}>
                <i className="fas fa-compress-arrows-alt"></i>
                Start Compressing
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}