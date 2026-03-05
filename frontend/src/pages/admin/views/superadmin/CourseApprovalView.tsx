import { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, Clock,
    Eye, ShieldCheck, BookOpen
} from 'lucide-react';
import { api } from '../../../../services/api';
import { toast } from 'sonner';

export function CourseApprovalView() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            // Using existing getCourses with a combined query
            const res = await api.getCourses('?approvalStatus=pending');
            setCourses(res.courses.filter((c: any) => c.approvalStatus === 'pending'));
        } catch (err) {
            toast.error('Failed to fetch pending courses');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await api.approveCourse(id);
            toast.success('Course approved and published');
            fetchPending();
        } catch (err) {
            toast.error('Approval failed');
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Please enter rejection reason:');
        if (!reason) return;

        try {
            await api.rejectCourse(id, reason);
            toast.success('Course rejected');
            fetchPending();
        } catch (err) {
            toast.error('Rejection failed');
        }
    };

    return (
        <div className="space-y-6 animate-slide-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Course Ingestion</h1>
                    <p className="text-[#94A3B8] mt-1 text-sm font-medium">Verify and approve content before public launch</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-[#10B981]/10 rounded-xl border border-[#10B981]/20">
                    <ShieldCheck className="text-[#10B981]" size={18} />
                    <span className="text-xs font-bold text-[#10B981] uppercase tracking-widest">Super Admin Verified</span>
                </div>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-[0.3em]">Scanning Pipeline...</div>
                ) : courses.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <Clock className="mx-auto text-slate-700 mb-4" size={48} />
                        <h3 className="text-white font-bold opacity-50">No pending approvals</h3>
                        <p className="text-xs text-slate-600 mt-1 uppercase tracking-widest">System healthy • Pipeline Clear</p>
                    </div>
                ) : (
                    courses.map((course) => (
                        <div key={course._id} className="glass-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/5">
                                    <BookOpen className="text-indigo-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">{course.title}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                                            {course.category}
                                        </span>
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                            By {course.instructor?.name || 'Academic Partner'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="hidden sm:block text-right">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Creation Date</p>
                                    <p className="text-sm font-bold text-white">{new Date(course.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleReject(course._id)}
                                        className="btn-secondary h-11 px-6 border-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444]/10"
                                    >
                                        <XCircle size={18} /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(course._id)}
                                        className="btn-primary h-11 px-8 shadow-lg shadow-[#10B981]/20"
                                    >
                                        <CheckCircle size={18} /> Approve Course
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
