import express from 'express';
import { generateFinalReport } from '../services/aiService.js';

const router = express.Router();

router.post('/final-report', async (req, res) => {
  try {
    const { questions, answers, behaviorData, role, type } = req.body;

    if (!questions || !answers) {
      return res.status(400).json({ error: 'Missing interview data: questions and answers are required' });
    }

    const report = await generateFinalReport({
      questions,
      answers,
      behaviorData: behaviorData || {},
      role,
      type
    });

    res.json(report);
  } catch (error) {
    console.error('Error in /final-report:', error);
    res.status(500).json({ error: 'Failed to generate report', message: error.message });
  }
});

// Get sample report (for demo/testing)
router.get('/sample-report', async (req, res) => {
  try {
    const mockData = {
      questions: [
        { text: 'Tell me about yourself' },
        { text: 'What are your strengths?' }
      ],
      answers: [
        { answer: 'I am a software engineer with 5 years of experience...' },
        { answer: 'My strengths include problem-solving and communication...' }
      ],
      behaviorData: {
        eyeContact: [75, 80, 78],
        confidence: [80, 82, 79],
        expressions: ['neutral', 'happy', 'neutral']
      },
      role: 'Software Engineer',
      type: 'mixed'
    };
    
    const report = await generateFinalReport(mockData);
    res.json(report);
  } catch (error) {
    console.error('Error getting sample report:', error);
    res.status(500).json({ error: 'Failed to get sample report' });
  }
});

export default router;
