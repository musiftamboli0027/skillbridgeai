const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const assignmentController = require('../controllers/assignmentController');

router.use(protect);

router.post('/:lessonId/submit/quiz', assignmentController.submitQuiz);
router.post('/:lessonId/submit/coding', assignmentController.submitCoding);

module.exports = router;
