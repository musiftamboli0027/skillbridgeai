import { motion } from 'framer-motion';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, AreaChart, Area
} from 'recharts';
import { BarChart3, Activity } from 'lucide-react';
import type { StudyActivity, PerformanceStat } from '../../types/dashboard';

interface AnalyticsChartsProps {
    activity: StudyActivity[];
    performance: PerformanceStat[];
}

export default function AnalyticsCharts({ activity, performance }: AnalyticsChartsProps) {
    const hasActivity = activity && activity.length > 0;
    const hasPerformance = performance && performance.length > 0;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

            {/* Study Time Area Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm flex flex-col h-[400px] relative overflow-hidden"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Study Intensity</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Daily time investment</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full min-h-0">
                    {hasActivity ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activity}>
                                <defs>
                                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                    cursor={{ stroke: '#4f46e5', strokeWidth: 2, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="hours"
                                    stroke="#4f46e5"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorHours)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6">
                            <Activity className="w-12 h-12 text-slate-100 dark:text-slate-800 mb-4" />
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No activity data yet</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase">Start learning to see your metrics</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Performance Radar/Bar Chart & Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm flex flex-col h-[400px] relative overflow-hidden"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Skill Proficiency</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Based on latest Assessments</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row gap-8">
                    {hasPerformance ? (
                        <>
                            <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={performance} layout="vertical" margin={{ left: -20 }}>
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="subject"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none' }}
                                        />
                                        <Bar
                                            dataKey="score"
                                            fill="#4f46e5"
                                            radius={[0, 8, 8, 0]}
                                            barSize={20}
                                            animationDuration={1500}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="w-full md:w-32 flex flex-col justify-center space-y-4">
                                {performance.map((s) => (
                                    <div key={s.subject} className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.subject}</span>
                                        <span className="text-lg font-black text-slate-900 dark:text-white">{s.score}%</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                            <BarChart3 className="w-12 h-12 text-slate-100 dark:text-slate-800 mb-4" />
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No skill data available</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase">Complete assessments to see proficiency</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
