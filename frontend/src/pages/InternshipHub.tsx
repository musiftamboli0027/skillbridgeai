import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Building2, 
    Shield, 
    Clock, 
    CheckCircle2, 
    Target,
    Users
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/button';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function InternshipHub() {
    const { user } = useAuth();
    const [internships, setInternships] = useState<any[]>([]);


    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const res = await api.getInternships();
                if (res.success) setInternships(res.data);
            } catch (error) {
                console.error("Error fetching internships:", error);
            }
        };
        fetchInternships();
    }, []);

    const handleApply = async (id: string) => {
        try {
            const res = await api.applyForInternship(id);
            if (res.success) {
                toast.success("Initial application protocol launched!");
                setInternships(prev => prev.map(i => i._id === id ? { ...i, applicants: [...i.applicants, { user: user?.id }] } : i));
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
                    <p className="text-[#64748B] mt-4 max-w-sm font-bold uppercase tracking-widest text-[10px]">Internship Matching node is reserved for Senior Institutional Students.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-12 pb-24 animate-slide-in">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Internship Matching</h1>
                        <p className="text-[#64748B] mt-2 text-[10px] font-black uppercase tracking-[0.4em]">Corporate Nodes for Talent Synchronization</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {internships.map((job) => {
                        const hasApplied = job.applicants.some((a: any) => a.user === user?.id);
                        return (
                            <motion.div
                                key={job._id}
                                whileHover={{ y: -5 }}
                                className="glass-card p-10 border-white/5 bg-[#03040A] rounded-[2.5rem] relative overflow-hidden group border"

                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 blur-[60px] group-hover:bg-[#10B981]/10 transition-all" />
                                <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center mb-8 shadow-2xl">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">{job.title}</h3>
                                <p className="text-[#10B981] text-[10px] font-black uppercase tracking-widest mt-2">{job.company}</p>
                                <p className="text-[#64748B] text-xs mt-6 leading-relaxed font-medium line-clamp-3">{job.description}</p>
                                
                                <div className="mt-10 flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-[#64748B]" />
                                        <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">{job.applicants.length} Nodes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#64748B]" />
                                        <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">Initial Sync</span>
                                    </div>
                                </div>

                                <Button 
                                    className={`w-full mt-10 h-14 font-black rounded-xl uppercase tracking-widest text-[10px] transition-all ${
                                        hasApplied 
                                        ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 cursor-default" 
                                        : "bg-white text-black hover:bg-[#10B981] hover:text-white"
                                    }`}
                                    onClick={() => !hasApplied && handleApply(job._id)}
                                >
                                    {hasApplied ? <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Synchronized</span> : "Apply for Matching"}
                                </Button>
                            </motion.div>
                        );
                    })}
                </div>

                {internships.length === 0 && (
                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] text-center p-12">
                        <Target className="w-10 h-10 text-[#64748B] mb-6 animate-pulse" />
                        <p className="text-[#64748B] text-sm font-black uppercase tracking-[0.2em]">Scanning for available corporate nodes...</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
