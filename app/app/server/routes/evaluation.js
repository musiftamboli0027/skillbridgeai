import express from 'express';
import Interview from '../models/Interview.js';
import { evaluateAnswer } from '../services/aiService.js';

const router = express.Router();

router.post('/evaluate', async (req, res) => {
  try {
    const { question, answer, role } = req.body;
    
    if (!question || !answer || !role) {
      return res.status(400).json({ error: 'Missing required fields: question, answer, role' });
    }

    const evaluation = await evaluateAnswer(question, answer, role);
    res.json(evaluation);
  } catch (error) {
    console.error('Error in /evaluate:', error);
    res.status(500).json({ error: 'Failed to evaluate answer', message: error.message });
  }
});

router.post('/save-interview', async (req, res) => {
  try {
    const interviewData = req.body;
    
    // Check if MongoDB is connected
    if (!Interview.db) {
      console.log('MongoDB not connected, skipping save');
      return res.json({ success: true, interviewId: 'demo-id', message: 'Interview saved to memory (MongoDB not connected)' });
    }
    
    const interview = new Interview({
      candidateName: interviewData.candidateName,
      role: interviewData.role,
      difficulty: interviewData.difficulty,
      type: interviewData.type,
      questions: interviewData.questions.map(q => q.text || q),
      answers: interviewData.answers.map(a => ({
        question: typeof a.question === 'string' ? a.question : a.question.text,
        answer: a.answer,
        duration: a.duration
      })),
      behaviorData: interviewData.behaviorData,
      result: interviewData.result,
      startTime: interviewData.startTime,
      endTime: interviewData.endTime
    });

    await interview.save();
    res.json({ success: true, interviewId: interview._id });
  } catch (error) {
    console.error('Error saving interview:', error);
    res.status(500).json({ error: 'Failed to save interview', message: error.message });
  }
});

// Get interview history
router.get('/interviews/:candidateName', async (req, res) => {
  try {
    const { candidateName } = req.params;
    
    if (!Interview.db) {
      return res.json({ interviews: [], message: 'MongoDB not connected' });
    }
    
    const interviews = await Interview.find({ candidateName })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({ interviews });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ error: 'Failed to fetch interviews', message: error.message });
  }
});

export default router;
