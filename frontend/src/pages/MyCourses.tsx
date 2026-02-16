import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    Play,
    Clock,
    MoreVertical,
    LayoutGrid,
    List,
    Trophy,
    ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import CourseCard from '../components/dashboard/CourseCard';
import { api } from '../services/api';
import type { Course } from '../types/dashboard';

export default function MyCourses() {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setIsLoading(true);
                const res = await api.getMyEnrollments();
                if (res.success) {
                    const mapped: Course[] = res.enrollments.map((e: any) => ({
                        id: e.course?._id || e.course?.id || Math.random().toString(),
                        title: e.course?.title || 'Unknown Course',
                        instructor: e.course?.instructor?.name || 'Expert Instructor',
                        thumbnail: e.course?.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
                        progress: e.progress || 0,
                        totalLessons: e.course?.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 12,
                        completedLessons: e.completedLessons?.length || 0,
                        category: e.course?.category || 'Development',
                        lastAccessed: e.lastAccessed || new Date().toISOString(),
                        nextLesson: 'Continuing next module...'
                    }));
                    setCourses(mapped);
                }
            } catch (err) {
                console.error('Failed to fetch courses:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const [activeTab, setActiveTab] = useState('All Courses');

    const filteredCourses = courses.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.instructor.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeTab === 'Completed') return c.progress === 100;
        if (activeTab === 'In Progress') return c.progress > 0 && c.progress < 100;

        return true;
    });

    return (
        <DashboardLayout>
            <div className="space-y-10 pb-20">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">My Learning</h1>
                        <p className="text-slate-500 font-bold mt-1">
                            {isLoading ? 'Loading your courses...' : `You have ${courses.length} courses in library`}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search your library..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl w-64 shadow-sm"
                            />
                        </div>

                        <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewMode('grid')}
                                className={cn("h-10 w-10 rounded-lg", viewMode === 'grid' && "bg-slate-100 dark:bg-slate-800 text-indigo-600")}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewMode('list')}
                                className={cn("h-10 w-10 rounded-lg", viewMode === 'list' && "bg-slate-100 dark:bg-slate-800 text-indigo-600")}
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>

                        <Button variant="outline" className="h-12 px-5 gap-2 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold">
                            <Filter className="w-4 h-4" />
                            Sort By
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {['All Courses', 'In Progress', 'Completed', 'Bookmarked'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-2",
                                activeTab === tab
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Courses Display */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-80 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                        ))}
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course, idx) => (
                            <CourseCard key={course.id} course={course} index={idx} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredCourses.map((course, idx) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-6 hover:shadow-xl transition-all"
                            >
                                <div className="h-24 w-40 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                                    <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 uppercase text-[9px] font-black px-2">{course.category}</Badge>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <Trophy className="w-3 h-3 text-amber-500" />
                                            {course.completedLessons}/{course.totalLessons} Lessons
                                        </span>
                                    </div>
                                    <h3 className="font-black text-xl text-slate-900 dark:text-white truncate uppercase tracking-tight">{course.title}</h3>
                                    <p className="text-xs font-bold text-slate-500 flex items-center gap-2 mt-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        Next Up: {course.nextLesson}
                                    </p>
                                </div>
                                <div className="w-48 space-y-2 hidden md:block">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[10px] font-black uppercase text-slate-400">Progress</span>
                                        <span className="text-xs font-black text-indigo-600">{course.progress}%</span>
                                    </div>
                                    <Progress value={course.progress} className="h-2 bg-slate-50 dark:bg-slate-800" />
                                </div>
                                <div className="flex items-center gap-3 pr-2">
                                    <Button
                                        onClick={() => navigate(course.progress === 100 ? `/certificate/${course.id}` : `/learn/${course.id}`)}
                                        className={cn(
                                            "h-12 w-12 rounded-xl transition-all p-0 shadow-lg active:scale-95",
                                            course.progress === 100
                                                ? "bg-green-500 hover:bg-green-400 text-white shadow-green-900/10"
                                                : "bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-indigo-600 text-white"
                                        )}
                                    >
                                        {course.progress === 100 ? <Trophy className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 rounded-lg">
                                        <MoreVertical className="w-5 h-5" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredCourses.length === 0 && (
                    <div className="py-20 flex flex-col items-center text-center space-y-6">
                        <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-200">
                            <Search className="w-12 h-12" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No courses found</h3>
                            <p className="text-slate-500 font-bold max-w-sm mt-2">We couldn't find any courses matching your search. Try checking your spelling or explore the catalog.</p>
                        </div>
                        <Button
                            onClick={() => navigate('/courses')}
                            className="bg-indigo-600 hover:bg-indigo-500 font-black rounded-xl px-10 h-12 text-white transition-all shadow-xl shadow-indigo-200 dark:shadow-none"
                        >
                            Browse Catalog
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}
