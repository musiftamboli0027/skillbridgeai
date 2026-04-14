import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, RefreshCw, ChevronRight, 
  ArrowLeft, CheckCircle2, Target, Sparkles, Brain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userStorage } from '../utils/userStorage';

const GOALS = [
  { id: 'job', title: 'Get a Job', icon: Briefcase, desc: 'I want to build my career and get hired.' },
  { id: 'skill', title: 'Learn a Skill', icon: Brain, desc: 'I want to master a specific technology.' },
  { id: 'switch', title: 'Career Switch', icon: RefreshCw, desc: 'I want to move to a new industry.' },
];

const LEVELS = [
  { id: 'beginner', title: 'Beginner', desc: 'No prior experience in this field.' },
  { id: 'intermediate', title: 'Intermediate', desc: 'I have some basic knowledge.' },
  { id: 'advanced', title: 'Advanced', desc: 'I am looking for specialized mastery.' },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    goal: '',
    level: '',
    intent: ''
  });
  const navigate = useNavigate();

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = () => {
    // Store in userStorage
    userStorage.setUser({
      ...data,
      isOnboarded: true
    });
    
    // Redirect to AI Tutor
    navigate('/dashboard/ai-tutor');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-orange-100 selection:text-orange-600">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-200/20 rounded-full blur-[120px]" />
         <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-200/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Progress Bar */}
        <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
               <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Step {step} of 3</span>
               <span className="text-xs font-black text-orange-500 uppercase tracking-widest">{Math.round((step/3)*100)}% Complete</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(step/3)*100}%` }}
                   className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                />
            </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-10">
                 <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">What is your primary goal?</h1>
                 <p className="text-slate-500 font-medium">Select one to personalize your AI learning path.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => { setData({...data, goal: goal.id}); nextStep(); }}
                    className={`group p-6 rounded-3xl border-2 transition-all flex items-center gap-6 text-left ${
                      data.goal === goal.id 
                        ? 'border-orange-500 bg-orange-50/50' 
                        : 'border-white bg-white hover:border-orange-200 shadow-sm'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                       data.goal === goal.id ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-500'
                    }`}>
                       <goal.icon size={28} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900">{goal.title}</h3>
                        <p className="text-sm text-slate-500 font-medium">{goal.desc}</p>
                    </div>
                    {data.goal === goal.id && <CheckCircle2 className="ml-auto text-orange-500" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <button 
                onClick={prevStep}
                className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors mb-6"
              >
                <ArrowLeft size={18} /> Back
              </button>

              <div className="text-center mb-10">
                 <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Your current skill level?</h1>
                 <p className="text-slate-500 font-medium">We'll adapt the course material accordingly.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => { setData({...data, level: level.id}); nextStep(); }}
                    className={`p-6 rounded-3xl border-2 transition-all text-left ${
                      data.level === level.id 
                        ? 'border-orange-500 bg-orange-50/50' 
                        : 'border-white bg-white hover:border-orange-200 shadow-sm shadow-slate-200/50'
                    }`}
                  >
                    <h3 className="text-lg font-black text-slate-900 mb-1">{level.title}</h3>
                    <p className="text-sm text-slate-500 font-medium">{level.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <button 
                onClick={prevStep}
                className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors mb-6"
              >
                <ArrowLeft size={18} /> Back
              </button>

              <div className="text-center">
                 <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-200">
                    <Sparkles className="text-white" />
                 </div>
                 <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">One last thing...</h1>
                 <p className="text-slate-500 font-medium">What specific goal do you want to achieve?</p>
              </div>

              <div className="relative">
                <textarea
                  autoFocus
                  value={data.intent}
                  onChange={(e) => setData({...data, intent: e.target.value})}
                  placeholder="e.g. Find a React developer internship within 3 months"
                  className="w-full h-40 p-6 rounded-[32px] border-2 border-slate-100 bg-white focus:border-orange-500 focus:outline-none transition-all text-slate-900 font-medium resize-none shadow-sm placeholder:text-slate-300"
                />
                <div className="absolute bottom-6 right-6 text-slate-300 text-xs font-bold uppercase tracking-widest">
                  Personalized intent
                </div>
              </div>

              <button
                onClick={handleFinish}
                disabled={!data.intent.trim()}
                className="w-full py-5 bg-orange-500 text-white rounded-3xl font-black text-xl shadow-2xl shadow-orange-200 hover:shadow-orange-300 disabled:opacity-30 disabled:shadow-none hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                Let's Start Learning <ChevronRight size={22} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center mt-12 text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
           <Target size={14} /> Powered by SkillPath AI
        </p>
      </div>
    </div>
  );
}
