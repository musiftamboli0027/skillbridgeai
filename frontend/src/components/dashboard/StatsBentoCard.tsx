import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatsBentoCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon: LucideIcon;
    color: string;
    className?: string;
    delay?: number;
}

export default function StatsBentoCard({
    title,
    value,
    subValue,
    icon: Icon,
    color,
    className,
    delay = 0
}: StatsBentoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
            className={cn(
                "bg-white rounded-[2rem] p-8 border border-slate-100 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative group",
                className
            )}
        >
            <div className={cn("absolute -top-4 -right-4 w-24 h-24 blur-3xl rounded-full opacity-20", color)} />

            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-50", color.includes('bg-') ? color : 'bg-slate-50')}>
                <Icon className={cn("w-7 h-7 text-white", !color.includes('bg-') && color)} />
            </div>

            <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
                {subValue && <p className="text-xs font-bold text-slate-500 italic">{subValue}</p>}
            </div>
        </motion.div>
    );
}
