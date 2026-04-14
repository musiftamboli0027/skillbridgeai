import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, TrendingUp, CheckCircle, RotateCcw, Download, 
  Brain, Eye, Smile, Target, MessageSquare, Lightbulb, Star 
} from 'lucide-react';
import { useInterview } from '../../../context/InterviewContext';

const ResultDashboard: React.FC = () => {
  const { answers, behaviorData, role, resetInterview, fullName } = useInterview();

  const overallScore = Math.round(answers.reduce((acc, curr) => acc + (curr.score || 0), 0) / (answers.length || 1));
  
  const avgEyeContact = behaviorData.length > 0 
    ? Math.round(behaviorData.reduce((a,b) => a + b.eyeContact, 0) / behaviorData.length)
    : 75;
    
  const avgConfidence = behaviorData.length > 0
    ? Math.round(behaviorData.reduce((a,b) => a + b.confidence, 0) / behaviorData.length)
    : 80;

  const expressionCounts: Record<string, number> = {};
  behaviorData.forEach(d => {
    expressionCounts[d.expression] = (expressionCounts[d.expression] || 0) + 1;
  });
  const dominantExpression = Object.entries(expressionCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'neutral';

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const strengths = ["Confident communication", "Structured answers", "Good technical foundation"];
  const improvements = ["Provide more specific metrics", "Slow down your speech rate", "Maintain focus during complex questions"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-12 pb-20"
    >
      {/* Premium Hero Score Section */}
      <div className="relative overflow-hidden rounded-[48px] bg-[#03040A] border border-white/5 p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] -z-10" />
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-orange-500/20 blur-[40px] rounded-full group-hover:bg-orange-500/30 transition-all duration-500" />
            <svg className="w-56 h-56 -rotate-90 relative z-10">
              <circle
                cx="112" cy="112" r="100"
                fill="none" stroke="currentColor" strokeWidth="12"
                className="text-white/5"
              />
              <motion.circle
                cx="112" cy="112" r="100"
                fill="none" stroke="url(#scoreGradient)" strokeWidth="12"
                strokeDasharray={628.3}
                initial={{ strokeDashoffset: 628.3 }}
                animate={{ strokeDashoffset: 628.3 - (628.3 * overallScore) / 100 }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="text-7xl font-black text-white"
              >
                {overallScore}
              </motion.span>
              <span className="text-xs text-gray-400 font-black tracking-[0.3em] uppercase">Score</span>
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black tracking-widest uppercase">
              <Award className="w-4 h-4" />
              Assessment Complete
            </div>
            <h1 className="text-5xl font-black text-white leading-tight">
              Exceptional effort {fullName ? `, ${fullName}` : ""} on your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">{role}</span> interview!
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Your performance has been analyzed across multiple vectors including technical accuracy, facial engagement, and verbal clarity.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <button 
                onClick={resetInterview}
                className="px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3 active:scale-[0.98]"
              >
                <RotateCcw className="w-5 h-5" />
                START NEW SESSION
              </button>
              <button className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black border border-white/10 transition-all flex items-center gap-3 backdrop-blur-md">
                <Download className="w-5 h-5" />
                DOWNLOAD REPORT
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Behavioral Insights */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-8 border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-400" />
              Behavioral Insights
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                    <Eye className="w-4 h-4 text-blue-400" /> Eye Contact
                  </span>
                  <span className={`text-xl font-black ${getScoreColor(avgEyeContact)}`}>{avgEyeContact}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${avgEyeContact}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                    <TrendingUp className="w-4 h-4 text-green-400" /> Confidence
                  </span>
                  <span className={`text-xl font-black ${getScoreColor(avgConfidence)}`}>{avgConfidence}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${avgConfidence}%` }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.3)]" 
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] block mb-4">Dominant Expression</span>
                <div className="flex items-center gap-4 p-5 rounded-[24px] bg-white/5 border border-white/10 group hover:bg-white/[0.08] transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
                    <Smile className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white capitalize">{dominantExpression}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Natural Presence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#7C3AED]/5 border border-[#7C3AED]/20 rounded-[32px] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/10 blur-3xl -z-10 group-hover:scale-150 transition-transform duration-700" />
            <h4 className="text-white text-lg font-bold flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-orange-400 animate-pulse" />
              Expert Tip
            </h4>
            <p className="text-gray-400 leading-relaxed font-medium">
              "Your confidence scores peaks when discussing past technical projects. Lean into those experiences to maintain this high engagement level."
            </p>
          </div>
        </div>

        {/* Right: Detailed Performance Analysis */}
        <div className="lg:col-span-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strengths */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card p-8 border-green-500/10 bg-gradient-to-br from-green-600/5 to-transparent"
            >
              <h3 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                Key Strengths
              </h3>
              <ul className="space-y-4">
                {strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-4 text-gray-300 font-medium">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Improvements */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-card p-8 border-orange-500/10 bg-gradient-to-br from-orange-600/5 to-transparent"
            >
              <h3 className="text-xl font-bold text-orange-400 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6" />
                Growth Areas
              </h3>
              <ul className="space-y-4">
                {improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-4 text-gray-300 font-medium">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white tracking-tight">Question-wise Analysis</h3>
            <div className="space-y-6">
              {answers.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * idx }}
                  className="group relative"
                >
                  <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all overflow-hidden relative">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 relative z-10">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Session Fragment {idx + 1}</span>
                        <h4 className="text-xl font-bold text-white leading-tight">{item.question}</h4>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-3xl font-black ${getScoreColor(item.score || 0)}`}>{item.score}%</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ACCURACY</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                          <MessageSquare className="w-3.5 h-3.5" /> Your Transcription
                        </div>
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 italic text-sm text-gray-300 leading-relaxed shadow-inner">
                          "{item.answer}"
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                          <Star className="w-3.5 h-3.5 text-orange-400" /> AI Feedback
                        </div>
                        <p className="text-sm text-blue-300 font-medium leading-relaxed">
                          {item.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultDashboard;
