import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck, User, BookOpen, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifyCertificate() {
    const { enrollmentId } = useParams();
    const [loading, setLoading] = useState(true);
    const [certData, setCertData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/certificates/verify/${enrollmentId}`);
                const res = await response.json();
                if (res.success) {
                    setCertData(res.data);
                } else {
                    setError(res.message);
                }
            } catch (err) {
                setError('Verification service unavailable');
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, [enrollmentId]);

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Authing Blockchain Record...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full"
            >
                {error ? (
                    <div className="glass-card p-12 text-center border-red-500/20 bg-red-500/5">
                        <XCircle size={64} className="text-red-500 mx-auto mb-6" />
                        <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">Verification Denied</h1>
                        <p className="text-slate-400 mt-4 leading-relaxed font-medium">This certificate record could not be found or has been revoked by the SkillBridge registry.</p>
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <button onClick={() => window.location.href = '/'} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Return to Central Hub</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="glass-card p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <ShieldCheck size={120} />
                            </div>

                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                    <ShieldCheck className="text-emerald-400" size={24} />
                                </div>
                                <div>
                                    <h1 className="text-sm font-black text-emerald-400 uppercase tracking-[0.2em] leading-none">Record Verified</h1>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">SkillBridge Global Registry</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <User className="text-indigo-400 shrink-0 mt-1" size={20} />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2">Graduate</p>
                                        <p className="text-2xl font-black text-white tracking-tight">{certData.studentName}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 uppercase">Rank: {certData.rank}</span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 uppercase">{certData.totalXp} XP Earned</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <BookOpen className="text-indigo-400 shrink-0 mt-1" size={20} />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2">Certified Mastery In</p>
                                        <p className="text-xl font-black text-white tracking-tight italic uppercase">{certData.courseTitle}</p>
                                        <p className="text-[11px] font-bold text-slate-500 mt-1">{certData.category} • Advanced Specialization</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Calendar className="text-indigo-400 shrink-0 mt-1" size={20} />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2">Completion Date</p>
                                        <p className="text-sm font-bold text-white uppercase">{new Date(certData.completedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={14} className="text-indigo-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Hash Integrity: Optimal</span>
                                </div>
                                <span className="text-[8px] font-mono text-slate-700">SB-PROTO-V3</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => window.location.href = '/#/courses'}
                                className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs rounded-2xl tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98]"
                            >
                                Enroll in SkillBridge
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
