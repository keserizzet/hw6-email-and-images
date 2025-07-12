const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const validateBody = require('../middleware/validateBody');
const { contactSchemas } = require('../middleware/validationSchemas');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

router.get('/', auth, contactController.getContacts);

router.get('/:contactId', auth, contactController.getContact);

router.post('/', auth, upload.single('photo'), validateBody(contactSchemas.create), contactController.createContact);

router.patch('/:contactId', auth, upload.single('photo'), validateBody(contactSchemas.update), contactController.updateContact);

router.delete('/:contactId', auth, contactController.deleteContact);

module.exports = router; 