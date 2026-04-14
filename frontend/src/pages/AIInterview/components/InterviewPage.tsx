import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, AlertCircle, Save, RotateCcw, Volume2, 
  VolumeX, ChevronRight, Brain, Target, Lightbulb, Play, Loader2
} from 'lucide-react';
import { useInterview } from '../../../context/InterviewContext';
import { useSpeechToText } from '../hooks/useSpeechToText';
import FaceDetection from './FaceDetection';
import Timer from './Timer';

const InterviewPage: React.FC = () => {
  const { 
    questions, currentQuestionIndex, submitAnswer, finishInterview, 
    isLoading: isSubmitting, role
  } = useInterview();

  const {
    transcript, startListening, stopListening, resetTranscript,
    error: speechError
  } = useSpeechToText();

  const [step, setStep] = useState<'preview' | 'recording' | 'review'>('preview');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [answerContent, setAnswerContent] = useState('');
  const [startTime, setStartTime] = useState<number>(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const speakQuestion = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    if (currentQuestion && step === 'preview') {
      const timer = setTimeout(() => speakQuestion(currentQuestion.text), 1000);
      return () => {
        clearTimeout(timer);
        stopSpeaking();
      };
    }
  }, [currentQuestion, step, speakQuestion, stopSpeaking]);

  const handleStartRecording = () => {
    setStep('recording');
    setStartTime(Date.now());
    resetTranscript();
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
    setStep('review');
    setAnswerContent(transcript || '');
  };

  const handleReRecord = () => {
    resetTranscript();
    setStep('recording');
    setStartTime(Date.now());
    startListening();
  };

  const handleNext = async () => {
    if (!answerContent.trim()) return;
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    await submitAnswer(answerContent, duration);
    
    if (isLastQuestion) {
      await finishInterview();
    } else {
      setStep('preview');
      setAnswerContent('');
      resetTranscript();
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Bar: Interaction & State */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Progress Header */}
          <div className="glass-card p-6 flex items-center justify-between border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <Brain className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">{role} Interview</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Targeting: Senior Professional</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Timer isActive={step === 'recording'} duration={180} />
              <div className="h-10 w-px bg-white/10" />
              <div className="flex flex-col items-end">
                <span className="text-2xl font-black text-white">{currentQuestionIndex + 1}<span className="text-gray-600 text-sm">/{questions.length}</span></span>
                <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Questions</span>
              </div>
            </div>
          </div>

          {/* Question Display Card */}
          <motion.div 
            key={currentQuestionIndex}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-purple-500/10 to-blue-500/20 opacity-30 blur-[60px] -z-10 group-hover:opacity-50 transition-opacity duration-700" />
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[40px] p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8">
                 <button 
                    onClick={isSpeaking ? stopSpeaking : () => speakQuestion(currentQuestion.text)}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 backdrop-blur-md group/vol"
                  >
                    {isSpeaking ? <VolumeX className="w-6 h-6 text-orange-500" /> : <Volume2 className="w-6 h-6 group-hover/vol:scale-110" />}
                  </button>
               </div>
               
               <div className="space-y-6 max-w-2xl">
                 <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] border border-orange-500/20">
                    {currentQuestion.category || 'GENERAL COMPETENCY'}
                 </span>
                 <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
                   {currentQuestion.text}
                 </h1>
               </div>
            </div>
          </motion.div>

          {/* Interaction Area */}
          <div className="glass-card rounded-[40px] p-10 border-white/5 shadow-2xl min-h-[450px] flex flex-col relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent">
            <AnimatePresence mode="wait">
              {step === 'preview' && (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="flex-1 flex flex-col items-center justify-center text-center space-y-10"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500/20 blur-3xl animate-pulse" />
                    <div className="w-24 h-24 rounded-3xl bg-orange-500/10 flex items-center justify-center border border-orange-500/30 relative z-10">
                      <Play className="w-10 h-10 text-orange-500 translate-x-1" />
                    </div>
                  </div>
                  <div className="max-w-md space-y-3">
                    <h3 className="text-2xl font-black text-white">System Calibration Ready</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">Ensure you're in a quiet environment. The AI will begin transcription and behavior tracking as soon as you start.</p>
                  </div>
                  <button 
                    onClick={handleStartRecording}
                    className="group relative px-12 py-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black transition-all shadow-2xl shadow-orange-500/30 flex items-center gap-4 active:scale-95"
                  >
                    <Mic className="w-6 h-6" />
                    BEGIN YOUR ANSWER
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 'recording' && (
                <motion.div 
                  key="recording"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col space-y-8"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-4 h-4 bg-red-500 rounded-full animate-ping opacity-20" />
                        <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                      </div>
                      <span className="text-red-400 font-black text-xs tracking-[0.2em] uppercase">Live Transcription Active</span>
                    </div>
                    {speechError && (
                      <div className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-400 font-black flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5" /> ERROR: {speechError}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 bg-black/40 rounded-[32px] p-10 border border-white/5 min-h-[300px] shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.01] to-transparent" />
                    <p className="text-white text-xl font-medium leading-relaxed relative z-10 selection:bg-orange-500/30">
                      {transcript || <span className="text-gray-700 italic select-none">Begin speaking. Your words will appear here in real-time...</span>}
                    </p>
                  </div>

                  <button 
                    onClick={handleStopRecording}
                    className="w-full py-6 rounded-2xl bg-white/5 hover:bg-red-500/10 text-white font-black tracking-widest transition-all border border-white/10 hover:border-red-500/40 flex items-center justify-center gap-3 group active:scale-[0.99]"
                  >
                    <MicOff className="w-6 h-6 group-hover:scale-110 group-hover:text-red-500 transition-all" />
                    FINISH RECORDING
                  </button>
                </motion.div>
              )}

              {step === 'review' && (
                <motion.div 
                  key="review"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="flex-1 flex flex-col space-y-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                       <Save className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-black tracking-tight">Review & Refine</h3>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Verify the transcription accuracy before submission</p>
                    </div>
                  </div>

                  <textarea 
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    className="w-full bg-black/40 rounded-[32px] p-10 border border-white/5 text-gray-200 text-xl font-medium leading-relaxed focus:border-orange-500/30 outline-none transition-all min-h-[300px] shadow-inner"
                  />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <button 
                      onClick={handleReRecord}
                      className="py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      <RotateCcw className="w-5 h-5" />
                      RETAKE ANSWER
                    </button>
                    <button 
                      onClick={handleNext}
                      disabled={isSubmitting || !answerContent.trim()}
                      className="py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-black transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          ANALYZING PERFORMANCE
                        </div>
                      ) : (
                        <>
                          {isLastQuestion ? 'SUBMIT & FINISH' : 'CONFIRM & NEXT QUESTION'}
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sidebar: AI Context */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Real-time Video Analysis */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/10 blur-[40px] opacity-50 group-hover:opacity-100 transition-opacity" />
            <FaceDetection isActive={true} />
          </div>

          {/* Intelligence Monitor */}
          <div className="glass-card p-8 border-white/5 bg-gradient-to-br from-blue-600/10 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10" />
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8 flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-400" />
              Intelligence Monitor
            </h4>
            
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase tracking-tight">Real-time Feedback</p>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                    Analyzing eye-contact consistency, micro-expressions, and volume modulation.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20 group hover:scale-110 transition-transform">
                  <Lightbulb className="w-6 h-6 text-orange-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase tracking-tight">Active Strategy</p>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                    Maintain an upright posture. Remember to use quantifiable metrics (e.g., % growth, time saved).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Wave Visualizer */}
          <AnimatePresence>
            {step === 'recording' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-black/60 rounded-[32px] p-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)] flex flex-col items-center gap-6"
              >
                 <div className="flex items-end gap-1.5 h-12">
                   {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                     <motion.div 
                      key={i}
                      animate={{ height: [12, 32, 16, 44, 18, 24, 12] }}
                      transition={{ 
                        duration: 0.8, 
                        repeat: Infinity, 
                        delay: i * 0.08,
                        ease: "easeInOut"
                      }}
                      className="w-2 bg-gradient-to-t from-red-600 to-red-400 rounded-full"
                     />
                   ))}
                 </div>
                 <div className="flex flex-col items-center gap-1">
                   <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Audio Feed Active</span>
                   <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Processing spectral data</span>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default InterviewPage;
