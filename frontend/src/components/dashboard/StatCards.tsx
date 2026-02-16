import { motion } from 'framer-motion';
import { Flame, Star, Zap, Award } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardsProps {
    streak?: number;
    xp?: number;
    coursesCount?: number;
    badgesCount?: number;
}

export default function StatCards({
    streak = 0,
    xp = 0,
    coursesCount = 0,
    badgesCount = 0
}: StatCardsProps) {
    const stats = [
        { label: 'Learning Streak', value: `${streak} Days`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20', shadow: 'shadow-orange-100', detail: 'Consistent Learner' },
        { label: 'Earned XP', value: xp.toLocaleString(), icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/20', shadow: 'shadow-yellow-100', detail: 'Achievement Unlocked' },
        { label: 'Courses Done', value: coursesCount.toString().padStart(2, '0'), icon: Star, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/20', shadow: 'shadow-indigo-100', detail: 'Active Learning' },
        { label: 'Skill Badges', value: badgesCount.toString().padStart(2, '0'), icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20', shadow: 'shadow-emerald-100', detail: 'Expert Status' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                        "bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl group cursor-default",
                        stat.shadow
                    )}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300", stat.bg)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{stat.detail}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
