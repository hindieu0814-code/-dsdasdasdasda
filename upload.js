const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuid } = require('uuid');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid()}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (['.txt', '.csv'].includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt and .csv files allowed'));
    }
  },
  limits: { fileSize: process.env.MAX_FILE_SIZE }
});

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileProcessor = require('../services/fileProcessor');
  const data = fileProcessor.parseFile(req.file.path);

  res.json({
    success: true,
    fileId: uuid(),
    fileName: req.file.originalname,
    recordCount: data.length,
    sampleData: data.slice(0, 5)
  });
});

module.exports = router;