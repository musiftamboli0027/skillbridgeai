import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FileText, 
    Linkedin, 
    CheckCircle2, 
    TrendingUp, 
    Mic,
    Shield,
    ArrowRight
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/button';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CommunicationBuilder() {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<any[]>([]);
    const [tips, setTips] = useState<any>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sessionsRes, tipsRes] = await Promise.all([
                    api.getCommunicationSessions(),
                    api.getResumeTips()
                ]);
                if (sessionsRes.success) setSessions(sessionsRes.data);
                if (tipsRes.success) setTips(tipsRes.data);
            } catch (error) {
                console.error("Error fetching comm data:", error);
            }
        };
        fetchData();
    }, []);

    if (user?.year !== '3rd Year' && user?.year !== '4th Year') {
        return (
            <DashboardLayout>
                <div className="h-[80vh] flex flex-col items-center justify-center text-center p-8">
                    <Shield className="w-16 h-16 text-[#EF4444] mb-6" />
                    <h1 className="text-3xl font-black text-white uppercase italic">3rd Year Protocol Required</h1>
                    <p className="text-[#64748B] mt-4 max-w-sm font-bold uppercase tracking-widest text-[10px]">Communication Mastery node is reserved for Senior Institutional Students.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-12 pb-24 animate-slide-in">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Communication Mastery</h1>
                    <p className="text-[#64748B] mt-2 text-[10px] font-black uppercase tracking-[0.4em]">Protocols for High-Impact Delivery</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Mock Interview Launch */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="lg:col-span-2 glass-card p-12 border-[#7C3AED]/20 bg-gradient-to-br from-[#7C3AED]/10 to-transparent rounded-[3rem] relative overflow-hidden"
                    >
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            <div className="w-24 h-24 rounded-3xl bg-[#7C3AED] flex items-center justify-center shadow-2xl">
                                <Mic className="w-12 h-12 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">AI Interview Simulator</h2>
                                <p className="text-[#94A3B8] text-sm mt-3 leading-relaxed font-medium">Initialize a high-fidelity HR mock interview. Receive real-time telemetry on tone, logic, and impact.</p>
                                <Button className="mt-8 h-14 px-10 bg-white text-black hover:bg-[#7C3AED] hover:text-white font-black rounded-xl uppercase tracking-widest text-[10px] transition-all">
                                    Initialize Session
                                </Button>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C3AED]/10 blur-[100px] pointer-events-none" />
                    </motion.div>

                    {/* Resume & LinkedIn Nodes */}
                    <div className="space-y-8">
                        <div className="glass-card p-8 border-white/5 bg-[#03040A] rounded-[2.5rem] group cursor-pointer hover:border-[#00D4FF]/30 transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <FileText className="w-6 h-6 text-[#00D4FF]" />
                                <h3 className="font-black text-white uppercase italic tracking-widest text-[11px]">Resume AI Builder</h3>
                            </div>
                            <p className="text-[#64748B] text-[10px] leading-relaxed uppercase font-bold">Optimization protocols for institutional ATS compatibility.</p>
                            <ArrowRight className="mt-6 w-5 h-5 text-[#64748B] group-hover:text-white group-hover:translate-x-2 transition-all" />
                        </div>
                        <div className="glass-card p-8 border-white/5 bg-[#03040A] rounded-[2.5rem] group cursor-pointer hover:border-[#10B981]/30 transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <Linkedin className="w-6 h-6 text-[#10B981]" />
                                <h3 className="font-black text-white uppercase italic tracking-widest text-[11px]">LinkedIn Node Sync</h3>
                            </div>
                            <p className="text-[#64748B] text-[10px] leading-relaxed uppercase font-bold">Refine your digital ecosystem for corporate visibility.</p>
                            <ArrowRight className="mt-6 w-5 h-5 text-[#64748B] group-hover:text-white group-hover:translate-x-2 transition-all" />
                        </div>
                    </div>
                </div>

                {/* History & Tips */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <h2 className="text-xl font-black text-white uppercase italic tracking-widest px-2">Performance Logs</h2>
                        {sessions.length > 0 ? (
                            sessions.map(s => (
                                <div key={s._id} className="glass-card p-8 border-white/5 rounded-[2rem] bg-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-black text-white italic">{s.score}%</div>
                                        <div>
                                            <p className="font-black text-white uppercase italic tracking-tight">{s.type}</p>
                                            <p className="text-[#64748B] text-[9px] font-bold uppercase tracking-widest mt-1">{new Date(s.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                                </div>
                            ))
                        ) : (
                            <div className="p-10 border-dashed border-2 border-white/5 rounded-[2rem] text-center">
                                <p className="text-[#64748B] text-[10px] font-black uppercase tracking-widest">No previous telemetry detected.</p>
                            </div>
                        )}
                    </div>

                    <div className="glass-card p-10 border-white/5 rounded-[3rem] bg-[#03040A]">
                        <div className="flex items-center gap-4 mb-10">
                            <TrendingUp className="w-6 h-6 text-[#00D4FF]" />
                            <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Growth Vectors</h3>
                        </div>
                        <ul className="space-y-6">
                            {tips?.tips?.map((tip: string, idx: number) => (
                                <li key={idx} className="flex gap-4 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] mt-1.5 shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
                                    <p className="text-[#94A3B8] text-xs font-medium leading-relaxed">{tip}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
