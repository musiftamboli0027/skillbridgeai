import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    FileText,
    Clock,
    CheckCircle2,
    Plus,
    Search,
    ArrowUpRight,
    Download
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';
import type { Assignment } from '../types/dashboard';

export default function AssignmentsPage() {
    const [assignments] = useState<Assignment[]>([]);
    const [activeTab, setActiveTab] = useState('All Assignments');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAssignments = assignments.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.course.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'All Assignments' ||
            a.status.toLowerCase() === activeTab.toLowerCase();
        return matchesSearch && matchesTab;
    });

    return (
        <DashboardLayout>
            <div className="space-y-10 pb-20">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg w-fit">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Project Management</span>
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">Missions <span className="text-gradient">& LABS</span></h1>
                            <p className="text-[#94A3B8] font-medium mt-2 max-w-xl">Execute complex architectural objectives and validatate your technical proficiency through hands-on labs.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-indigo-400 transition-colors" />
                            <Input
                                placeholder="Search objective ID or course..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 h-14 bg-white/5 border-white/5 rounded-2xl text-white placeholder:text-[#64748B] focus:outline-none focus:border-indigo-500/30 transition-all font-medium"
                            />
                        </div>
                        <Button className="h-14 bg-[#0A0E1A] border border-white/10 hover:bg-white/5 text-white font-bold rounded-2xl px-8 gap-3 uppercase tracking-widest text-[11px] shadow-2xl">
                            <Plus className="w-4 h-4 text-indigo-400 stroke-[3]" />
                            Initiate Project
                        </Button>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-style">
                    {['All Assignments', 'Pending', 'Submitted', 'Graded', 'Overdue'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all border",
                                activeTab === tab
                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_10px_25px_rgba(79,70,229,0.3)]"
                                    : "bg-white/5 border-white/5 text-[#64748B] hover:border-white/10 hover:text-[#94A3B8]"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Assignments List */}
                <div className="space-y-8">
                    {filteredAssignments.length > 0 ? (
                        filteredAssignments.map((assignment, idx) => (
                            <motion.div
                                key={assignment.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card p-8 border-white/5 group hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-10">

                                    {/* Info Section */}
                                    <div className="flex-1 flex gap-8">
                                        <div className={cn(
                                            "w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 border backdrop-blur-xl transition-transform group-hover:scale-105 duration-500",
                                            assignment.priority === 'high' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                                                assignment.priority === 'medium' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                                                    "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                                        )}>
                                            <FileText className="w-10 h-10" />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "uppercase text-[9px] font-bold px-3 py-1 rounded-md border tracking-widest",
                                                    assignment.priority === 'high' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                                        assignment.priority === 'medium' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                            "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                                )}>
                                                    {assignment.priority} Priority
                                                </div>
                                                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.2em]">{assignment.course}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">
                                                {assignment.title}
                                            </h3>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 text-[11px] font-bold text-rose-500 uppercase tracking-widest">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Deadline: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status & Actions Section */}
                                    <div className="flex flex-wrap items-center gap-10 lg:border-l border-white/5 lg:pl-10">
                                        <div className="text-center lg:text-left min-w-[140px]">
                                            <p className="text-[9px] font-bold uppercase text-[#64748B] tracking-[0.2em] mb-2">Network Status</p>
                                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                                {assignment.status === 'pending' ? (
                                                    <>
                                                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                                        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Pending</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                                                        <span className="text-xs font-bold text-[#10B981] uppercase tracking-widest">Secured</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button variant="outline" className="h-14 px-6 gap-3 rounded-2xl border-white/5 font-bold bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest text-[10px]">
                                                <Download className="w-4 h-4 text-indigo-400" />
                                                Specs
                                            </Button>
                                            <Button className="h-14 px-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl gap-3 shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all active:scale-95 uppercase tracking-widest text-[10px] group">
                                                {assignment.status === 'pending' ? 'Initiate Upload' : 'Review Manifest'}
                                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="glass-card border-dashed p-32 flex flex-col items-center justify-center text-center space-y-8">
                            <div className="w-28 h-28 rounded-3xl bg-white/5 flex items-center justify-center text-[#64748B] border border-white/10 shadow-2xl">
                                <FileText className="w-12 h-12 opacity-50" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Zero Objectives</h3>
                                <p className="text-[#94A3B8] font-medium max-w-sm mx-auto mt-2">No missions currently assigned to your coordination point. Enroll in the master curriculum to generate new objectives.</p>
                            </div>
                            <Button
                                onClick={() => window.location.hash = '#/courses'}
                                className="btn-admin h-14 px-12 bg-white/5 text-white border-white/10 hover:bg-white/10"
                            >
                                Explore Curriculum
                            </Button>
                        </div>
                    )}
                </div>

                {/* Extra Project Card */}
                {filteredAssignments.length > 0 && (
                    <div className="glass-card border-dashed p-20 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center text-[#64748B] border border-white/10">
                            <Plus className="w-10 h-10 opacity-50" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Expansion Mission?</h3>
                            <p className="text-[#94A3B8] font-medium max-w-sm mx-auto mt-2">Request an advanced architectural challenge or custom project from your senior coordinator.</p>
                        </div>
                        <Button variant="outline" className="h-14 font-bold rounded-2xl px-12 border-white/5 bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white uppercase tracking-widest text-[10px]">Request Objective</Button>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}
