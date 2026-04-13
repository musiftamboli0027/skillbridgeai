const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const generateQuestions = async (role, difficulty, type, resume = null) => {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not configured');
    return generateMockQuestions(role, difficulty, type);
  }

  const difficultyPrompts = {
    easy: 'basic to intermediate level questions suitable for junior positions',
    medium: 'intermediate to advanced questions suitable for mid-level positions',
    hard: 'advanced and complex questions suitable for senior positions including system design'
  };

  const typePrompts = {
    technical: 'technical coding, system design, and problem-solving questions',
    hr: 'behavioral and situational questions about teamwork, leadership, and conflict resolution',
    mixed: 'a mix of technical and behavioral questions'
  };

  let resumeContext = '';
  if (resume) {
    resumeContext = `Consider the candidate's resume content: ${resume}. Tailor questions based on their experience.`;
  }

  const prompt = `You are an experienced technical interviewer. Generate 5-8 ${difficultyPrompts[difficulty]} interview questions for a ${role} position.
  
Focus on ${typePrompts[type]}.
${resumeContext}

Requirements:
- Questions should be realistic and commonly asked in actual interviews
- Do not repeat similar questions
- Include a mix of question types (conceptual, practical, scenario-based)
- For technical questions, include coding challenges OR system design scenarios where appropriate

Return the response in this exact JSON format:
{
  "questions": [
    {
      "text": "question text here",
      "category": "technical|behavioral|system_design|coding",
      "difficulty": "easy|medium|hard",
      "expectedPoints": ["point 1", "point 2"]
    }
  ]
}`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating questions with Gemini:', error);
    return generateMockQuestions(role, difficulty, type);
  }
};

const evaluateAnswer = async (question, answer, role) => {
  if (!GEMINI_API_KEY) {
    return generateMockEvaluation(question, answer);
  }

  const prompt = `Evaluate this interview answer for a ${role} position.

Question: "${typeof question === 'string' ? question : question.text}"
Candidate's Answer: "${answer}"

Evaluate based on:
1. Technical accuracy (if applicable)
2. Clarity of communication
3. Structure and completeness
4. Use of examples
5. Confidence indicators

Provide detailed feedback in THIS exact JSON format:
{
  "score": 0-100,
  "technicalScore": 0-100,
  "communicationScore": 0-100,
  "feedback": "overall feedback",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvements": ["specific improvement suggestions"]
}`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return JSON.parse(response);
  } catch (error) {
    console.error('Error evaluating answer with Gemini:', error);
    return generateMockEvaluation(question, answer);
  }
};

const generateFinalReport = async (interviewData) => {
  if (!GEMINI_API_KEY) {
    return generateMockReport(interviewData);
  }

  const { questions, answers, behaviorData, role, type } = interviewData;

  const qaPairs = answers.map((a, i) => {
    const qText = typeof questions[i] === 'string' ? questions[i] : (questions[i]?.text || 'Unknown Question');
    return `Q${i+1}: ${qText}\nA${i+1}: ${a.answer}`;
  }).join('\n\n');

  const avgEyeContact = behaviorData.eyeContact?.length > 0 
    ? Math.round(behaviorData.eyeContact.reduce((a,b) => a+b, 0) / behaviorData.eyeContact.length)
    : 70;
  const avgConfidence = behaviorData.confidence?.length > 0
    ? Math.round(behaviorData.confidence.reduce((a,b) => a+b, 0) / behaviorData.confidence.length)
    : 70;

  const expressionCounts = {};
  behaviorData.expressions?.forEach(expr => {
    expressionCounts[expr] = (expressionCounts[expr] || 0) + 1;
  });
  const dominantExpression = Object.entries(expressionCounts)
    .sort((a,b) => b[1] - a[1])[0]?.[0] || 'neutral';

  const prompt = `Generate a comprehensive final interview report for a ${role} ${type} interview.

Interview Transcript:
${qaPairs}

Behavioral Metrics:
- Average Eye Contact: ${avgEyeContact}%
- Average Confidence Score: ${avgConfidence}%
- Dominant Expression: ${dominantExpression}

Generate a detailed report in this exact JSON format:
{
  "overallScore": 0-100,
  "categoryScores": {
    "technical": 0-100,
    "communication": 0-100,
    "confidence": 0-100,
    "clarity": 0-100
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvements": [
    {"area": "specific area", "suggestion": "detailed suggestion"},
    {"area": "another area", "suggestion": "detailed suggestion"}
  ],
  "behaviorAnalysis": {
    "eyeContact": ${avgEyeContact},
    "confidence": ${avgConfidence},
    "dominantExpression": "${dominantExpression}"
  },
  "feedback": "comprehensive paragraph summarizing performance and next steps"
}

Be honest and constructive.`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating final report with Gemini:', error);
    return generateMockReport(interviewData);
  }
};

// Mock data generators for fallback
const generateMockQuestions = (role, difficulty, type) => {
  return {
    questions: [
      {
        text: `Tell me about yourself and your interest in ${role}.`,
        category: 'behavioral',
        difficulty: 'easy',
        expectedPoints: ['Personal background', 'Motivation']
      },
      {
        text: `What are your biggest strengths for this ${role} position?`,
        category: 'behavioral',
        difficulty: 'easy',
        expectedPoints: ['Skills', 'Examples']
      }
    ]
  };
};

const generateMockEvaluation = (question, answer) => {
  return {
    score: 80,
    technicalScore: 75,
    communicationScore: 85,
    feedback: 'Good answer. Try to be more specific.',
    strengths: ['Clarity'],
    weaknesses: ['Lack of examples'],
    improvements: ['Use STAR method']
  };
};

const generateMockReport = (interviewData) => {
  return {
    overallScore: 82,
    categoryScores: { technical: 80, communication: 85, confidence: 78, clarity: 84 },
    strengths: ['Communication', 'Enthusiasm'],
    weaknesses: ['Technical depth'],
    improvements: [{ area: 'Depth', suggestion: 'Deep dive into internals' }],
    behaviorAnalysis: { eyeContact: 80, confidence: 75, dominantExpression: 'neutral' },
    feedback: 'Strong performance overall.'
  };
};

module.exports = {
  generateQuestions,
  evaluateAnswer,
  generateFinalReport
};
