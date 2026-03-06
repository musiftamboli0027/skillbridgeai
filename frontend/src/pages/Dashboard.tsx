import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    BookOpen, FileCode, TrendingUp, Trophy,
    ArrowUpRight, ArrowDownRight, Activity,
    Target, Flame, GraduationCap, Code2, Briefcase
} from 'lucide-react';
import {
    XAxis, YAxis, ResponsiveContainer, Tooltip,
    AreaChart, Area
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ── mock weekly activity for the chart ── */
const weeklyStudyData = [
    { date: 'Mon', hours: 2.5, lessons: 4 },
    { date: 'Tue', hours: 3.2, lessons: 5 },
    { date: 'Wed', hours: 1.8, lessons: 3 },
    { date: 'Thu', hours: 4.0, lessons: 7 },
    { date: 'Fri', hours: 3.5, lessons: 6 },
    { date: 'Sat', hours: 1.2, lessons: 2 },
    { date: 'Sun', hours: 0.8, lessons: 1 },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalXp: 0,
        rank: 'Novice',
        learningStreak: 0,
        totalCourses: 0,
        completedLessons: 0,
        totalLessons: 0,
        avgProgress: 0,
    });

    useEffect(() => {
        if (user?.role === 'recruiter') {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [statsRes, enrollRes] = await Promise.all([
                    api.getDashboardStats(),
                    api.getMyEnrollments()
                ]);

                if (statsRes.success) {
                    const s = statsRes.stats;
                    setStats({
                        totalXp: s.totalXp || 0,
                        rank: s.rank || 'Novice',
                        learningStreak: s.learningStreak || 0,
                        totalCourses: s.enrolledCourses || 0,
                        completedLessons: s.completedLessons || 0,
                        totalLessons: s.totalLessons || 0,
                        avgProgress: s.avgProgress || 0,
                    });
                }

                if (enrollRes.success) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const courses = enrollRes.enrollments
                        .filter((e: any) => e.course)
                        .map((e: any) => ({
                            id: (typeof e.course === 'string' ? e.course : (e.course?._id || e.course?.id)) || '',
                            title: e.course?.title || 'Unknown Course',
                            instructor: e.course?.instructor?.name || 'Instructor',
                            progress: e.overallProgress || e.progress || 0,
                            totalLessons: (e.course?.modules || []).reduce(
                                (acc: number, m: any) => acc + (m.lessons?.length || 0), 0
                            ) || (e.course?.weeks || []).reduce(
                                (acc: number, w: any) =>
                                    acc + (w.modules || []).reduce(
                                        (mAcc: number, m: any) => mAcc + (m.lessons?.length || 0), 0
                                    ), 0
                            ) || 0,
                            completedLessons: e.completedLessons?.length || 0,
                            category: e.course?.category || 'General',
                            lastAccessed: e.lastAccessed || new Date().toISOString(),
                        }))
                        .filter((c: any) => c.id);
                    setEnrolledCourses(courses);
                }
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    /* ── Stat cards config ── */
    const statCards = [
        {
            label: 'Enrolled Courses',
            value: stats.totalCourses || enrolledCourses.length,
            change: `+${enrolledCourses.length > 0 ? enrolledCourses.length : 0}`,
            trend: 'up' as const,
            icon: BookOpen,
            color: '#00D4FF',
        },
        {
            label: 'Completed Lessons',
            value: stats.completedLessons,
            change: `${stats.completedLessons > 0 ? '+' + stats.completedLessons : '0'}`,
            trend: 'up' as const,
            icon: FileCode,
            color: '#7C3AED',
        },
        {
            label: 'Total XP Earned',
            value: stats.totalXp.toLocaleString(),
            change: '+120',
            trend: 'up' as const,
            icon: Trophy,
            color: '#10B981',
        },
        {
            label: 'Avg. Progress',
            value: `${stats.avgProgress || (enrolledCourses.length > 0
                ? Math.round(enrolledCourses.reduce((a, c) => a + c.progress, 0) / enrolledCourses.length)
                : 0)}%`,
            change: '+5%',
            trend: 'up' as const,
            icon: TrendingUp,
            color: '#F59E0B',
        },
    ];

    /* ── Loading skeleton ── */
    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="h-8 w-64 bg-white/5 rounded-lg" />
                    <div className="h-4 w-96 bg-white/5 rounded-lg" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-white/5 rounded-2xl" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 h-80 bg-white/5 rounded-2xl" />
                        <div className="h-80 bg-white/5 rounded-2xl" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (user?.role === 'recruiter') {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-500">
                    <div className="w-20 h-20 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mb-6">
                        <Briefcase className="w-10 h-10 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Account Pending Approval</h1>
                    <p className="text-[#94A3B8] max-w-lg mb-8">
                        Your enterprise recruiter account is currently being reviewed by our administration team. 
                        Once approved, you will unlock full access to the SkillBridge Hiring Dashboard to post internships and source verified candidates.
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors border border-white/10"
                    >
                        Refresh Status
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-slide-in">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Welcome back, {user?.name || 'Student'} 👋
                    </h1>
                    <p className="text-[#94A3B8] mt-1 text-sm font-medium">
                        Here's an overview of your learning journey
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, idx) => {
                        const Icon = stat.icon;
                        const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
                        return (
                            <div key={idx} className="glass-card p-5">
                                <div className="flex items-start justify-between">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: `${stat.color}20` }}
                                    >
                                        <Icon size={20} style={{ color: stat.color }} />
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                                        <TrendIcon size={16} />
                                        {stat.change}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-sm text-[#94A3B8] font-medium">{stat.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content: Chart + Side Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Study Activity Chart */}
                    <div className="lg:col-span-2 glass-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-medium">Study Activity</h3>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded-lg text-xs bg-[#00D4FF]/10 text-[#00D4FF]">Week</button>
                                <button className="px-3 py-1 rounded-lg text-xs bg-white/5 text-[#94A3B8] hover:bg-white/10">Month</button>
                                <button className="px-3 py-1 rounded-lg text-xs bg-white/5 text-[#94A3B8] hover:bg-white/10">Year</button>
                            </div>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyStudyData}>
                                    <defs>
                                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#0A0E1A',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            borderRadius: '12px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="hours"
                                        name="Study Hours"
                                        stroke="#00D4FF"
                                        fillOpacity={1}
                                        fill="url(#colorHours)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="lessons"
                                        name="Lessons Done"
                                        stroke="#7C3AED"
                                        fillOpacity={1}
                                        fill="url(#colorLessons)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Side Panel */}
                    <div className="space-y-4">
                        {/* Streak & Rank */}
                        <div className="glass-card p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-medium">Learning Streak</h3>
                                <Flame size={16} className="text-[#F59E0B]" />
                            </div>
                            <div className="text-center py-4">
                                <p className="text-4xl font-bold text-white">{stats.learningStreak}<span className="text-lg text-[#94A3B8] ml-1">days</span></p>
                                <p className="text-sm text-[#94A3B8] mt-1 font-medium">Current streak</p>
                            </div>
                            <div className="space-y-2 mt-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#94A3B8]">Rank</span>
                                    <span className="text-white font-medium">{stats.rank}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#94A3B8]">Level</span>
                                    <span className="text-white font-medium">{Math.floor(stats.totalXp / 1000) + 1}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#94A3B8]">Total XP</span>
                                    <span className="text-white font-medium">{stats.totalXp.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Tutor Usage */}
                        <div className="glass-card p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-medium">AI Tutor</h3>
                                <Activity size={16} className="text-[#7C3AED]" />
                            </div>
                            <div className="text-center py-4">
                                <p className="text-4xl font-bold text-white">24m</p>
                                <p className="text-sm text-[#94A3B8] mt-1 font-medium">Avg. study session</p>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-4">
                                <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#00D4FF] rounded-full" style={{ width: '65%' }} />
                            </div>
                            <p className="text-xs text-[#64748B] mt-2">Keep it up! You're above average</p>
                        </div>
                    </div>
                </div>

                {/* Enrolled Courses Table */}
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-medium">My Courses</h3>
                        <button
                            onClick={() => navigate('/courses')}
                            className="text-sm text-[#10B981] font-bold hover:underline"
                        >
                            Browse courses
                        </button>
                    </div>
                    {enrolledCourses.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs text-[#64748B] uppercase tracking-wider">
                                        <th className="pb-3 font-bold">Course</th>
                                        <th className="pb-3 font-bold">Category</th>
                                        <th className="pb-3 font-bold">Lessons</th>
                                        <th className="pb-3 font-bold">Progress</th>
                                        <th className="pb-3 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {enrolledCourses.map((course) => {
                                        const pct = course.progress || 0;
                                        const statusLabel = pct >= 100 ? 'Completed' : pct > 0 ? 'In Progress' : 'Not Started';
                                        const statusColor = pct >= 100
                                            ? 'bg-[#10B981]/20 text-[#10B981]'
                                            : pct > 0
                                                ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                                                : 'bg-[#64748B]/20 text-[#64748B]';
                                        return (
                                            <tr
                                                key={course.id}
                                                className="border-t border-white/5 cursor-pointer hover:bg-white/5 transition-colors"
                                                onClick={() => navigate(`/learn/${course.id}`)}
                                            >
                                                <td className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold">
                                                            <GraduationCap size={14} />
                                                        </div>
                                                        <span className="text-white font-medium">{course.title}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-[#94A3B8] font-medium">{course.category}</td>
                                                <td className="py-3 text-[#94A3B8] font-medium">
                                                    {course.completedLessons}/{course.totalLessons}
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden max-w-[100px]">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7C3AED] rounded-full transition-all"
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-white text-xs font-bold">{pct}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                                                        {statusLabel}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <BookOpen size={28} className="text-[#64748B]" />
                            </div>
                            <h3 className="text-lg font-bold text-white">No courses yet</h3>
                            <p className="text-[#64748B] text-sm mt-2 max-w-sm mx-auto">
                                Enroll in a course to start your learning journey and track progress here.
                            </p>
                            <button
                                onClick={() => navigate('/courses')}
                                className="mt-6 px-8 py-3 bg-[#10B981] hover:bg-[#10B981]/80 text-white rounded-xl font-bold text-sm transition-all"
                            >
                                Browse Courses
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Actions Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/courses')}
                        className="glass-card p-5 flex items-center gap-4 hover:bg-white/5 transition-colors group text-left"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <BookOpen size={18} className="text-[#00D4FF]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Explore Courses</p>
                            <p className="text-xs text-[#94A3B8]">Find new courses to learn</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate(enrolledCourses.length > 0 ? `/learn/${enrolledCourses[0].id}` : '/courses')}
                        className="glass-card p-5 flex items-center gap-4 hover:bg-white/5 transition-colors group text-left"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Code2 size={18} className="text-[#7C3AED]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Continue Learning</p>
                            <p className="text-xs text-[#94A3B8]">Resume where you left off</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/dashboard/career')}
                        className="glass-card p-5 flex items-center gap-4 hover:bg-white/5 transition-colors group text-left"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Target size={18} className="text-[#10B981]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Career Path</p>
                            <p className="text-xs text-[#94A3B8]">Explore your career roadmap</p>
                        </div>
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
