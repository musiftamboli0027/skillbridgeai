import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

interface Question {
  text: string;
  category: string;
  difficulty: string;
  expectedPoints?: string[];
}

interface Answer {
  question: string;
  answer: string;
  score?: number;
  feedback?: string;
  duration?: number;
}

interface BehaviorData {
  eyeContact: number;
  confidence: number;
  expression: string;
  timestamp: string;
}

interface InterviewState {
  interviewId: string | null;
  role: string | null;
  fullName: string | null;
  difficulty: string | null;
  type: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  behaviorData: BehaviorData[];
  status: 'idle' | 'preparing' | 'in_progress' | 'completed';
  isLoading: boolean;
  error: string | null;
}

interface InterviewContextType extends InterviewState {
  startInterview: (config: { fullName: string; role: string; difficulty: string; type: string; resumeText?: string }) => Promise<void>;
  submitAnswer: (answer: string, duration: number) => Promise<void>;
  finishInterview: () => Promise<void>;
  addBehaviorData: (data: BehaviorData) => void;
  resetInterview: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<InterviewState>({
    interviewId: null,
    role: null,
    fullName: null,
    difficulty: null,
    type: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    behaviorData: [],
    status: 'idle',
    isLoading: false,
    error: null,
  });

  const startInterview = async (config: { fullName: string; role: string; difficulty: string; type: string; resumeText?: string }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await api.generateInterviewQuestions(config);
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          interviewId: data.interviewId,
          role: config.role,
          fullName: config.fullName,
          difficulty: config.difficulty,
          type: config.type,
          questions: data.questions,
          status: 'in_progress',
          isLoading: false,
        }));
      } else {
        throw new Error(data.message || 'Failed to start interview');
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  };

  const submitAnswer = async (answer: string, duration: number) => {
    if (!state.interviewId) return;

    const currentQuestion = state.questions[state.currentQuestionIndex];
    
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const data = await api.evaluateInterviewAnswer({
        interviewId: state.interviewId,
        questionIndex: state.currentQuestionIndex,
        question: currentQuestion.text,
        answer,
        role: state.role
      });

      if (data.success) {
        const newAnswer: Answer = {
          question: currentQuestion.text,
          answer,
          score: data.evaluation.score,
          feedback: data.evaluation.feedback,
          duration,
        };

        setState(prev => ({
          ...prev,
          answers: [...prev.answers, newAnswer],
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          isLoading: false,
        }));
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  };

  const finishInterview = async () => {
    if (!state.interviewId) return;

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Aggregate behavior data
      const eyeContact = state.behaviorData.map(d => d.eyeContact);
      const confidence = state.behaviorData.map(d => d.confidence);
      const expressions = state.behaviorData.map(d => d.expression);
      const timestamps = state.behaviorData.map(d => d.timestamp);

      const data = await api.generateInterviewReport({
        interviewId: state.interviewId,
        behaviorData: { eyeContact, confidence, expressions, timestamps }
      });
      
      if (data.success) {
        setState(prev => ({ ...prev, status: 'completed', isLoading: false }));
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  };

  const addBehaviorData = useCallback((data: BehaviorData) => {
    setState(prev => ({
      ...prev,
      behaviorData: [...prev.behaviorData, data],
    }));
  }, []);

  const resetInterview = () => {
    setState({
      interviewId: null,
      role: null,
      fullName: null,
      difficulty: null,
      type: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      behaviorData: [],
      status: 'idle',
      isLoading: false,
      error: null,
    });
  };

  return (
    <InterviewContext.Provider value={{ 
      ...state, 
      startInterview, 
      submitAnswer, 
      finishInterview, 
      addBehaviorData, 
      resetInterview 
    }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
