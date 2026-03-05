import { Users, Clock, Target, Zap } from 'lucide-react';
import { mockAnalytics } from '../../data/mockData';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export function AnalyticsView() {
    const engagementData = [
        { time: '00:00', active: 45 },
        { time: '04:00', active: 12 },
        { time: '08:00', active: 234 },
        { time: '12:00', active: 456 },
        { time: '16:00', active: 389 },
        { time: '20:00', active: 298 },
    ];

    const completionData = [
        { name: 'Completed', value: 78, color: '#10B981' },
        { name: 'In Progress', value: 18, color: '#00D4FF' },
        { name: 'Not Started', value: 4, color: '#64748B' },
    ];

    return (
        <div className="space-y-6 animate-slide-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <p className="text-[#94A3B8] mt-1 text-sm font-medium">Detailed insights into learning activity</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Active Students" value="1,240" change="+12%" color="#00D4FF" />
                <StatCard icon={Clock} label="Avg. Session" value="24m" change="+8%" color="#7C3AED" />
                <StatCard icon={Target} label="Completion Rate" value="78%" change="+4%" color="#10B981" />
                <StatCard icon={Zap} label="AI Interactions" value="15.4K" change="+23%" color="#F59E0B" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-5">
                    <h3 className="text-white font-bold mb-4">Daily Engagement</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={engagementData}>
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#0A0E1A',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Line type="monotone" dataKey="active" stroke="#00D4FF" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-5">
                    <h3 className="text-white font-bold mb-4">Course Completion</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={completionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    dataKey="value"
                                    paddingAngle={5}
                                >
                                    {completionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: '#0A0E1A',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        borderRadius: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        {completionData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-card p-5">
                <h3 className="text-white font-bold mb-4">Course Performance</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockAnalytics.courseProgress}>
                            <XAxis dataKey="courseName" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    background: '#0A0E1A',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '12px'
                                }}
                            />
                            <Bar dataKey="avgProgress" fill="#00D4FF" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, change, color }: any) {
    return (
        <div className="glass-card p-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={20} style={{ color }} />
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-[#94A3B8] font-bold uppercase tracking-widest text-[10px]">{label}</p>
                <p className="text-xs text-[#10B981] font-bold mt-1">{change}</p>
            </div>
        </div>
    );
}
