import express from 'express';
import multer from 'multer';
import pdf from 'pdf-parse';
import OpenAI from 'openai';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
    }
  }
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let text = '';
    
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(req.file.buffer);
      text = data.text;
    } else {
      // For Word documents, convert buffer to string (basic text extraction)
      text = req.file.buffer.toString('utf-8');
    }

    // Limit text length for OpenAI
    const truncatedText = text.substring(0, 3000);

    // If no OpenAI API key, return basic info
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        text: text.substring(0, 500),
        parsed: {
          skills: ['JavaScript', 'React', 'Node.js'],
          experience: '5 years',
          technologies: ['React', 'Node.js', 'MongoDB']
        },
        message: 'Resume parsed successfully (OpenAI not configured, using mock data)'
      });
    }

    // Extract key information using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: `Extract key skills, experience level, and technologies from this resume. Return as JSON: {skills: [], experience: "", technologies: []}\n\n${truncatedText}`
      }]
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      text: text.substring(0, 500),
      parsed,
      message: 'Resume parsed successfully'
    });
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ 
      error: 'Failed to parse resume', 
      message: error.message 
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
    }
  }
  next(error);
});

export default router;
