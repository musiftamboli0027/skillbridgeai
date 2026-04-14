import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Bot, Sparkles, Brain, Briefcase, 
  Users, Target, Layout, User, Send, Flag, Check, CodeSquare, Play
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#FFFAF5]/95 backdrop-blur-md py-4 shadow-sm border-b border-orange-50' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-[#F59E0B] rounded-[10px] flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Layout className="text-white w-5 h-5 fill-white" />
          </div>
          <span className="text-[22px] font-black text-[#1A1A1A] tracking-tight">SkillPath</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-sm font-bold text-[#1A1A1A] relative pb-1">
            Home
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#F59E0B] rounded-full" />
          </Link>
          {['AI Tutor', 'Opportunities', 'Career Agent'].map((item) => (
            <Link key={item} to="/onboarding" className="text-sm font-semibold text-[#4B5563] hover:text-[#1A1A1A] transition-colors pb-1">
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#1A1A1A] hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-orange-100/80 flex items-center justify-center">
              <User size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
            </div>
            Profile
          </button>
          <button 
            onClick={() => navigate('/onboarding')}
            className="px-6 py-[14px] bg-[#F59E0B] text-white rounded-xl text-sm font-bold hover:bg-[#DE8F0A] transition-all shadow-[0_8px_20px_rgba(245,158,11,0.25)] flex items-center gap-2"
          >
            Start with AI Tutor <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </nav>
  );
};

type ChatMessage = { role: 'user' | 'ai'; text: string };

const scenario: ChatMessage[] = [
  { role: 'ai', text: "Hi! What skill would you like to learn today?" },
  { role: 'user', text: "I want to learn Web Development" },
  { role: 'ai', text: "Great! I'll create a personalized learning plan for you." },
];

const AISimulation = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isTyping) {
      // If typing, wait 1.5s then add the message and stop typing
      timeout = setTimeout(() => {
        setMessages(prev => {
          if (prev.length < scenario.length) {
            return [...prev, scenario[prev.length]];
          }
          return prev;
        });
        setIsTyping(false);
      }, 1500);
    } else if (messages.length < scenario.length) {
      // If not typing and more messages to show, wait 2s then start typing
      timeout = setTimeout(() => {
        setIsTyping(true);
      }, 2000);
    } else if (messages.length === scenario.length) {
      // If reached the end, wait 5s then reset
      timeout = setTimeout(() => {
        setMessages([]);
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [messages.length, isTyping]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-end relative w-full pr-0 xl:pr-12">
      {/* Main Chat Window */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-orange-50/50 z-20"
      >
        <div className="flex items-center gap-2 mb-6 text-[12px] font-black text-[#1A1A1A]">
          <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
            <Bot size={12} className="text-[#F59E0B]" /> 
          </div>
          <span className="mr-1">AI Tutor</span> <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
        </div>
        
        <div className="space-y-4 mb-5 min-h-[140px]">
          <AnimatePresence mode='popLayout'>
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex gap-3 ${msg?.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg?.role === 'ai' && (
                  <div className="w-7 h-7 bg-orange-100 rounded-full flex flex-shrink-0 items-center justify-center mt-1">
                    <User size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
                  </div>
                )}
                <div className={`px-4 py-2.5 rounded-[14px] text-[12px] font-semibold leading-relaxed shadow-sm ${
                  msg?.role === 'user' 
                    ? 'bg-[#F59E0B] text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-100 text-[#1A1A1A] rounded-tl-sm'
                }`}>
                  {msg?.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
             <div className="flex gap-3 justify-start">
               <div className="w-7 h-7 bg-orange-100 rounded-full flex flex-shrink-0 items-center justify-center mt-1">
                 <User size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
               </div>
               <div className="flex gap-1.5 px-4 py-3 bg-white border border-slate-100 rounded-[14px] rounded-tl-sm w-fit items-center shadow-sm">
                 <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                 <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                 <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
               </div>
             </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['HTML Basics', 'CSS', 'JavaScript', 'Projects'].map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-[#FFF8ED] text-[10px] font-bold text-[#F59E0B] rounded-lg border border-orange-100/50">
              {tag}
            </span>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border border-slate-100 rounded-xl p-1.5 bg-white shadow-sm">
          <div className="flex-1 px-3 text-[12px] text-slate-400 font-medium">Ask me anything...</div>
          <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center shadow-md shadow-orange-500/30">
            <Send size={14} className="text-white ml-0.5" />
          </div>
        </div>
      </motion.div>

      {/* Floating Cards */}
      <div className="flex flex-col gap-4 w-full max-w-[280px] xl:absolute xl:-right-[40px] xl:bottom-12 z-30">
         {/* Learning Path */}
         <motion.div 
           animate={{ y: [0, -8, 0] }}
           transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
           className="bg-white rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-white"
         >
            <h4 className="text-[11px] font-bold text-[#1A1A1A] mb-4 tracking-wide">Your Learning Path</h4>
            <div className="flex justify-between items-start gap-4">
               <div className="space-y-3">
                 {[
                   { t: 'HTML & CSS Basics', d: true },
                   { t: 'JavaScript Fundamentals', d: true },
                   { t: 'Build 3 Mini Projects', d: false },
                   { t: 'Responsive Design', d: false },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-2.5">
                     <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${item.d ? 'bg-[#F59E0B] border-[#F59E0B]' : 'bg-white border-slate-200'}`}>
                        {item.d && <Check size={10} strokeWidth={4} className="text-white" />}
                     </div>
                     <span className={`text-[10px] ${item.d ? 'text-slate-800 font-bold' : 'text-slate-400 font-semibold'}`}>{item.t}</span>
                   </div>
                 ))}
               </div>
               
               {/* 65% chart */}
               <div className="relative w-[52px] h-[52px] flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="26" cy="26" r="22" stroke="#F1F5F9" strokeWidth="4" fill="transparent" />
                    <circle cx="26" cy="26" r="22" stroke="#F59E0B" strokeWidth="4" fill="transparent" strokeDasharray="138" strokeDashoffset="48" className="drop-shadow-sm" />
                  </svg>
                  <span className="absolute text-[11px] font-black text-[#1A1A1A]">65%</span>
               </div>
            </div>
         </motion.div>

         {/* Next milestone */}
         <motion.div 
           animate={{ y: [0, 6, 0] }}
           transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
           className="bg-white rounded-[16px] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.05)] border border-white flex items-center justify-between"
         >
            <div>
              <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Next milestone</p>
              <h5 className="text-[12px] font-bold text-[#1A1A1A]">Build a Portfolio Website</h5>
            </div>
            <div className="w-8 h-8 rounded-[10px] bg-[#FFF8ED] flex flex-shrink-0 items-center justify-center ml-3">
               <Flag size={14} className="text-[#F59E0B] fill-[#F59E0B]" />
            </div>
         </motion.div>
      </div>

      {/* Decorative dynamic background blob in hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent blur-3xl opacity-60"></div>
    </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFAF5] font-sans selection:bg-orange-100 selection:text-orange-600 overflow-x-hidden relative">
      
      {/* Premium Dot Grid + Gradient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b1a_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b1a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute left-[-10%] top-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-orange-400 opacity-20 blur-[120px]"></div>
        <div className="absolute right-[-10%] top-[20%] -z-10 h-[400px] w-[400px] rounded-full bg-amber-200 opacity-30 blur-[100px]"></div>
      </div>

      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="pt-[140px] lg:pt-[180px] pb-24 relative px-6 md:px-12 z-10">
        <div className="max-w-[1400px] mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-10 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF8ED] rounded-lg mb-6">
                <Sparkles className="text-[#F59E0B] w-[14px] h-[14px]" />
                <span className="text-[11px] font-bold text-[#F59E0B]">AI-powered learning & career platform</span>
              </div>
              
              <h1 className="text-[48px] md:text-[62px] font-black text-[#1A1A1A] mb-6 leading-[1.05] tracking-tight">
                Learn New Skills.<br />
                Get Hired <span className="relative inline-block text-[#F59E0B]">
                  Faster.
                  <svg className="absolute -bottom-1 lg:-bottom-2 left-0 w-full h-3 md:h-4 text-[#F59E0B]" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M5,15 Q30,5 50,15 T95,10" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              
              <p className="text-[18px] text-[#4B5563] mb-10 font-medium leading-[1.6]">
                Your personal AI tutor, career guide, and job matcher — all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 items-center mb-10">
                <button 
                  onClick={() => navigate('/onboarding')}
                  className="w-full sm:w-auto px-8 py-[18px] bg-[#F59E0B] text-white rounded-[14px] font-bold text-[15px] shadow-[0_12px_24px_rgba(245,158,11,0.25)] hover:bg-[#DE8F0A] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
                >
                  Start with AI Tutor <ArrowRight size={18} strokeWidth={2.5} />
                </button>
                <button className="w-full sm:w-auto px-6 py-[18px] text-[#1A1A1A] bg-white border border-slate-100 rounded-[14px] font-bold text-[15px] flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors shadow-sm group">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center">
                    <Play size={16} className="text-[#1A1A1A] fill-[#1A1A1A]" />
                  </div>
                  See how it works
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {['Personalized learning', 'Career roadmap', 'Job & internship matches'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-[13px] font-bold text-[#6B7280]">
                    <Check size={16} className="text-[#F59E0B]" strokeWidth={3} />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side Simulation */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="flex justify-center lg:justify-end"
            >
              <AISimulation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- STATS & WHAT YOU GET vs HOW IT WORKS --- */}
      <section className="relative z-10 pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          
          <div className="flex flex-col xl:flex-row gap-12 xl:gap-8 items-stretch">
            
            {/* Left Column (Stats + What you get) */}
            <div className="flex-1 flex flex-col justify-between pt-6">
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-orange-100/60">
                {[
                  { l: 'Active learners', v: '10K+' },
                  { l: 'Skills available', v: '500+' },
                  { l: 'Internships posted', v: '2K+' },
                  { l: 'Get hired faster', v: '95%' }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col border-l-2 border-orange-100/50 pl-5 first:border-0 first:pl-0">
                    <h3 className="text-[32px] font-black text-[#1A1A1A] mb-1">{stat.v}</h3>
                    <p className="text-[12px] font-bold text-[#6B7280]">{stat.l}</p>
                  </div>
                ))}
              </div>

              {/* What you get */}
              <div>
                <h2 className="text-[22px] font-black text-[#1A1A1A] mb-8">What you get</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  {[
                    { t: 'AI Tutor', d: 'Chat with your AI tutor for personalized guidance', bg: 'bg-[#FFF8ED]', Icon: CodeSquare },
                    { t: 'Career Planning', d: 'Get a roadmap tailored to your goals', bg: 'bg-[#FFF8ED]', Icon: Target },
                    { t: 'Community', d: 'Join a community of learners & mentors', bg: 'bg-[#FFF8ED]', Icon: Users },
                    { t: 'Opportunities', d: 'Find internships & jobs matched to your skills', bg: 'bg-[#FFF8ED]', Icon: Briefcase }
                  ].map((feat, i) => (
                    <motion.div whileHover={{ y: -4 }} key={i} className="p-6 bg-white rounded-3xl border border-orange-50 shadow-[0_12px_36px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[180px]">
                      <div className={`w-12 h-12 ${feat.bg} rounded-2xl flex items-center justify-center mb-6`}>
                        <feat.Icon className="text-[#F59E0B]" size={24} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="font-black text-[#1A1A1A] text-[15px] mb-2">{feat.t}</h4>
                        <p className="text-[12px] font-semibold text-[#6B7280] leading-[1.6]">{feat.d}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (How it works) */}
            <div className="xl:w-[45%] flex">
              <div className="bg-white/80 backdrop-blur-md rounded-[40px] p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-white flex-1 relative overflow-hidden">
                 <h2 className="text-[22px] font-black text-[#1A1A1A] mb-14 relative z-10">How it works</h2>
                 
                 <div className="flex flex-col sm:flex-row justify-between relative mt-4 z-10 gap-8 sm:gap-0">
                    {/* Horizontal Dashed Line (Desktop Only) */}
                    <div className="hidden sm:block absolute top-[28px] left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-orange-100 z-0" />

                    {[
                      { n: '1. Set Your Goals', d: 'Tell us your career\naspirations', i: Target },
                      { n: '2. Get AI Guidance', d: 'Receive a personalized\nlearning plan', i: Bot },
                      { n: '3. Learn & Practice', d: 'Follow lessons, build\nprojects', i: Brain },
                      { n: '4. Land Your Job', d: 'Get matched with\nreal opportunities', i: Briefcase }
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 z-10">
                        <div className="w-[56px] h-[56px] bg-[#FFF8ED] border-4 border-white rounded-full flex items-center justify-center shadow-sm mb-6">
                          <step.i className="text-[#F59E0B]" size={22} strokeWidth={2.5} />
                        </div>
                        <h5 className="font-black text-[#1A1A1A] mb-3 text-[13px] text-center">{step.n}</h5>
                        <p className="text-[11px] font-semibold text-[#6B7280] leading-relaxed text-center whitespace-pre-line px-2">{step.d}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-[1400px] mx-auto">
           <div className="rounded-[40px] p-16 md:p-24 text-center relative overflow-hidden bg-gradient-to-b from-[#FFF8ED] to-[#FFFAF5] border border-orange-100/50">
             <h2 className="text-[36px] md:text-[44px] font-black text-[#1A1A1A] mb-6 leading-tight tracking-tight">Ready to start your learning journey?</h2>
             <p className="text-[16px] font-medium text-[#4B5563] mb-12">Join thousands learning new skills with AI.</p>
             <button 
                onClick={() => navigate('/onboarding')}
                className="px-10 py-[20px] bg-[#F59E0B] text-white rounded-2xl font-black text-[16px] shadow-[0_12px_24px_rgba(245,158,11,0.25)] hover:bg-[#DE8F0A] hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto"
              >
                Start with AI Tutor <ArrowRight size={20} strokeWidth={3} />
              </button>
           </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 border-t border-orange-100 z-10 relative bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <span className="text-[#6B7280] text-[12px] font-semibold">© 2025 SkillPath. All rights reserved.</span>
           <div className="flex gap-8">
             {['About', 'Privacy', 'Terms', 'Contact'].map(l => (
               <Link key={l} to="#" className="text-[12px] font-bold text-[#6B7280] hover:text-[#F59E0B] transition-colors">{l}</Link>
             ))}
           </div>
        </div>
      </footer>
    </div>
  );
}
