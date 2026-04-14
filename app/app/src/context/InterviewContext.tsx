import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface Question {
  text: string;
  category?: string;
  difficulty?: string;
  expectedPoints?: string[];
}

export interface Answer {
  question: Question | string;
  answer: string;
  duration?: number;
  score?: number;
}

export interface BehaviorData {
  eyeContact: number[];
  confidence: number[];
  expressions: string[];
  timestamps?: string[];
}

export interface FinalReport {
  overallScore: number;
  categoryScores: {
    technical: number;
    communication: number;
    confidence: number;
    clarity: number;
  };
  strengths: string[];
  weaknesses: string[];
  improvements: {
    area: string;
    suggestion: string;
  }[];
  behaviorAnalysis: {
    eyeContact: number;
    confidence: number;
    dominantExpression: string;
  };
  feedback: string;
}

export interface InterviewData {
  candidateName: string;
  role: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'technical' | 'hr' | 'mixed';
  questions: Question[];
  answers: Answer[];
  behaviorData: BehaviorData;
  currentQuestionIndex: number;
  isRecording: boolean;
  finalReport: FinalReport | null;
  startTime?: string;
  endTime?: string;
}

interface InterviewContextType {
  interviewData: InterviewData;
  updateInterviewData: (newData: Partial<InterviewData>) => void;
  addAnswer: (answer: Answer) => void;
  addBehaviorData: (data: { eyeContact: number; confidence: number; expression: string; timestamp?: string }) => void;
  resetInterview: () => void;
}

const defaultInterviewData: InterviewData = {
  candidateName: '',
  role: '',
  difficulty: 'medium',
  type: 'technical',
  questions: [],
  answers: [],
  behaviorData: {
    eyeContact: [],
    confidence: [],
    expressions: [],
    timestamps: [],
  },
  currentQuestionIndex: 0,
  isRecording: false,
  finalReport: null,
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [interviewData, setInterviewData] = useState<InterviewData>(defaultInterviewData);

  const updateInterviewData = (newData: Partial<InterviewData>) => {
    setInterviewData((prev) => ({ ...prev, ...newData }));
  };

  const addAnswer = (answer: Answer) => {
    setInterviewData((prev) => ({
      ...prev,
      answers: [...prev.answers, answer],
    }));
  };

  const addBehaviorData = (data: { eyeContact: number; confidence: number; expression: string; timestamp?: string }) => {
    setInterviewData((prev) => ({
      ...prev,
      behaviorData: {
        eyeContact: [...prev.behaviorData.eyeContact, data.eyeContact],
        confidence: [...prev.behaviorData.confidence, data.confidence],
        expressions: [...prev.behaviorData.expressions, data.expression],
        timestamps: [...(prev.behaviorData.timestamps || []), data.timestamp || new Date().toISOString()],
      },
    }));
  };

  const resetInterview = () => {
    setInterviewData(defaultInterviewData);
  };

  return (
    <InterviewContext.Provider
      value={{
        interviewData,
        updateInterviewData,
        addAnswer,
        addBehaviorData,
        resetInterview,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = (): InterviewContextType => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
