import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import ResumeCourseHero from '../components/dashboard/ResumeCourseHero';
import StatsBentoCard from '../components/dashboard/StatsBentoCard';
import CourseCard from '../components/dashboard/CourseCard';
import AnalyticsCharts from '../components/dashboard/AnalyticsCharts';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ArrowRight, BookOpen, Sparkles, Trophy, TrendingUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { DashboardData, Course } from '../types/dashboard';

const INITIAL_DATA: DashboardData = {
    user: {
        id: '',
        name: 'Student',
        email: '',
        avatar: '',
        role: 'student',
        level: 1,
        xp: 0,
        nextLevelXp: 1000,
        streak: 0,
        rank: 'Novice',
        badges: []
    },
    activeCourses: [],
    upcomingAssignments: [],
    liveSessions: [],
    weeklyActivity: [],
    performance: [],
    certificates: [],
    notifications: []
};

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardData>(INITIAL_DATA);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const [statsRes, enrollmentsRes] = await Promise.all([
                    api.getDashboardStats(),
                    api.getMyEnrollments()
                ]);

                if (statsRes.success && enrollmentsRes.success) {
                    const stats = statsRes.stats;
                    const enrollments = enrollmentsRes.enrollments;

                    const activeCourses: Course[] = enrollments
                        .filter((e: any) => e.course)
                        .map((e: any) => ({
                            id: e.course?._id || e.course?.id || Math.random().toString(),
                            title: e.course?.title || 'Unknown Course',
                            instructor: e.course?.instructor?.name || 'Expert Instructor',
                            thumbnail: e.course?.image || '',
                            progress: e.overallProgress || e.progress || 0,
                            totalLessons: e.course?.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0,
                            completedLessons: e.completedLessons?.length || 0,
                            category: e.course?.category || 'General',
                            lastAccessed: e.lastAccessed || new Date().toISOString(),
                            nextLesson: 'Continue learning...'
                        }));

                    setDashboardData({
                        ...INITIAL_DATA,
                        user: {
                            ...INITIAL_DATA.user,
                            id: user?.id || '',
                            name: user?.name || 'Student',
                            email: user?.email || '',
                            xp: stats.totalXp || 0,
                            rank: stats.rank || 'Novice',
                            streak: stats.learningStreak || 0,
                            level: Math.floor((stats.totalXp || 0) / 1000) + 1,
                        },
                        activeCourses,
                        liveSessions: (stats.upcomingSessions || []).map((s: any, idx: number) => ({
                            id: `live-${idx}`,
                            topic: s.title,
                            course: 'Live Workshop',
                            instructor: 'Mentor',
                            startTime: s.time,
                            duration: '1h',
                            joinUrl: '#'
                        })),
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (isLoading) {
        return (
            <DashboardLayout>
                <DashboardSkeleton />
            </DashboardLayout>
        );
    }

    const data = dashboardData;

    return (
        <DashboardLayout>
            <div className="space-y-12 pb-20">
                {/* Section 1: Top Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {/* Resume Course Hero (Large Bento) */}
                    {data.activeCourses.length > 0 ? (
                        <ResumeCourseHero
                            course={data.activeCourses.sort((a, b) =>
                                new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
                            )[0]}
                        />
                    ) : (
                        <WelcomeCard
                            xp={data.user.xp}
                            rank={data.user.rank}
                            level={data.user.level}
                            progress={data.user.xp % 1000 / 10}
                        />
                    )}

                    {/* Quick Stats Bento Vertical Stack */}
                    <div className="grid grid-cols-1 gap-8 h-full">
                        <StatsBentoCard
                            title="Learning XP"
                            value={data.user.xp.toLocaleString()}
                            subValue={`Rank: ${data.user.rank}`}
                            icon={Trophy}
                            color="bg-amber-500 shadow-amber-200"
                            delay={0.1}
                        />
                        <StatsBentoCard
                            title="Current Streak"
                            value={`${data.user.streak} Days`}
                            subValue="Consistency is key!"
                            icon={Sparkles}
                            color="bg-indigo-600 shadow-indigo-200"
                            delay={0.2}
                        />
                    </div>
                </div>

                {/* Section 2: Active Courses Grid */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Your Course Library</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Continuing Education</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/my-courses')}
                            className="bg-slate-50 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-100 rounded-xl h-12 px-6"
                        >
                            See All My Courses <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    {data.activeCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {data.activeCourses.map((course, idx) => (
                                <CourseCard key={course.id} course={course} index={idx} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-slate-200 shadow-sm">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Ready to begin?</h3>
                            <p className="text-slate-500 font-bold mt-2">Your library is currently empty. Explore our world-class curriculum below.</p>
                            <Button
                                onClick={() => navigate('/courses')}
                                className="mt-8 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl px-12 h-14"
                            >
                                Explore Academy
                            </Button>
                        </div>
                    )}
                </div>

                {/* Section 3: Recommendations/Top Picks (Udemy Style) */}
                <div className="pt-8 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Top Picks for You</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Based on your learning history</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-violet-700 text-white relative overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px]" />
                            <Star className="w-10 h-10 text-white/20 mb-6" />
                            <h3 className="text-2xl font-black uppercase mb-4 leading-tight">Mastering Next.js <br /> Advanced Patterns</h3>
                            <p className="text-indigo-100/70 font-bold text-xs mb-8">Professional Grade Course</p>
                            <Button className="h-10 bg-white text-indigo-600 hover:bg-indigo-50 font-black rounded-xl text-[10px] uppercase tracking-widest px-6">
                                Quick Enrollment
                            </Button>
                        </motion.div>

                        <div className="lg:col-span-2 bg-slate-50 border border-slate-100 rounded-[2.5rem] p-4 flex items-center gap-10">
                            <div className="flex-1 p-6 space-y-4">
                                <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] uppercase px-3 py-1">New Release</Badge>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Full-Stack Architect Pathway</h3>
                                <p className="text-sm font-bold text-slate-500 max-w-sm">Build institutional-grade applications from scratch with our most comprehensive path yet.</p>
                                <Button variant="link" className="p-0 text-indigo-600 font-black uppercase text-[10px] tracking-widest h-auto">
                                    View Syllabus <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                            <div className="hidden xl:block w-64 h-full bg-slate-200 rounded-[2rem] overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800" className="w-full h-full object-cover" alt="Course" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4: Analytics (Bento Bottom) */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    <div className="xl:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Learning Momentum</h2>
                        </div>
                        <AnalyticsCharts activity={data.weeklyActivity} performance={data.performance} />
                    </div>

                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px]" />
                        <div className="relative z-10">
                            <Trophy className="w-10 h-10 text-blue-400 mb-6" />
                            <h3 className="text-xl font-black uppercase mb-2">Architect Milestone</h3>
                            <p className="text-slate-400 font-bold text-xs">Reach 5,000 XP to unlock Expert tier rewards.</p>
                        </div>
                        <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white font-black rounded-xl uppercase tracking-widest text-[10px] mt-8 border border-white/10">
                            Check Milestones
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
