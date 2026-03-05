import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Target, 
    TrendingUp, 
    Shield, 
    Clock, 
    Search,
    Brain,
    UserCheck,
    Briefcase
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/button';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PlacementDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [tests, setTests] = useState<any[]>([]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, testsRes] = await Promise.all([
                    api.getPlacementStats(),
                    api.getAptitudeTests()
                ]);
                if (statsRes.success) setStats(statsRes.data);
                if (testsRes.success) setTests(testsRes.data);
            } catch (error) {
                console.error("Error fetching placement data:", error);
            }
        };

        if (user?.year === '4th Year') {
            fetchData();
        }
    }, [user]);

    if (user?.year !== '4th Year') {
        return (
            <DashboardLayout>
                <div className="h-[80vh] flex flex-col items-center justify-center text-center p-8">
                    <Shield className="w-16 h-16 text-[#EF4444] mb-6" />
                    <h1 className="text-3xl font-black text-white uppercase italic">Final Year Protocol Required</h1>
                    <p className="text-[#64748B] mt-4 max-w-sm font-bold uppercase tracking-widest text-[10px]">The Placement Command Center is reserved for 4th Year Students entering the corporate synchronization phase.</p>
                </div>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout>
            <div className="space-y-12 pb-24 animate-slide-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Placement Command</h1>
                        <p className="text-[#64748B] mt-2 text-[10px] font-black uppercase tracking-[0.4em]">Final Phase: Corporate Readiness Node</p>
                    </div>
                    <div className="h-14 px-8 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 backdrop-blur-xl">
                        <TrendingUp className="w-5 h-5 text-[#00D4FF]" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Readiness: {stats?.metrics?.readinessScore}%</span>
                    </div>
                </div>

                {/* Performance Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Metrics Cards */}
                        <div className="glass-card p-10 border-white/5 bg-[#03040A] rounded-[2.5rem] relative overflow-hidden group">
                           <Brain className="w-8 h-8 text-[#00D4FF] mb-6" />
                           <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{stats?.metrics?.avgScore}%</h3>
                           <p className="text-[#64748B] text-[9px] font-black uppercase tracking-widest mt-2 italic">Aptitude Avg</p>
                        </div>
                        <div className="glass-card p-10 border-white/5 bg-[#03040A] rounded-[2.5rem] relative overflow-hidden group">
                           <UserCheck className="w-8 h-8 text-[#10B981] mb-6" />
                           <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{stats?.interviews?.length}</h3>
                           <p className="text-[#64748B] text-[9px] font-black uppercase tracking-widest mt-2 italic">Mock Interviews</p>
                        </div>
                        <div className="glass-card p-10 border-white/5 bg-[#03040A] rounded-[2.5rem] relative overflow-hidden group">
                           <Target className="w-8 h-8 text-[#EF4444] mb-6" />
                           <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{stats?.metrics?.totalTests}</h3>
                           <p className="text-[#64748B] text-[9px] font-black uppercase tracking-widest mt-2 italic">Tests Completed</p>
                        </div>
                    </div>

                    <div className="glass-card p-10 border-white/5 bg-[#03040A] rounded-[2.5rem]">
                        <h3 className="text-sm font-black text-white uppercase italic tracking-widest mb-8">Career Vectors</h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[9px] font-black text-[#64748B] uppercase tracking-widest mb-3 italic">Primary Strengths</p>
                                <div className="flex flex-wrap gap-2">
                                    {stats?.metrics?.strengths?.map((s: string) => (
                                        <span key={s} className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] text-[8px] font-black rounded-lg uppercase italic border border-[#10B981]/20">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-[#64748B] uppercase tracking-widest mb-3 italic">Growth Nodes</p>
                                <div className="flex flex-wrap gap-2">
                                    {stats?.metrics?.weaknesses?.map((w: string) => (
                                        <span key={w} className="px-3 py-1 bg-[#EF4444]/10 text-[#EF4444] text-[8px] font-black rounded-lg uppercase italic border border-[#EF4444]/20">{w}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aptitude & Interviews Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Aptitude Sessions */}
                    <div className="space-y-10">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-4">
                                <Clock className="w-5 h-5 text-[#00D4FF]" /> 
                                Aptitude Sessions
                            </h2>
                            <Button size="sm" variant="ghost" className="text-[#64748B] hover:text-white font-black uppercase tracking-widest text-[9px]">View All</Button>
                        </div>
                        <div className="space-y-6">
                            {tests.map(test => (
                                <motion.div whileHover={{ x: 5 }} key={test._id} className="glass-card p-8 border-white/5 bg-white/5 rounded-[2.5rem] flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center shadow-xl group-hover:bg-[#00D4FF] group-hover:text-white transition-all">
                                            <Search className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white uppercase italic tracking-tight">{test.title}</h4>
                                            <p className="text-[#64748B] text-[9px] font-black uppercase tracking-widest mt-1">{test.companyName} Template • {test.duration}m</p>
                                        </div>
                                    </div>
                                    <Button size="sm" className="bg-white/5 hover:bg-white text-white hover:text-black font-black uppercase text-[8px] tracking-[0.2em] h-10 px-6 rounded-lg">Initialize</Button>
                                </motion.div>
                            ))}
                            {tests.length === 0 && <p className="text-[#64748B] text-[10px] font-black uppercase text-center py-8">No specific test nodes assigned to your college today.</p>}
                        </div>
                    </div>

                    {/* Interview History */}
                    <div className="space-y-10">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-4">
                                <Briefcase className="w-5 h-5 text-[#7C3AED]" /> 
                                Interview Performance
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {stats?.interviews?.map((i: { _id: string, company: string, createdAt: string, technicalScore: number, hrScore: number, aiFeedback: string }) => (

                                <div key={i._id} className="glass-card p-10 border-white/5 bg-[#03040A] rounded-[3rem] border">

                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{i.company} Node</h4>
                                            <p className="text-[#64748B] text-[9px] font-black uppercase tracking-widest mt-2">{new Date(i.createdAt).toLocaleDateString()} Synchronization</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-white italic">{i.technicalScore}/10</p>
                                                <p className="text-[7px] font-black text-[#64748B] uppercase tracking-widest">Tech</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-white italic">{i.hrScore}/10</p>
                                                <p className="text-[7px] font-black text-[#64748B] uppercase tracking-widest">HR</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[#94A3B8] text-[11px] leading-relaxed italic">{i.aiFeedback}</p>
                                    </div>
                                </div>
                            ))}
                            {stats?.interviews?.length === 0 && (
                                <div className="h-64 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center p-12 opacity-50">
                                    <Target className="w-10 h-10 text-[#64748B] mb-6 animate-pulse" />
                                    <p className="text-[#64748B] text-[10px] font-black uppercase tracking-widest">No previous corporate synchronization logs detected.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
