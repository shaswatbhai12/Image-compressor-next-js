const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(process.cwd(), 'images.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS compressed_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_filename TEXT NOT NULL,
    compressed_filename TEXT NOT NULL,
    original_size INTEGER NOT NULL,
    compressed_size INTEGER NOT NULL,
    quality INTEGER NOT NULL,
    compression_ratio REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Prepared statements
const insertImage = db.prepare(`
  INSERT INTO compressed_images (original_filename, compressed_filename, original_size, compressed_size, quality, compression_ratio)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const getAllImages = db.prepare('SELECT * FROM compressed_images ORDER BY created_at DESC');
const getImageById = db.prepare('SELECT * FROM compressed_images WHERE id = ?');

module.exports = {
  insertImage,
  getAllImages,
  getImageById
};