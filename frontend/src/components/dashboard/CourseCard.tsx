import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Trophy, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import type { Course } from '../../types/dashboard';

interface CourseCardProps {
    course: Course;
    index: number;
}

export default function CourseCard({ course, index }: CourseCardProps) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            onClick={() => navigate(course.progress === 100 ? `/certificate/${course.id}` : `/course/${course.id}/learn`)}
            className="group glass-card rounded-[2rem] border-white/5 overflow-hidden cursor-pointer hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 relative"
        >
            {/* Thumbnail */}
            <div className="h-44 relative overflow-hidden">
                <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03040A] via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#00D4FF]/10 backdrop-blur-md text-[#00D4FF] border border-[#00D4FF]/20 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {course.category}
                </span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-[#00D4FF] transition-colors line-clamp-2">
                    {course.title}
                </h3>

                <div className="flex items-center gap-2 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.2em]">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    {course.completedLessons} <span className="opacity-30">/</span> {course.totalLessons} UNITS
                </div>

                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-[#64748B] tracking-widest">Progress</span>
                        <span className="text-sm font-black text-[#00D4FF] tracking-widest">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7C3AED] rounded-full"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2">
                    <p className="text-[10px] font-bold text-[#64748B] flex items-center gap-1 uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                        {course.nextLesson?.slice(0, 25) || 'Continue'}
                    </p>
                    <Button
                        size="icon"
                        className={`h-10 w-10 rounded-xl transition-all p-0 ${
                            course.progress === 100
                                ? 'bg-[#10B981] hover:bg-[#10B981]/90 text-white'
                                : 'bg-white text-[#0A0E1A] hover:bg-[#00D4FF]'
                        }`}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(course.progress === 100 ? `/certificate/${course.id}` : `/course/${course.id}/learn`);
                        }}
                    >
                        {course.progress === 100 ? <Trophy className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
