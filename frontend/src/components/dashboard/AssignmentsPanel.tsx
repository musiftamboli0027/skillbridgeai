import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import type { Assignment } from '../../types/dashboard';

import { useNavigate } from 'react-router-dom';

interface AssignmentsPanelProps {
    assignments: Assignment[];
}

export default function AssignmentsPanel({ assignments }: AssignmentsPanelProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 flex flex-col h-full shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Assignments</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{assignments.length} Projects Pending</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/dashboard/assignments')}
                    className="rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                    <Plus className="w-5 h-5" />
                </Button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                {assignments.length > 0 ? (
                    assignments.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => navigate('/dashboard/assignments')}
                            className="group p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer relative"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge
                                            className={cn(
                                                "uppercase text-[9px] font-black px-2 py-0.5",
                                                item.priority === 'high' ? "bg-rose-100 text-rose-600 border-rose-200" :
                                                    item.priority === 'medium' ? "bg-amber-100 text-amber-600 border-amber-200" :
                                                        "bg-indigo-100 text-indigo-600 border-indigo-200"
                                            )}
                                        >
                                            {item.priority} Priority
                                        </Badge>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.course}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight line-clamp-1">
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Deadline approaching</span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                                        <span className="text-xs font-bold text-slate-400">
                                            {new Date(item.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center h-full">
                                    {item.status === 'pending' ? (
                                        <div className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-indigo-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/10 transition-all">
                                            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-indigo-600 transition-colors" />
                                        </div>
                                    ) : (
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                    )}
                                </div>
                            </div>

                            {/* Upload Hint on hover */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className="absolute inset-0 bg-indigo-600/95 dark:bg-indigo-900/95 rounded-2xl flex items-center justify-center text-white font-bold text-sm gap-2 backdrop-blur-sm pointer-events-none"
                            >
                                <Plus className="w-4 h-4" />
                                Upload Submission
                            </motion.div>
                        </motion.div>
                    ))
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-10 px-6 text-center bg-slate-50/50 dark:bg-slate-800/10 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                            <FileText className="w-6 h-6 text-orange-500" />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">All caught up!</h4>
                        <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">No projects due for submission</p>
                    </div>
                )}
            </div>

            <Button
                variant="outline"
                onClick={() => navigate('/dashboard/assignments')}
                className="w-full mt-6 rounded-xl font-black uppercase tracking-widest border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 h-11 transition-all"
            >
                View All Assignments
            </Button>
        </div>
    );
}
