import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Zap, 
    ArrowRight, 
    Plus, 
    Shield, 
    Github, 
    Code, 
    Target,
    Layers,
    Lock
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/button';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function CollaborativeHub() {
    const { user } = useAuth();
    const [view, setView] = useState<'groups' | 'projects' | 'hackathons'>('groups');
    const [groups, setGroups] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [groupsRes, projectsRes] = await Promise.all([
                    api.getGroups(),
                    api.getHubProjects()
                ]);
                if (groupsRes.success) setGroups(groupsRes.data);
                if (projectsRes.success) setProjects(projectsRes.data);
            } catch (error) {
                console.error("Error fetching hub data:", error);
            }
        };
        fetchData();
    }, []);

    const handleCreateGroup = async () => {
        toast.info("Group formation node initialization...");
        try {
            const res = await api.createGroup({ name: "Alpha Squad Node", domain: "Full Stack" });
            if (res.success) {
                setGroups(prev => [...prev, res.data]);
                toast.success("Group node synchronized!");
            }
        } catch (error) {
            toast.error("Process failed.");
        }
    };

    if (user?.year !== '3rd Year' && user?.year !== '4th Year') {
        return (
            <DashboardLayout>
                <div className="h-[80vh] flex flex-col items-center justify-center text-center p-8">
                    <Shield className="w-16 h-16 text-[#EF4444] mb-6" />
                    <h1 className="text-3xl font-black text-white uppercase italic">3rd Year Protocol Required</h1>
                    <p className="text-[#64748B] mt-4 max-w-sm font-bold uppercase tracking-widest text-[10px]">Collaborative Ecosystem node is reserved for Senior Institutional Students.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-12 pb-24 animate-slide-in">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Institutional Hub</h1>
                        <p className="text-[#64748B] mt-2 text-[10px] font-black uppercase tracking-[0.4em]">Ecosystem for Team Formation & Prototyping</p>
                    </div>

                    <div className="flex bg-[#03040A] p-2 rounded-2xl border border-white/5 h-16 w-full lg:w-auto overflow-x-auto whitespace-nowrap">
                        {(['groups', 'projects', 'hackathons'] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`px-8 h-full font-black uppercase tracking-widest text-[10px] rounded-xl transition-all ${
                                    view === v ? "bg-white text-black" : "text-[#64748B] hover:text-white"
                                }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'groups' && (
                        <motion.div 
                            key="groups"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-white uppercase italic tracking-widest px-2 flex items-center gap-4">
                                    <Users className="w-5 h-5 text-[#00D4FF]" /> 
                                    Community Groups
                                </h2>
                                <Button size="sm" className="bg-white/5 border border-white/5 hover:bg-white text-white hover:text-black font-black uppercase tracking-widest text-[9px] h-10 px-6 rounded-lg" onClick={handleCreateGroup}>
                                    <Plus className="w-4 h-4 mr-2" /> Initialize Node
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {groups.map(g => (
                                    <motion.div key={g._id} whileHover={{ y: -5 }} className="glass-card p-10 border-white/5 bg-white/5 rounded-[2.5rem] relative overflow-hidden group">
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">{g.name}</h3>
                                        <p className="text-[#00D4FF] text-[10px] font-black uppercase tracking-widest mt-2 italic">{g.domain} Cluster</p>
                                        <div className="mt-8 flex items-center justify-between">
                                            <div className="flex -space-x-3">
                                                {g.members?.slice(0, 4).map((m: { name: string }, idx: number) => (

                                                    <div key={idx} className="w-8 h-8 rounded-full bg-white/10 border-2 border-black flex items-center justify-center font-black text-[9px] text-white uppercase italic">{m.name?.[0]}</div>
                                                ))}
                                                {g.members?.length > 4 && <div className="w-8 h-8 rounded-full bg-white text-black border-2 border-black flex items-center justify-center font-black text-[9px] uppercase italic">+{g.members.length - 4}</div>}
                                            </div>
                                            <span className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em]">{g.members?.length} Members</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {view === 'projects' && (
                        <motion.div 
                            key="projects"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-white uppercase italic tracking-widest px-2 flex items-center gap-4">
                                    <Layers className="w-5 h-5 text-[#7C3AED]" /> 
                                    Project Simulation
                                </h2>
                                <Button size="sm" className="bg-white/5 border border-white/5 hover:bg-white text-white hover:text-black font-black uppercase tracking-widest text-[9px] h-10 px-6 rounded-lg">
                                    <Plus className="w-4 h-4 mr-2" /> New Project Node
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {projects.map(p => (
                                    <motion.div key={p._id} whileHover={{ y: -5 }} className="glass-card p-10 border-white/5 bg-[#03040A] rounded-[3rem] border relative overflow-hidden">

                                        <div className="flex justify-between items-start mb-10">
                                            <div>
                                                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter lg:text-3xl">{p.title}</h3>
                                                <div className="flex items-center gap-4 mt-4">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic ${
                                                        p.status === 'developing' ? 'bg-[#7C3AED]/20 text-[#7C3AED]' : 'bg-[#10B981]/20 text-[#10B981]'
                                                    }`}>
                                                        {p.status} Node
                                                    </span>
                                                    {p.githubRepo && <Github className="w-5 h-5 text-[#64748B]" />}
                                                </div>
                                            </div>
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                                <Code className="w-6 h-6 text-white" />
                                            </div>
                                        </div>

                                        <p className="text-[#94A3B8] text-sm leading-relaxed font-medium mb-10">{p.description}</p>

                                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                            <div>
                                                <p className="text-[9px] font-black text-[#64748B] uppercase tracking-widest mb-3 italic">Roles & Nodes</p>
                                                <div className="flex gap-4">
                                                    {p.members?.map((m: { user: { name: string }, role: string }, idx: number) => (

                                                        <div key={idx} className="flex items-center gap-3">
                                                            <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-black text-[8px] italic">{m.user?.name?.[0]}</div>
                                                            <span className="text-[10px] font-black text-white uppercase italic">{m.role}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <ArrowRight className="w-6 h-6 text-[#64748B] hover:text-white cursor-pointer transition-all" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {view === 'hackathons' && (
                        <motion.div 
                            key="hackathons"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="flex items-center gap-6 px-2">
                                <Target className="w-8 h-8 text-[#EF4444]" />
                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Institutional Sprints</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-12">
                                <div className="glass-card p-12 lg:p-16 border-[#EF4444]/20 bg-gradient-to-br from-[#EF4444]/10 to-transparent rounded-[4rem] relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                                        <div className="w-32 h-32 rounded-[3rem] bg-[#EF4444] shadow-[0_0_40px_rgba(239,68,68,0.4)] flex items-center justify-center">
                                            <Zap className="w-16 h-16 text-white" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                                <span className="bg-[#EF4444]/20 text-[#EF4444] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic">Live Protocol</span>
                                                <span className="text-[#64748B] text-[10px] font-black uppercase tracking-[0.3em]">End Time: 24:00:00</span>
                                            </div>
                                            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">DeepDev Institutional Sprint</h3>
                                            <p className="text-[#94A3B8] mt-6 text-sm leading-relaxed max-w-2xl font-medium">Coordinate with your Node Squad to prototype high-fidelity SaaS solutions within the institutional ecosystem.</p>
                                            <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
                                                <Button size="lg" className="h-16 px-12 bg-white text-black hover:bg-[#EF4444] hover:text-white font-black rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all">
                                                    Initialize Squad
                                                </Button>
                                                <Button size="lg" variant="ghost" className="h-16 px-12 text-[#64748B] hover:text-white font-black uppercase tracking-[0.2em] text-[11px] transition-all">
                                                    Protocol details
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#EF4444]/15 blur-[120px] pointer-events-none rounded-full" />
                                </div>

                                <div className="p-12 border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center text-center opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                                    <Lock className="w-12 h-12 text-[#64748B] mb-8" />
                                    <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Upcoming Synchronizations</h4>
                                    <p className="text-[#64748B] text-[10px] uppercase font-bold tracking-[0.3em] mt-4">Monitoring institutional corporate calendar for new sprint nodes...</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
