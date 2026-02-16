import { motion } from 'framer-motion';
import { User, ArrowRight, Clock } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Course } from '../../types/dashboard';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface CourseCardProps {
    course: Course;
    index: number;
}

export default function CourseCard({ course, index }: CourseCardProps) {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate(`/learn/${course.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-500 flex flex-col h-full relative"
        >
            {/* Thumbnail */}
            <div
                className="h-48 relative overflow-hidden cursor-pointer"
                onClick={handleContinue}
            >
                <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4">
                    <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 font-bold px-3 py-1 text-[10px] uppercase tracking-wider">
                        {course.category}
                    </Badge>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">
                        <User className="w-3 h-3" />
                        <span>{course.instructor}</span>
                    </div>
                    <h3 className="font-black text-lg leading-tight line-clamp-1 group-hover:text-skillbridge-button transition-colors uppercase tracking-tight">
                        {course.title}
                    </h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1 space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery</p>
                            <span className="text-xl font-black text-skillbridge-text">{course.progress}%</span>
                        </div>
                        <span className="text-xs font-bold text-slate-500 italic">
                            {course.completedLessons}/{course.totalLessons} Lessons
                        </span>
                    </div>
                    <div className="relative">
                        <Progress value={course.progress} className="h-2 bg-slate-50" />
                        <motion.div
                            className="absolute -top-1 w-2 h-4 bg-skillbridge-header rounded-full shadow-lg"
                            style={{ left: `${course.progress}%` }}
                        />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-indigo-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Up Next</p>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{course.nextLesson}</p>
                        </div>
                    </div>

                    <div className="pt-2 mt-auto">
                        <Button
                            onClick={course.progress === 100 ? () => navigate(`/certificate/${course.id}`) : handleContinue}
                            className={cn(
                                "w-full h-12 font-black rounded-2xl transition-all shadow-xl group",
                                course.progress === 100
                                    ? "bg-green-500 hover:bg-green-400 text-white shadow-green-900/10"
                                    : "bg-skillbridge-button text-skillbridge-sidebar hover:bg-teal-400 shadow-teal-900/5"
                            )}
                        >
                            {course.progress === 100 ? 'View Certificate' : 'Resume Training'}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Float Badge for 100% completion */}
            {course.progress === 100 && (
                <div className="absolute top-0 right-0 p-4">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                        ✓
                    </div>
                </div>
            )}
        </motion.div>
    );
}
