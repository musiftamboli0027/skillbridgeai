import React, { useEffect, useState } from "react";
import { 
  Mic, Zap, Trophy, History, PlayCircle, Loader2, Sparkles, 
  AlertCircle, Users, Briefcase, ChevronRight, Download, Target, ChevronDown 
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { InterviewProvider, useInterview } from "../../context/InterviewContext";
import InterviewPage from "./components/InterviewPage";
import ResultDashboard from "./components/ResultDashboard";
import api from "../../services/api";

function AIInterviewContent() {
  const { status, startInterview, resetInterview, isLoading } = useInterview();
  const [history, setHistory] = useState<any[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    role: "Frontend Engineer",
    difficulty: "medium",
    type: "technical",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [resumeText, setResumeText] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await api.getInterviewHistory();
      if (data.success) setHistory(data.items);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    await startInterview({ ...form, resumeText });
  };

  const onResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.uploadInterviewResume(formData);
      if (res.success) {
        setResumeText(res.text);
      }
    } catch (err) {
      console.error("Resume upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  if (status === 'in_progress') {
    return <InterviewPage />;
  }

  if (status === 'completed') {
    return <ResultDashboard />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      {/* Immersive Hero Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-16 px-8 rounded-[40px] bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5 border border-white/5 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] -z-10 animate-blob" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] -z-10 animate-blob animation-delay-2000" />
        
        <div className="relative z-10 text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            Next-Gen AI Interview Prep
          </motion.div>
          
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-black text-white leading-tight tracking-tighter">
              Land Your Dream Job with <span className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">Confidence.</span>
            </h1>
            <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto">
              Real-time behavior analysis, AI behavioral insights, and technical scoring powered by Google's Gemini.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
               <Mic className="w-4 h-4 text-orange-400" />
               <span className="text-sm font-bold text-white">Voice Enabled</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
               <Trophy className="w-4 h-4 text-blue-400" />
               <span className="text-sm font-bold text-white">Behavior Tracking</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Configuration Form (Based on user reference) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-7"
        >
          <div className="glass-card p-10 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/20 flex items-center justify-center border border-[#7C3AED]/30 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                <Users className="w-8 h-8 text-[#7C3AED]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Configure Your Interview</h2>
                <p className="text-gray-400 mt-1">Customize your practice session</p>
              </div>
            </div>

            <form onSubmit={handleStart} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
                    <Users className="w-4 h-4 text-orange-400" /> Full Name
                  </label>
                  <input 
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-orange-500/50 focus:bg-white/10 outline-none transition-all placeholder:text-gray-600"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
                    <Briefcase className="w-4 h-4 text-blue-400" /> Target Role
                  </label>
                  <div className="relative group">
                    <select 
                      value={form.role}
                      onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all appearance-none cursor-pointer pr-12"
                    >
                      <option value="" disabled className="bg-[#0A0A0B]">Select a role</option>
                      {[
                        "Frontend Engineer", "Backend Engineer", "Fullstack Developer", 
                        "Data Scientist", "Product Manager", "DevOps Engineer", 
                        "UI/UX Designer", "Mobile Developer", "ML Engineer", "Security Analyst"
                      ].map(role => (
                        <option key={role} value={role} className="bg-[#0A0A0B] text-white py-2">{role}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">Difficulty</label>
                    <div className="relative group">
                      <select 
                        value={form.difficulty}
                        onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-orange-500/50 focus:bg-white/10 outline-none transition-all appearance-none cursor-pointer pr-12"
                      >
                        <option value="easy" className="bg-[#0A0A0B]">Junior</option>
                        <option value="medium" className="bg-[#0A0A0B]">Mid-Level</option>
                        <option value="hard" className="bg-[#0A0A0B]">Senior</option>
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-orange-400 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">Interview Type</label>
                    <div className="relative group">
                      <select 
                        value={form.type}
                        onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-orange-500/50 focus:bg-white/10 outline-none transition-all appearance-none cursor-pointer pr-12"
                      >
                        <option value="technical" className="bg-[#0A0A0B]">Technical</option>
                        <option value="hr" className="bg-[#0A0A0B]">Behavioral</option>
                        <option value="mixed" className="bg-[#0A0A0B]">Mixed</option>
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-orange-400 transition-colors" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
                    <Download className="w-4 h-4 text-green-400" /> Upload Resume (Optional)
                  </label>
                  <label className="relative group block w-full py-10 border-2 border-dashed border-white/10 rounded-[32px] text-center cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Download className="w-6 h-6 text-gray-400 group-hover:text-orange-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-white font-bold">{isUploading ? 'Extracting text...' : resumeText ? 'Resume Loaded ✓' : 'Click to upload PDF or Word document'}</p>
                        <p className="text-xs text-gray-500">Max file size: 5MB</p>
                      </div>
                    </div>
                    <input type="file" className="hidden" accept=".pdf" onChange={onResumeUpload} />
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  disabled={isLoading}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-[#7C3AED] hover:from-blue-600 hover:to-[#6D28D9] text-white font-black text-lg transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group active:scale-[0.98]"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Start Interview <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                </button>
                <p className="text-center text-xs text-gray-500 mt-6 font-medium">
                  You'll need camera and microphone access for the full experience
                </p>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Right: History & Tips */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <History className="w-6 h-6 text-blue-400" />
                Practice History
              </h2>
              <button className="text-sm font-bold text-gray-400 hover:text-white transition-colors">View All</button>
            </div>

            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="py-16 bg-white/5 border border-white/5 border-dashed rounded-[32px] flex flex-col items-center text-center px-8">
                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                     <Mic className="w-8 h-8 text-gray-700" />
                   </div>
                   <h3 className="text-white font-bold">No sessions yet</h3>
                   <p className="text-sm text-gray-500 mt-2 max-w-[200px]">Start your first practice session to see analytics here.</p>
                </div>
              ) : (
                history.slice(0, 3).map(session => (
                  <div key={session._id} className="group p-6 rounded-[28px] bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-all flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                       <Zap className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-white font-bold uppercase tracking-tight">{session.role}</h3>
                        <span className="text-[10px] font-bold text-gray-500">{new Date(session.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider">{session.type} • {session.difficulty}</p>
                      
                      {session.result?.overallScore ? (
                        <div className="flex items-center gap-2">
                           <div className="px-2 py-0.5 rounded-lg bg-green-500/10 border border-green-500/20 text-[10px] font-black text-green-400 tracking-tighter">
                             SCORE: {session.result.overallScore}%
                           </div>
                           <Trophy className="w-3.5 h-3.5 text-orange-400" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-orange-400/50 italic">SESSION INCOMPLETE</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-8 bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/20"
          >
             <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
               <Zap className="w-6 h-6 text-orange-500" />
               Interview Tips
             </h3>
             <div className="space-y-6">
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/20">
                   <Users className="w-5 h-5 text-blue-400" />
                 </div>
                 <p className="text-sm text-gray-400 leading-relaxed">
                   Maintain focus on your camera. AI tracking measures <span className="text-blue-400 font-bold">Engagement Intensity</span>.
                 </p>
               </div>
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center shrink-0 border border-orange-500/20">
                   <Target className="w-5 h-5 text-orange-400" />
                 </div>
                 <p className="text-sm text-gray-400 leading-relaxed">
                   Structure answers with the <span className="text-orange-400 font-bold">STAR method</span> for behavioral questions.
                 </p>
               </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function AIInterview() {
  return (
    <DashboardLayout>
      <div className="bg-[#050505] min-h-[calc(100vh-64px)] p-8">
        <InterviewProvider>
          <AIInterviewContent />
        </InterviewProvider>
      </div>
    </DashboardLayout>
  );
}
