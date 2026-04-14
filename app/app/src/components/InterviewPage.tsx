import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { useSpeechToText } from '../hooks/useSpeechToText';
import FaceDetection from './FaceDetection';
import Timer from './Timer';
import { Mic, MicOff, AlertCircle, Save, RotateCcw, Volume2, VolumeX, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const InterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { interviewData, updateInterviewData, addAnswer } = useInterview();

  const {
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError,
    isSupported: isSpeechSupported,
  } = useSpeechToText();

  const [currentStep, setCurrentStep] = useState<'intro' | 'question' | 'answering' | 'review'>('question');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { questions, currentQuestionIndex, candidateName } = interviewData;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Redirect if no questions
  useEffect(() => {
    if (!interviewData.questions.length) {
      navigate('/');
    }
  }, [interviewData.questions, navigate]);

  // Text-to-speech for questions
  const speakQuestion = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((v) => v.name.includes('Google US English')) ||
                          voices.find((v) => v.name.includes('Samantha')) ||
                          voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Speak question when it changes
  useEffect(() => {
    if (currentQuestion && currentStep === 'question') {
      speakQuestion(currentQuestion.text || String(currentQuestion));
    }
    return () => stopSpeaking();
  }, [currentQuestion, currentStep, speakQuestion, stopSpeaking]);

  const handleStartAnswering = () => {
    setCurrentStep('answering');
    setTimerActive(true);
    resetTranscript();
    startListening();
  };

  const handleStopAnswering = () => {
    stopListening();
    setTimerActive(false);
    setCurrentStep('review');
    setCurrentAnswer(transcript);
  };

  const handleReRecord = () => {
    setCurrentStep('answering');
    setTimerActive(true);
    resetTranscript();
    setCurrentAnswer('');
    startListening();
  };

  const handleNextQuestion = async () => {
    if (!currentAnswer.trim()) return;

    setLoading(true);

    // Save current answer
    addAnswer({
      question: currentQuestion,
      answer: currentAnswer,
      duration: 0, // You'd want to track actual time here
    });

    if (isLastQuestion) {
      // Generate final report
      const mockReport = generateMockReport(interviewData);

      updateInterviewData({
        finalReport: mockReport,
        endTime: new Date().toISOString(),
      });

      navigate('/results');
    } else {
      updateInterviewData({
        currentQuestionIndex: currentQuestionIndex + 1,
      });
      setCurrentStep('question');
      setCurrentAnswer('');
      resetTranscript();
    }
    setLoading(false);
  };

  const generateMockReport = (data: typeof interviewData) => {
    return {
      overallScore: Math.floor(Math.random() * 20) + 75,
      categoryScores: {
        technical: Math.floor(Math.random() * 20) + 70,
        communication: Math.floor(Math.random() * 20) + 75,
        confidence: Math.floor(Math.random() * 20) + 70,
        clarity: Math.floor(Math.random() * 20) + 75,
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
        eyeContact: Math.floor(data.behaviorData.eyeContact.reduce((a, b) => a + b, 0) / (data.behaviorData.eyeContact.length || 1)) || 75,
        confidence: Math.floor(data.behaviorData.confidence.reduce((a, b) => a + b, 0) / (data.behaviorData.confidence.length || 1)) || 78,
        dominantExpression: 'neutral',
      },
      feedback: 'Overall, you demonstrated strong communication skills and technical knowledge. With some refinement in providing specific examples and maintaining conciseness, you would perform excellently in real interviews.',
    };
  };

  const progress = ((currentQuestionIndex) / questions.length) * 100;

  if (!interviewData.questions.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Interview in Progress</h1>
              <p className="text-sm text-gray-500">Good luck, {candidateName}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Timer isActive={timerActive} />
              <Badge variant="secondary">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Camera & Face Analysis */}
          <div className="space-y-4">
            <FaceDetection isActive={true} />

            {/* Live Feedback Card */}
            <Card className="bg-blue-50/80 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Interview Tips
                </h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    Speak clearly and maintain eye contact with the camera
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    Structure your answers with specific examples
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    Take a moment to think before answering
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    Keep your answers concise (1-2 minutes)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Question & Answer */}
          <div className="space-y-6">
            {/* Question Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium opacity-90">Question {currentQuestionIndex + 1}</h2>
                  <div className="flex items-center gap-2">
                    {currentQuestion?.category && (
                      <Badge className="bg-white/20 text-white border-0">
                        {currentQuestion.category}
                      </Badge>
                    )}
                    <button
                      onClick={isSpeaking ? stopSpeaking : () => speakQuestion(currentQuestion?.text || '')}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-xl font-medium leading-relaxed">
                  {currentQuestion?.text || String(currentQuestion)}
                </p>
              </CardContent>
            </Card>

            {/* Answer Section */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  {currentStep === 'question' && (
                    <motion.div
                      key="question"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center py-12"
                    >
                      <p className="text-gray-600 mb-6">
                        Click start when you're ready to answer. The timer will begin.
                      </p>
                      {!isSpeechSupported && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                          <AlertCircle className="w-4 h-4 inline mr-2" />
                          Speech recognition is not supported in your browser. You can type your answer instead.
                        </div>
                      )}
                      <Button
                        onClick={handleStartAnswering}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6"
                      >
                        <Mic className="w-5 h-5 mr-2" />
                        Start Answering
                      </Button>
                    </motion.div>
                  )}

                  {currentStep === 'answering' && (
                    <motion.div
                      key="answering"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 text-red-600 animate-pulse">
                        <div className="w-3 h-3 bg-red-600 rounded-full" />
                        <span className="font-semibold">Recording...</span>
                      </div>

                      {speechError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                          <AlertCircle className="w-4 h-4 inline mr-2" />
                          {speechError}
                        </div>
                      )}

                      <div className="bg-gray-50 rounded-lg p-4 min-h-[150px] border-2 border-gray-200">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {transcript || <span className="text-gray-400 italic">Speak now...</span>}
                        </p>
                      </div>

                      <Button
                        onClick={handleStopAnswering}
                        variant="destructive"
                        className="w-full text-lg py-6"
                      >
                        <MicOff className="w-5 h-5 mr-2" />
                        Stop Recording
                      </Button>
                    </motion.div>
                  )}

                  {currentStep === 'review' && (
                    <motion.div
                      key="review"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Review Your Answer
                      </h3>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-[200px] overflow-y-auto">
                        <p className="text-gray-800 whitespace-pre-wrap">{currentAnswer}</p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleReRecord}
                          variant="outline"
                          className="flex-1"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Re-record
                        </Button>
                        <Button
                          onClick={handleNextQuestion}
                          disabled={loading || !currentAnswer.trim()}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              {isLastQuestion ? 'Finish Interview' : 'Next Question'}
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-yellow-50/80 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 text-sm">Pro Tip</h4>
                    <p className="text-yellow-800 text-sm mt-1">
                      Use the <strong>STAR method</strong>: Situation, Task, Action, Result. 
                      This helps structure your answers clearly and makes them more impactful.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewPage;
