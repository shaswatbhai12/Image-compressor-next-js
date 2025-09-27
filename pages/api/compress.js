import multer from 'multer'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import { insertImage } from '../../lib/database'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 16 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp']
    cb(null, allowedTypes.includes(file.mimetype))
  }
})

const uploadDir = path.join(process.cwd(), 'public', 'compressed')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await runMiddleware(req, res, upload.single('file'))
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const reduction = parseInt(req.body.reduction) || 30
    const fileId = uuidv4()
    const compressedFilename = `${fileId}_compressed.jpg`
    const compressedPath = path.join(uploadDir, compressedFilename)

    const originalSize = req.file.buffer.length
    const quality = Math.max(10, 100 - reduction)

    const image = sharp(req.file.buffer)
    
    await image
      .jpeg({ quality, progressive: true })
      .toFile(compressedPath)

    const compressedSize = fs.statSync(compressedPath).size
    const actualReduction = ((originalSize - compressedSize) / originalSize) * 100

    // Save to database
    insertImage.run(
      req.file.originalname,
      compressedFilename,
      originalSize,
      compressedSize,
      quality,
      actualReduction
    )

    res.json({
      success: true,
      originalSize: Math.round(originalSize / 1024 * 100) / 100,
      compressedSize: Math.round(compressedSize / 1024 * 100) / 100,
      actualReduction: Math.round(actualReduction * 10) / 10,
      previewUrl: `/compressed/${compressedFilename}`,
      downloadUrl: `/api/download/${compressedFilename}`
    })

  } catch (error) {
    res.status(500).json({ error: 'Compression failed' })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}