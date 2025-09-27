import formidable from 'formidable'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = formidable({
      maxFileSize: 16 * 1024 * 1024,
      keepExtensions: true
    })

    const [fields, files] = await form.parse(req)
    const file = files.file?.[0]
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const reduction = parseInt(fields.reduction?.[0]) || 30
    const quality = Math.max(10, 100 - reduction)
    
    const fileBuffer = fs.readFileSync(file.filepath)
    const originalSize = fileBuffer.length
    
    const compressedBuffer = await sharp(fileBuffer)
      .jpeg({ quality, progressive: true })
      .toBuffer()

    const compressedSize = compressedBuffer.length
    const actualReduction = ((originalSize - compressedSize) / originalSize) * 100

    // Return compressed image as base64 for Vercel compatibility
    const base64Image = compressedBuffer.toString('base64')

    res.json({
      success: true,
      originalSize: Math.round(originalSize / 1024 * 100) / 100,
      compressedSize: Math.round(compressedSize / 1024 * 100) / 100,
      actualReduction: Math.round(actualReduction * 10) / 10,
      imageData: `data:image/jpeg;base64,${base64Image}`
    })

  } catch (error) {
    console.error('Compression error:', error)
    res.status(500).json({ error: 'Compression failed' })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}