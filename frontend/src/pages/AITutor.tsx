/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { userStorage, type UserData } from '../utils/userStorage';
import {
  Send, Bot, User, Sparkles, MessageSquare, Copy, Check,
  Trash2, RefreshCw, ChevronRight,
  Target, GraduationCap, Briefcase, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'roadmap' | 'course';
  data?: any;
  timestamp: Date;
}

const ROADMAPS: Record<string, string[]> = {
  'job': ['Skill Proficiency Assessment', 'Personalized Roadmap Generation', 'Portfolio Building', 'Interview Preparation'],
  'skill': ['Fundamental Concepts Mastery', 'Practical Implementation Projects', 'Advanced Topic Deep Dive', 'Expert Certification'],
  'switch': ['Industry Context & Trends', 'Skill Gap Analysis', 'Intensive Bridge Learning', 'Portfolio & Profile Transformation'],
};

const COURSE_SUGGESTIONS: Record<string, any> = {
  'job': {
    title: 'Career Genesis: Path to Employment',
    duration: '15 hours',
    level: 'Comprehensive',
    icon: Briefcase
  },
  'skill': {
    title: 'Mastery Series: Advanced Implementation',
    duration: '10 hours',
    level: 'Expert',
    icon: Brain
  },
  'switch': {
    title: 'Pivot Point: The Industry Bridge',
    duration: '20 hours',
    level: 'Foundational',
    icon: RefreshCw
  }
};

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const initialized = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Helper for generating unique IDs
  const generateId = (prefix = '') => `${prefix}${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Load user data and send initial message
  useEffect(() => {
    if (initialized.current) return;
    const userData = userStorage.getUser();
    setUser(userData);

    if (userData && messages.length === 0) {
      initialized.current = true;
      // Auto-generate welcome message
      setIsTyping(true);
      setTimeout(() => {
        const welcomeMsg: Message = {
          id: generateId('welcome-'),
          role: 'assistant',
          content: `Hey 👋 I see you're here to ${
            userData.goal === 'job' ? 'get a job' : userData.goal === 'skill' ? 'master a new skill' : 'switch your career'
          }. \n\nI've analyzed your goal: "${userData.intent}" and I'm ready to guide you step-by-step.`,
          timestamp: new Date()
        };
        setMessages([welcomeMsg]);
        setIsTyping(false);

        // Send roadmap after a short delay
        setTimeout(() => {
          sendRoadmap(userData);
        }, 1500);
      }, 1000);
    }
  }, []);

  // Derived state for the active roadmap
  const activeRoadmap = [...messages].reverse().find((m: Message) => m.type === 'roadmap')?.data as string[] || (user?.goal ? ROADMAPS[user.goal] : null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendRoadmap = (userData: UserData) => {
    setIsTyping(true);
    setTimeout(() => {
      const roadmap = ROADMAPS[userData.goal] || ROADMAPS['job'];
      const roadmapMsg: Message = {
        id: generateId('roadmap-'),
        role: 'assistant',
        content: `Let's start your journey! Here is your personalized roadmap:`,
        type: 'roadmap',
        data: roadmap,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, roadmapMsg]);
      setIsTyping(false);

      // Finally recommended course
      setTimeout(() => {
        sendCourseRecommendation(userData.goal);
      }, 1500);
    }, 1000);
  };

  const sendCourseRecommendation = (goal: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const course = COURSE_SUGGESTIONS[goal] || COURSE_SUGGESTIONS['job'];
      const courseMsg: Message = {
        id: generateId('course-rec-'),
        role: 'assistant',
        content: `I've also selected a core course to kickstart your progress:`,
        type: 'course',
        data: course,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, courseMsg]);
      setIsTyping(false);
    }, 1000);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: generateId('user-'),
      role: 'user',
      content: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('skillbridge_token')}`
        },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          user: userStorage.getUser()
        })
      });

      if (!response.ok) throw new Error('Failed to connect to AI');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      const aiMsgId = generateId('ai-');
      const aiMsg: Message = {
        id: aiMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      if (reader) {
        let accumulatedContent = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') break;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  accumulatedContent += parsed.text;
                  setMessages(prev => 
                    prev.map(m => m.id === aiMsgId ? { ...m, content: accumulatedContent } : m)
                  );
                }
              } catch (e) {
                console.error('Error parsing stream chunk', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming Error:', error);
      setIsTyping(false);
      const errorMsg: Message = {
        id: generateId('error-'),
        role: 'assistant',
        content: "I'm having trouble connecting to my brain right now. Please check if your API key is valid and try again!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  }, [messages, isTyping]);

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatMessage = (msg: Message) => {
    if (msg.type === 'course') {
      const course = msg.data;
      const Icon = course.icon;
      return (
        <div className="mt-4 p-5 rounded-[24px] bg-white border border-orange-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex gap-4 items-start mb-4">
             <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-100">
                <Icon size={24} />
             </div>
             <div>
                <h4 className="text-slate-900 font-black text-lg leading-tight">{course.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{course.level}</span>
                   <span className="text-xs font-medium text-slate-400">• {course.duration}</span>
                </div>
             </div>
          </div>
          <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group">
            Start Learning <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      );
    }

    if (msg.type === 'roadmap') {
        const roadmap = msg.data as string[];
        return (
            <div className="mt-4 space-y-3">
                {roadmap.map((step, idx) => (
              <div 
                key={`${msg.id}-${idx}`}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer group"
              >
                        <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center font-black text-xs">
                           {idx + 1}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{step}</span>
                        <div className="ml-auto w-2 h-2 rounded-full bg-slate-200" />
                    </div>
                ))}
            </div>
        );
    }

    return (
      <div className="space-y-1">
        {msg.content.split('\n').map((line, j) => (
          <p key={j} className={msg.role === 'assistant' ? 'text-slate-700 font-medium leading-relaxed' : ''}>
            {line}
          </p>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full gap-6 font-inter overflow-hidden min-h-0">
        
        {/* Main Chat Column */}
        <div className="flex-1 flex flex-col min-w-0 bg-white/50 backdrop-blur-sm rounded-[40px] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/20">
          
          {/* Chat Header */}
          <div className="flex items-center justify-between px-8 py-6 shrink-0 border-b border-slate-100 bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-100">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">AI Tutor</h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> Active
                  </span>
                </div>
              </div>
            </div>
            <button onClick={clearChat} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <Trash2 size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-8 px-8 py-10 custom-scrollbar scroll-smooth">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 mt-1">
                      <Bot size={20} className="text-orange-500" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                    <div className={`rounded-[28px] px-6 py-4 shadow-sm hover:shadow-md transition-shadow duration-300 ${
                      msg.role === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-sm'
                        : 'bg-white text-slate-900 rounded-tl-sm border border-slate-100'
                    }`}>
                      {formatMessage(msg)}
                    </div>
                    <div className={`flex items-center gap-3 mt-2 px-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.role === 'assistant' && (
                        <button 
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="text-[10px] font-black text-slate-400 hover:text-orange-500 flex items-center gap-1 uppercase tracking-widest transition-colors"
                        >
                          {copiedId === msg.id ? <Check size={10} /> : <Copy size={10} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <User size={20} className="text-orange-600" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                  <Bot size={20} className="text-orange-500" />
                </div>
                <div className="bg-white border border-slate-100 rounded-[28px] rounded-tl-sm px-6 py-4 flex items-center gap-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  </div>
                  <span className="text-[11px] font-black text-orange-500/60 uppercase tracking-widest">Tutor is thinking...</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="px-8 pb-8 pt-4 shrink-0 bg-white/80 backdrop-blur-md border-t border-slate-50">
            <div className="relative bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/30 p-2.5 flex items-end gap-3 rounded-[32px] focus-within:border-orange-200 transition-all focus-within:shadow-orange-100/20">
              <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                <MessageSquare size={20} />
              </div>
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your tutor anything..."
                className="flex-1 bg-transparent text-slate-900 text-base font-bold outline-none resize-none py-2.5 placeholder-slate-300 max-h-32"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-11 h-11 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100 hover:shadow-orange-200 disabled:opacity-20 transition-all hover:-translate-y-0.5 shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Roadmap Sidebar */}
        <div className="hidden lg:flex w-80 flex-col shrink-0 bg-white/40 backdrop-blur-sm rounded-[40px] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/10">
           <div className="px-8 py-6 border-b border-slate-100 bg-white/60">
              <div className="flex items-center gap-3 mb-1">
                <Target size={18} className="text-orange-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Your Learning Path</h3>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Goal: {user?.goal || 'Personalized'}</p>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {activeRoadmap ? (
                <div className="space-y-4">
                  {activeRoadmap.map((step, idx) => (
                    <div key={idx} className="group relative flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-[24px] shadow-sm hover:shadow-md transition-all cursor-pointer">
                      <div className="flex flex-col items-center shrink-0">
                         <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-orange-100 z-10">
                            {idx + 1}
                         </div>
                         {idx < activeRoadmap.length - 1 && (
                           <div className="w-0.5 h-full bg-slate-100 absolute top-12 left-8 -z-0" />
                         )}
                      </div>
                      <div className="pt-1">
                        <span className="text-xs font-black text-slate-700 leading-tight group-hover:text-orange-600 transition-colors uppercase tracking-tight">{step}</span>
                        <div className="flex items-center gap-1.5 mt-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-orange-400 transition-colors" />
                           <span className="text-[9px] font-bold text-slate-300 uppercase">Not Started</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                      <RefreshCw size={24} className="animate-spin-slow" />
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Initializing Roadmap...</p>
                </div>
              )}
           </div>

           <div className="p-6 mt-auto">
              <div className="p-4 bg-slate-900 rounded-[28px] text-white">
                 <div className="flex items-center gap-2 mb-2">
                    <GraduationCap size={14} className="text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Level Progression</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '35%' }}
                       className="h-full bg-orange-500"
                    />
                 </div>
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span>Rank: Novice</span>
                    <span className="text-white">35% to Level 2</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
