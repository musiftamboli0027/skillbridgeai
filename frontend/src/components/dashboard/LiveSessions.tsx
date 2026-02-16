import { motion } from 'framer-motion';
import { Video, ArrowRight, Play } from 'lucide-react';
import { Button } from '../ui/button';
import type { LiveSession } from '../../types/dashboard';

import { useNavigate } from 'react-router-dom';

interface LiveSessionsProps {
    sessions: LiveSession[];
}

export default function LiveSessions({ sessions }: LiveSessionsProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 flex flex-col h-full shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 flex items-center justify-center">
                        <Video className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Live Classes</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Upcoming for You</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase animate-pulse">
                    Live Now
                </div>
            </div>

            <div className="space-y-4">
                {sessions.length > 0 ? (
                    sessions.map((session, idx) => {
                        const sessionDate = new Date(session.startTime);
                        const isValidDate = !isNaN(sessionDate.getTime());

                        return (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-transparent hover:border-rose-200 dark:hover:border-rose-900/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
                                        <Play className="w-5 h-5 text-rose-600 fill-rose-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight mb-1 uppercase tracking-tight">{session.topic}</h4>
                                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                                            <span className="text-indigo-600">{session.course}</span>
                                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span>{session.duration}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Starts At</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">
                                            {isValidDate ? sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : session.startTime}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => navigate('/dashboard/live')}
                                        className="rounded-xl h-11 px-6 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest shadow-lg shadow-rose-200 dark:shadow-none transition-all active:scale-95"
                                    >
                                        Join
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center mx-auto mb-4">
                            <Video className="w-6 h-6 text-rose-500" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No sessions scheduled for today</p>
                    </div>
                )}
            </div>

            <Button
                variant="ghost"
                onClick={() => navigate('/dashboard/live')}
                className="mt-6 w-full text-slate-500 font-bold hover:text-indigo-600 rounded-xl py-6 border-2 border-dashed border-slate-100 dark:border-slate-800 hover:border-indigo-200 group uppercase tracking-widest text-xs"
            >
                Full Schedule
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
        </div>
    );
}
