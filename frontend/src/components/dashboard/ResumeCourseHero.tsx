import { motion } from 'framer-motion';
import { Play, Clock, BookOpen, Star, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../../types/dashboard';

interface ResumeCourseHeroProps {
    course: Course;
}

export default function ResumeCourseHero({ course }: ResumeCourseHeroProps) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-1 lg:col-span-2 relative group overflow-hidden rounded-[2.5rem] bg-slate-900 text-white shadow-2xl"
        >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200'}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
            </div>

            <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between min-h-[400px]">
                <div className="space-y-6 max-w-lg">
                    <div className="flex items-center gap-3">
                        <Badge className="bg-blue-500 hover:bg-blue-400 text-white border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Resume Training
                        </Badge>
                        <div className="flex items-center gap-1.5 text-yellow-400">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Top Rated Course</span>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase">
                        {course.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-white/70">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-400" />
                            <span>Module {Math.floor(course.completedLessons / 3) + 1}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span>{course.totalLessons - course.completedLessons} Lessons Left</span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 space-y-6">
                    <div className="max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Current Progress</p>
                                <span className="text-2xl font-black text-white">{course.progress}% Complete</span>
                            </div>
                            <span className="text-xs font-bold text-white/60 italic">
                                {course.completedLessons}/{course.totalLessons} Lessons
                            </span>
                        </div>
                        <Progress value={course.progress} className="h-2 bg-white/10" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            onClick={() => navigate(`/learn/${course.id}`)}
                            className="h-14 px-10 bg-white text-slate-900 hover:bg-blue-50 rounded-2xl font-black uppercase tracking-wider text-xs shadow-xl transition-all active:scale-95 flex items-center gap-3"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            Continue Learning
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/learn/${course.id}`)}
                            className="h-14 px-8 border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 rounded-2xl font-black uppercase tracking-wider text-xs transition-all flex items-center gap-2"
                        >
                            Curriculum
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
