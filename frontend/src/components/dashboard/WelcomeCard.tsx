import { motion } from 'framer-motion';
import { Sparkles, Trophy, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Progress } from '../ui/progress';

interface WelcomeCardProps {
    xp?: number;
    level?: number;
    rank?: string;
    progress?: number;
}

export default function WelcomeCard({
    xp = 0,
    level = 1,
    rank = 'Novice',
    progress = 0
}: WelcomeCardProps) {
    const { user } = useAuth();

    // Mock motivational quotes
    const quotes = [
        "The best way to predict the future is to create it.",
        "Your only limit is your mind.",
        "Consistency is the key to mastery.",
        "Small steps every day lead to big results."
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-indigo-600 to-violet-700 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none"
        >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
            <Sparkles className="absolute top-6 right-8 w-12 h-12 text-white/20 animate-pulse" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-4 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        <span>Welcome Back, {rank}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                        Keep Pushing, <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-100 uppercase">
                            {user?.name || 'Academic'}
                        </span>
                    </h1>
                    <p className="text-indigo-100/80 font-medium italic text-sm md:text-base border-l-2 border-indigo-400/50 pl-4 py-1">
                        "{quote}"
                    </p>
                </div>

                <div className="w-full md:w-auto shrink-0 bg-white/10 backdrop-blur-xl rounded-[1.5rem] p-6 border border-white/20 shadow-xl min-w-[280px]">
                    <div className="flex justify-between items-end mb-4">
                        <div className="space-y-1">
                            <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Level {level}</p>
                            <h3 className="text-2xl font-black">{xp.toLocaleString()} <span className="text-xs opacity-60 uppercase">XP</span></h3>
                        </div>
                        <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                            <span>Progress to Lvl {level + 1}</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2.5 bg-white/10" />
                        <p className="text-[10px] text-center opacity-70 font-bold uppercase tracking-widest pt-1">
                            {rank === 'Master' ? "You've reached the top rank!" : `Level up to unlock new perks`}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
