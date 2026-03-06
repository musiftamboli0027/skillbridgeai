import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    Search, BookOpen, Play, Clock, Trophy,
    GraduationCap
} from 'lucide-react';
import { api } from '../services/api';

interface CourseItem {
    id: string;
    title: string;
    instructor: string;
    thumbnail: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    category: string;
    lastAccessed: string;
}

export default function MyCourses() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setIsLoading(true);
                const res = await api.getMyEnrollments();
                if (res.success) {
                    const mapped: CourseItem[] = res.enrollments
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .filter((e: any) => e.course)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .map((e: any) => ({
                            id: (typeof e.course === 'string' ? e.course : (e.course?._id || e.course?.id)) || '',
                            title: e.course?.title || 'Unknown Course',
                            instructor: e.course?.instructor?.name || 'Instructor',
                            thumbnail: e.course?.image || '',
                            progress: e.overallProgress || e.progress || 0,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            totalLessons: (e.course?.modules || []).reduce(
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (acc: number, m: any) => acc + (m.lessons?.length || 0), 0
                            ) || (e.course?.weeks || []).reduce(
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (acc: number, w: any) =>
                                    acc + (w.modules || []).reduce(
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        (mAcc: number, m: any) => mAcc + (m.lessons?.length || 0), 0
                                    ), 0
                            ) || 0,
                            completedLessons: e.completedLessons?.length || 0,
                            category: e.course?.category || 'General',
                            lastAccessed: e.lastAccessed || new Date().toISOString(),
                        }))
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .filter((c: any) => c.id);
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

    const filteredCourses = courses.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        if (activeTab === 'completed') return c.progress >= 100;
        if (activeTab === 'in-progress') return c.progress > 0 && c.progress < 100;
        return true;
    });

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-slide-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">My Courses</h1>
                        <p className="text-[#94A3B8] mt-1 text-sm font-medium">
                            {isLoading ? 'Loading...' : `${courses.length} enrolled courses`}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/courses')}
                        className="px-6 py-2.5 bg-[#10B981] hover:bg-[#10B981]/80 text-white rounded-xl font-bold text-sm transition-all"
                    >
                        Browse Courses
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#10B981]/50"
                        />
                    </div>
                    <div className="flex gap-2">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'in-progress', label: 'In Progress' },
                            { id: 'completed', label: 'Completed' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                                        : 'bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white border border-white/5'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Courses Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-72 bg-white/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => {
                            const statusLabel = course.progress >= 100 ? 'Completed' : course.progress > 0 ? 'In Progress' : 'Not Started';
                            const statusColor = course.progress >= 100
                                ? 'bg-[#10B981]/20 text-[#10B981]'
                                : course.progress > 0
                                    ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                                    : 'bg-[#64748B]/20 text-[#64748B]';

                            return (
                                <div
                                    key={course.id}
                                    onClick={() => navigate(`/learn/${course.id}`)}
                                    className="glass-card rounded-2xl overflow-hidden cursor-pointer hover:border-white/10 transition-all group"
                                >
                                    {/* Thumbnail */}
                                    <div className="h-40 relative overflow-hidden bg-gradient-to-br from-[#0A0E1A] to-[#1a1f35]">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <GraduationCap size={40} className="text-[#64748B]/30" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#03040A] via-transparent to-transparent" />
                                        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold ${statusColor}`}>
                                            {statusLabel}
                                        </span>
                                        <span className="absolute top-3 left-3 px-2 py-1 bg-[#00D4FF]/10 backdrop-blur-sm text-[#00D4FF] text-[10px] font-bold rounded-lg border border-[#00D4FF]/20">
                                            {course.category}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 space-y-3">
                                        <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-[#00D4FF] transition-colors">
                                            {course.title}
                                        </h3>

                                        <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                                            <span className="flex items-center gap-1">
                                                <Trophy size={12} className="text-[#F59E0B]" />
                                                {course.completedLessons}/{course.totalLessons} lessons
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(course.lastAccessed).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {/* Progress */}
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-[#64748B]">Progress</span>
                                                <span className="text-white font-bold">{course.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7C3AED] rounded-full transition-all"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/learn/${course.id}`);
                                            }}
                                            className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                                course.progress >= 100
                                                    ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                                                    : 'bg-white/5 text-white hover:bg-white/10'
                                            }`}
                                        >
                                            {course.progress >= 100 ? (
                                                <><Trophy size={16} /> View Certificate</>
                                            ) : (
                                                <><Play size={16} /> Continue Learning</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-card p-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <BookOpen size={28} className="text-[#64748B]" />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                            {searchQuery ? 'No courses found' : 'No courses yet'}
                        </h3>
                        <p className="text-[#64748B] text-sm mt-2 max-w-sm mx-auto">
                            {searchQuery
                                ? 'Try a different search term'
                                : 'Enroll in a course to start learning and track your progress here.'
                            }
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => navigate('/courses')}
                                className="mt-6 px-8 py-3 bg-[#10B981] hover:bg-[#10B981]/80 text-white rounded-xl font-bold text-sm transition-all"
                            >
                                Browse Courses
                            </button>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
