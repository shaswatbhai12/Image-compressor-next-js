import { getAllImages } from '../../lib/database'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const images = getAllImages.all()
    res.json({ images })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' })
  }
}