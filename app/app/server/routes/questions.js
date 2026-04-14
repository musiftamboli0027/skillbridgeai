import express from 'express';
import { generateQuestions } from '../services/aiService.js';

const router = express.Router();

router.post('/generate-questions', async (req, res) => {
  try {
    const { role, difficulty, type, resume } = req.body;
    
    if (!role || !difficulty || !type) {
      return res.status(400).json({ error: 'Missing required fields: role, difficulty, type' });
    }

    const result = await generateQuestions(role, difficulty, type, resume);
    res.json(result);
  } catch (error) {
    console.error('Error in /generate-questions:', error);
    res.status(500).json({ error: 'Failed to generate questions', message: error.message });
  }
});

// Get sample questions (for demo/testing)
router.get('/sample-questions', async (req, res) => {
  try {
    const { role = 'Software Engineer', difficulty = 'medium', type = 'mixed' } = req.query;
    const result = await generateQuestions(role, difficulty, type);
    res.json(result);
  } catch (error) {
    console.error('Error getting sample questions:', error);
    res.status(500).json({ error: 'Failed to get sample questions' });
  }
});

export default router;
