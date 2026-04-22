const express = require('express');
const router = express.Router();
const controller = require('../controllers/assetController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// CREATE ASSET WITH FILE UPLOAD
router.post('/', upload.single('file'), controller.createAsset);

// Dashboard route
router.get('/dashboard/stats', controller.getDashboardStats);

// CRUD routes
router.get('/', controller.getAllAssets);
router.get('/:id', controller.getAssetById);
router.put('/:id', controller.updateAsset);
router.delete('/:id', controller.deleteAsset);

// Asset relocation
router.post('/:id/relocate', controller.relocateAsset);
router.get('/:id/relocations', controller.getRelocationHistory);

module.exports = router;