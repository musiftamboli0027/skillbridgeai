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
import { Badge } from '../components/ui/badge';
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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Assignments</h1>
                        <p className="text-slate-500 font-bold mt-1">Manage your course projects and submission deadlines</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search assignments..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl w-64 shadow-sm"
                            />
                        </div>
                        <Button className="h-12 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl gap-2 px-6 shadow-xl shadow-indigo-200 dark:shadow-none">
                            <Plus className="w-4 h-4" />
                            New Project
                        </Button>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {['All Assignments', 'Pending', 'Submitted', 'Graded', 'Overdue'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-2",
                                activeTab === tab
                                    ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900 dark:border-white"
                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Assignments List */}
                <div className="space-y-6">
                    {filteredAssignments.length > 0 ? (
                        filteredAssignments.map((assignment, idx) => (
                            <motion.div
                                key={assignment.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-8">

                                    {/* Info Section */}
                                    <div className="flex-1 flex gap-6">
                                        <div className={cn(
                                            "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 border-2",
                                            assignment.priority === 'high' ? "bg-rose-50 border-rose-100 text-rose-600" :
                                                assignment.priority === 'medium' ? "bg-amber-50 border-amber-100 text-amber-600" :
                                                    "bg-indigo-50 border-indigo-100 text-indigo-600"
                                        )}>
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <Badge className={cn(
                                                    "uppercase text-[9px] font-black px-2 py-0.5",
                                                    assignment.priority === 'high' ? "bg-rose-100 text-rose-600 border-rose-200" :
                                                        assignment.priority === 'medium' ? "bg-amber-100 text-amber-600 border-amber-200" :
                                                            "bg-indigo-100 text-indigo-600 border-indigo-200"
                                                )}>
                                                    {assignment.priority} Priority
                                                </Badge>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{assignment.course}</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                                                {assignment.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                                <div className="flex items-center gap-1.5 text-rose-500">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Deadline: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status & Actions Section */}
                                    <div className="flex flex-wrap items-center gap-6 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-10">
                                        <div className="text-center lg:text-left min-w-[120px]">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Current Status</p>
                                            <div className="flex items-center gap-2 justify-center lg:justify-start">
                                                {assignment.status === 'pending' ? (
                                                    <>
                                                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase">Awaiting Submission</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                        <span className="text-sm font-black text-emerald-500 uppercase">Submitted</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Button variant="outline" className="h-12 px-5 gap-2 rounded-xl border-slate-200 dark:border-slate-800 font-bold bg-white dark:bg-slate-900 group/btn hover:border-indigo-600 hover:text-indigo-600 transition-all">
                                                <Download className="w-4 h-4" />
                                                Brief
                                            </Button>
                                            <Button className="h-12 px-8 bg-slate-900 dark:bg-white dark:text-slate-900 font-black rounded-xl gap-2 shadow-lg hover:bg-indigo-600 transition-all active:scale-95">
                                                {assignment.status === 'pending' ? 'Submit Project' : 'View Submission'}
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 p-20 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 dark:text-slate-700 shadow-sm">
                                <FileText className="w-12 h-12" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No assignments yet</h3>
                                <p className="text-slate-500 font-bold max-w-sm mx-auto mt-2">When you enroll in courses and teachers assign projects, they will appear here.</p>
                            </div>
                            <Button
                                onClick={() => window.location.hash = '#/courses'}
                                className="h-14 font-black rounded-2xl px-10 bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-100 dark:shadow-none"
                            >
                                Browse Courses
                            </Button>
                        </div>
                    )}
                </div>

                {/* Extra Project Card */}
                {filteredAssignments.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 p-20 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 rounded-[2rem] bg-white dark:bg-slate-800 flex items-center justify-center text-slate-200 dark:text-slate-700 shadow-sm">
                            <Plus className="w-12 h-12" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Need a challenge?</h3>
                            <p className="text-slate-500 font-bold max-w-sm mx-auto mt-2">Request an extra credit project or a mock assessment from your instructors.</p>
                        </div>
                        <Button variant="outline" className="h-12 font-bold rounded-xl px-10 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">Request Project</Button>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}
