import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const { filename } = req.query
  const filePath = path.join(process.cwd(), 'public', 'compressed', filename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' })
  }

  const fileBuffer = fs.readFileSync(filePath)
  
  res.setHeader('Content-Type', 'image/jpeg')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(fileBuffer)
}