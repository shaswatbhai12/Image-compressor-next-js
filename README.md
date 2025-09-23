# Image Compressor Next.js App

A modern web application to compress images with customizable quality settings, built with Next.js.

## Features

- Upload images (PNG, JPG, JPEG, GIF, BMP, WebP)
- Adjustable compression quality (10-70%)
- View compression statistics
- Download compressed images
- Clean, responsive UI
- Server-side image processing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and go to `http://localhost:3000`

## Usage

1. Select an image file
2. Adjust the compression quality using the slider
3. Click "Compress Image"
4. View the compression results and download the compressed image

## Technology Stack

- **Frontend**: Next.js, React
- **Image Processing**: Sharp (Node.js)
- **File Upload**: Multer
- **Styling**: CSS Modules

## API Endpoints

- `POST /api/compress` - Upload and compress image
- `GET /api/download/[filename]` - Download compressed image

## Build for Production

```bash
npm run build
npm start
```

<div align="center">
  <a href="https://shipwrecked.hackclub.com/?t=ghrm" target="_blank">
    <img src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/739361f1d440b17fc9e2f74e49fc185d86cbec14_badge.png" 
         alt="This project is part of Shipwrecked, the world's first hackathon on an island!" 
         style="width: 35%;">
  </a>
</div>