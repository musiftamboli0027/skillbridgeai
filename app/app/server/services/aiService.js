import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateQuestions = async (role, difficulty, type, resume = null) => {
  // If no OpenAI API key, return mock questions
  if (!process.env.OPENAI_API_KEY) {
    console.log('No OpenAI API key found, returning mock questions');
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
- For technical questions, include coding challenges or system design scenarios where appropriate

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
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert technical interviewer." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating questions:', error);
    // Return mock questions as fallback
    return generateMockQuestions(role, difficulty, type);
  }
};

export const evaluateAnswer = async (question, answer, role) => {
  // If no OpenAI API key, return mock evaluation
  if (!process.env.OPENAI_API_KEY) {
    console.log('No OpenAI API key found, returning mock evaluation');
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

Provide detailed feedback in this JSON format:
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
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert interview coach." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return generateMockEvaluation(question, answer);
  }
};

export const generateFinalReport = async (interviewData) => {
  // If no OpenAI API key, return mock report
  if (!process.env.OPENAI_API_KEY) {
    console.log('No OpenAI API key found, returning mock report');
    return generateMockReport(interviewData);
  }

  const { questions, answers, behaviorData, role, type } = interviewData;

  // Format Q&A for analysis
  const qaPairs = answers.map((a, i) => {
    const qText = typeof questions[i] === 'string' ? questions[i] : questions[i]?.text;
    return `Q${i+1}: ${qText}\nA${i+1}: ${a.answer}`;
  }).join('\n\n');

  // Calculate behavior averages
  const avgEyeContact = behaviorData.eyeContact?.length > 0 
    ? Math.round(behaviorData.eyeContact.reduce((a,b) => a+b, 0) / behaviorData.eyeContact.length)
    : 70;
  const avgConfidence = behaviorData.confidence?.length > 0
    ? Math.round(behaviorData.confidence.reduce((a,b) => a+b, 0) / behaviorData.confidence.length)
    : 70;

  // Find dominant expression
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

Generate a detailed report in this JSON format:
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

Be honest and constructive. If scores are low, provide actionable improvement advice.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a senior technical interviewer and career coach." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error generating final report:', error);
    return generateMockReport(interviewData);
  }
};

// Mock data generators for fallback
const generateMockQuestions = (role, difficulty, type) => {
  const questions = [
    {
      text: `Tell me about yourself and why you're interested in this ${role} position.`,
      category: 'behavioral',
      difficulty: 'easy',
      expectedPoints: ['Brief personal background', 'Relevant experience', 'Interest in the role']
    },
    {
      text: `What are your greatest strengths that make you a good fit for this ${role} role?`,
      category: 'behavioral',
      difficulty: 'easy',
      expectedPoints: ['Relevant technical skills', 'Soft skills', 'Examples of application']
    },
    {
      text: `Describe a challenging project you worked on and how you overcame the obstacles.`,
      category: 'behavioral',
      difficulty: 'medium',
      expectedPoints: ['Clear situation description', 'Actions taken', 'Results achieved']
    },
    {
      text: `How do you stay updated with the latest technologies and trends in ${role}?`,
      category: 'technical',
      difficulty: 'medium',
      expectedPoints: ['Learning resources', 'Community involvement', 'Personal projects']
    },
    {
      text: `Explain a complex technical concept you've worked with to a non-technical person.`,
      category: 'communication',
      difficulty: 'medium',
      expectedPoints: ['Simplified explanation', 'Analogies used', 'Patient communication']
    },
    {
      text: `Where do you see yourself in 5 years in your career as a ${role}?`,
      category: 'behavioral',
      difficulty: 'medium',
      expectedPoints: ['Career goals', 'Skill development plans', 'Alignment with company']
    }
  ];

  if (type === 'technical' || type === 'mixed') {
    questions.push({
      text: `Describe your experience with the core technologies required for this ${role} position.`,
      category: 'technical',
      difficulty: difficulty,
      expectedPoints: ['Specific technologies', 'Years of experience', 'Project examples']
    });
  }

  if (type === 'hr' || type === 'mixed') {
    questions.push({
      text: `How do you handle conflicts with team members or stakeholders?`,
      category: 'behavioral',
      difficulty: difficulty,
      expectedPoints: ['Conflict resolution approach', 'Communication skills', 'Example situation']
    });
  }

  return { questions };
};

const generateMockEvaluation = (question, answer) => {
  return {
    score: Math.floor(Math.random() * 20) + 75,
    technicalScore: Math.floor(Math.random() * 20) + 70,
    communicationScore: Math.floor(Math.random() * 20) + 75,
    feedback: 'Good answer with clear structure. Could benefit from more specific examples.',
    strengths: ['Clear communication', 'Good structure'],
    weaknesses: ['Could use more specific examples', 'Answer was slightly long'],
    improvements: ['Include metrics in your examples', 'Practice conciseness']
  };
};

const generateMockReport = (interviewData) => {
  const behaviorData = interviewData.behaviorData || {};
  const avgEyeContact = behaviorData.eyeContact?.length > 0 
    ? Math.round(behaviorData.eyeContact.reduce((a,b) => a+b, 0) / behaviorData.eyeContact.length)
    : 75;
  const avgConfidence = behaviorData.confidence?.length > 0
    ? Math.round(behaviorData.confidence.reduce((a,b) => a+b, 0) / behaviorData.confidence.length)
    : 78;

  return {
    overallScore: Math.floor(Math.random() * 15) + 80,
    categoryScores: {
      technical: Math.floor(Math.random() * 15) + 80,
      communication: Math.floor(Math.random() * 15) + 82,
      confidence: Math.floor(Math.random() * 15) + 78,
      clarity: Math.floor(Math.random() * 15) + 81,
    },
    strengths: [
      'Clear and structured communication style',
      'Good technical knowledge demonstrated',
      'Confident presentation of ideas',
    ],
    weaknesses: [
      'Could provide more specific examples',
      'Some answers were slightly lengthy',
    ],
    improvements: [
      { area: 'Technical Depth', suggestion: 'Include more specific technical details and metrics in your answers' },
      { area: 'Conciseness', suggestion: 'Try to keep answers focused and under 2 minutes' },
      { area: 'Examples', suggestion: 'Use the STAR method for behavioral questions' },
    ],
    behaviorAnalysis: {
      eyeContact: avgEyeContact,
      confidence: avgConfidence,
      dominantExpression: 'neutral',
    },
    feedback: 'Overall, you demonstrated strong communication skills and technical knowledge. With some refinement in providing specific examples and maintaining conciseness, you would perform excellently in real interviews.',
  };
};
