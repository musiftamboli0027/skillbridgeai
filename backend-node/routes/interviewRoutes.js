const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const aiInterviewController = require('../controllers/aiInterviewController');

// Multer setup for resume upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// AI Interview Routes
router.post('/generate', protect, aiInterviewController.generateInterviewQuestions);
router.post('/evaluate', protect, aiInterviewController.evaluateInterviewAnswer);
router.post('/report', protect, aiInterviewController.generateInterviewReport);
router.post('/upload-resume', protect, upload.single('resume'), aiInterviewController.uploadResume);
router.get('/history', protect, aiInterviewController.getInterviewHistory);
router.get('/:id', protect, aiInterviewController.getInterviewDetails);

module.exports = router;
