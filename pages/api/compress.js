import formidable from 'formidable';
import fs from 'fs';
import sharp from 'sharp';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'File parsing failed' });

    const reductionPercent = parseInt(fields.reduction || '30');
    const file = files.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const inputBuffer = fs.readFileSync(file.filepath);
      const metadata = await sharp(inputBuffer).metadata();

      const scale = (100 - reductionPercent) / 100;
      const width = Math.round(metadata.width * scale);

      const outputBuffer = await sharp(inputBuffer)
        .resize({ width })
        .jpeg({ quality: 95 })
        .toBuffer();

      const originalSizeKB = (inputBuffer.length / 1024).toFixed(2);
      const compressedSizeKB = (outputBuffer.length / 1024).toFixed(2);
      const actualReduction = (
        ((inputBuffer.length - outputBuffer.length) / inputBuffer.length) *
        100
      ).toFixed(1);

      const base64Image = `data:image/jpeg;base64,${outputBuffer.toString('base64')}`;

      res.status(200).json({
        success: true,
        originalSizeKB,
        compressedSizeKB,
        actualReduction,
        preview: base64Image,
        filename: file.originalFilename.replace(/\s/g, '_'),
      });
    } catch (error) {
      res.status(500).json({ error: 'Compression failed', message: error.message });
    }
  });
}
