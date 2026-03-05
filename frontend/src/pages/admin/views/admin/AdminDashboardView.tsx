import {
    Users, BookOpen, FileCode, TrendingUp,
    ArrowUpRight, ArrowDownRight, Clock, Activity
} from 'lucide-react';
import { mockAnalytics, mockSubmissions } from '../../data/mockData';
import { XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';

export function AdminDashboardView() {
    const stats = [
        {
            label: 'Active Students',
            value: '1,240',
            change: '+12%',
            trend: 'up',
            icon: Users,
            color: '#00D4FF'
        },
        {
            label: 'Total Courses',
            value: '45',
            change: '+3',
            trend: 'up',
            icon: BookOpen,
            color: '#7C3AED'
        },
        {
            label: 'Submissions Today',
            value: '47',
            change: '-5%',
            trend: 'down',
            icon: FileCode,
            color: '#10B981'
        },
        {
            label: 'Avg. Completion',
            value: '78%',
            change: '+4%',
            trend: 'up',
            icon: TrendingUp,
            color: '#F59E0B'
        },
    ];

    const recentSubmissions = mockSubmissions.slice(0, 5);

    return (
        <div className="space-y-6 animate-slide-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">University Dashboard</h1>
                <p className="text-[#94A3B8] mt-1 text-sm font-medium">Overview of your university's learning activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
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

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Chart */}
                <div className="lg:col-span-2 glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-medium">Student Activity</h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 rounded-lg text-xs bg-[#00D4FF]/10 text-[#00D4FF]">Week</button>
                            <button className="px-3 py-1 rounded-lg text-xs bg-white/5 text-[#94A3B8] hover:bg-white/10">Month</button>
                            <button className="px-3 py-1 rounded-lg text-xs bg-white/5 text-[#94A3B8] hover:bg-white/10">Year</button>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockAnalytics.weeklyActivity}>
                                <defs>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAssignments" x1="0" y1="0" x2="0" y2="1">
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
                                    dataKey="students"
                                    name="Active Students"
                                    stroke="#00D4FF"
                                    fillOpacity={1}
                                    fill="url(#colorStudents)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="assignments"
                                    name="Submissions"
                                    stroke="#7C3AED"
                                    fillOpacity={1}
                                    fill="url(#colorAssignments)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-4">
                    {/* AI Usage */}
                    <div className="glass-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-medium">AI Tutor Usage</h3>
                            <Activity size={16} className="text-[#7C3AED]" />
                        </div>
                        <div className="text-center py-4">
                            <p className="text-4xl font-bold text-white">15.4K</p>
                            <p className="text-sm text-[#94A3B8] mt-1 font-medium">Interactions this month</p>
                        </div>
                        <div className="space-y-2 mt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#94A3B8]">Questions asked</span>
                                <span className="text-white">8,234</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#94A3B8]">Code reviews</span>
                                <span className="text-white">3,456</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#94A3B8]">Hints given</span>
                                <span className="text-white">3,710</span>
                            </div>
                        </div>
                    </div>

                    {/* Session Time */}
                    <div className="glass-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-medium">Avg. Session Time</h3>
                            <Clock size={16} className="text-[#10B981]" />
                        </div>
                        <div className="text-center py-4">
                            <p className="text-4xl font-bold text-white">24m</p>
                            <p className="text-sm text-[#94A3B8] mt-1 font-medium">Per student per day</p>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-4">
                            <div className="h-full bg-gradient-to-r from-[#10B981] to-[#00D4FF] rounded-full" style={{ width: '68%' }} />
                        </div>
                        <p className="text-xs text-[#64748B] mt-2">+8% from last month</p>
                    </div>
                </div>
            </div>

            {/* Recent Submissions */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">Recent Submissions</h3>
                    <button className="text-sm text-[#10B981] font-bold hover:underline">View all</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-[#64748B] uppercase tracking-wider">
                                <th className="pb-3 font-bold">Student</th>
                                <th className="pb-3 font-bold">Assignment</th>
                                <th className="pb-3 font-bold">Course</th>
                                <th className="pb-3 font-bold">Submitted</th>
                                <th className="pb-3 font-bold">Status</th>
                                <th className="pb-3 font-bold">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {recentSubmissions.map((submission) => (
                                <tr key={submission.id} className="border-t border-white/5">
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold">
                                                {submission.studentName.charAt(0)}
                                            </div>
                                            <span className="text-white font-medium">{submission.studentName}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-[#94A3B8] font-medium">Dashboard Layout</td>
                                    <td className="py-3 text-[#94A3B8] font-medium">Full-Stack Web</td>
                                    <td className="py-3 text-[#94A3B8] font-medium">
                                        {new Date(submission.submittedAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${submission.status === 'graded'
                                                ? 'bg-[#10B981]/20 text-[#10B981]'
                                                : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                                            }`}>
                                            {submission.status}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        {submission.grade ? (
                                            <span className="text-[#10B981] font-bold">{submission.grade}/100</span>
                                        ) : (
                                            <span className="text-[#64748B]">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
