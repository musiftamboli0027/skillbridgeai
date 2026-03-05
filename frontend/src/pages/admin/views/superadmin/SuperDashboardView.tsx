import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Globe,
    Building2,
    Shield,
    TrendingUp,
    BookOpen,
    DollarSign,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const universities = [
    { name: 'State Tech', users: 3240, plan: 'Enterprise' },
    { name: 'Design Institute', users: 1890, plan: 'University' },
    { name: 'Business Academy', users: 2156, plan: 'University' },
    { name: 'Arts College', users: 1240, plan: 'Starter' },
];

export function SuperDashboardView() {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.super-card', {
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="space-y-6 animate-slide-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
                <p className="text-[#94A3B8] mt-1 text-sm font-medium">Global view of the SkillBridge AI ecosystem</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="super-card glass-card p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#45B6FF]/20 flex items-center justify-center">
                            <Globe size={18} className="text-[#45B6FF]" />
                        </div>
                        <h3 className="text-sm font-bold text-[#F4F6FB] uppercase tracking-widest">Platform</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">18,420</p>
                    <p className="text-xs text-[#94A3B8] font-bold mt-1">TOTAL USERS</p>
                </div>

                <div className="super-card glass-card p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center">
                            <Building2 size={18} className="text-[#7C3AED]" />
                        </div>
                        <h3 className="text-sm font-bold text-[#F4F6FB] uppercase tracking-widest">Partners</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">12</p>
                    <p className="text-xs text-[#94A3B8] font-bold mt-1">UNIVERSITIES</p>
                </div>

                <div className="super-card glass-card p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
                            <BookOpen size={18} className="text-[#10B981]" />
                        </div>
                        <h3 className="text-sm font-bold text-[#F4F6FB] uppercase tracking-widest">Content</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">340</p>
                    <p className="text-xs text-[#94A3B8] font-bold mt-1">ACTIVE COURSES</p>
                </div>

                <div className="super-card glass-card p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center">
                            <DollarSign size={18} className="text-[#F59E0B]" />
                        </div>
                        <h3 className="text-sm font-bold text-[#F4F6FB] uppercase tracking-widest">Revenue</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">$124.5K</p>
                    <p className="text-xs text-[#94A3B8] font-bold mt-1">MONTHLY MRR</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="super-card glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#45B6FF]/20 flex items-center justify-center">
                                <Building2 size={18} className="text-[#45B6FF]" />
                            </div>
                            <h3 className="text-lg font-bold text-[#F4F6FB]">Top Universities</h3>
                        </div>
                        <button className="text-sm text-[#45B6FF] font-bold hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {universities.map((uni, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                            >
                                <div>
                                    <p className="text-sm text-[#F4F6FB] font-bold">{uni.name}</p>
                                    <p className="text-xs text-[#A6B3D0] font-medium">{uni.users.toLocaleString()} users</p>
                                </div>
                                <span
                                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${uni.plan === 'Enterprise'
                                            ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]'
                                            : uni.plan === 'University'
                                                ? 'bg-[#45B6FF]/20 text-[#45B6FF]'
                                                : 'bg-[#A6B3D0]/20 text-[#A6B3D0]'
                                        }`}
                                >
                                    {uni.plan}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="super-card glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
                                    <Shield size={18} className="text-[#10B981]" />
                                </div>
                                <h3 className="text-lg font-bold text-[#F4F6FB]">System Health</h3>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#94A3B8] font-medium">API Core</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                                    <span className="text-xs font-bold text-[#10B981]">99.9%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#94A3B8] font-medium">AI Service</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                                    <span className="text-xs font-bold text-[#10B981]">OPERATIONAL</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#94A3B8] font-medium">Database</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                                    <span className="text-xs font-bold text-[#10B981]">HEALTHY</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="super-card glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-bold">Global AI Usage</h3>
                            <TrendingUp size={18} className="text-[#7C3AED]" />
                        </div>
                        <div className="text-center py-4">
                            <p className="text-4xl font-bold text-white">4.5M</p>
                            <p className="text-xs text-[#94A3B8] font-bold mt-1 uppercase tracking-widest">Tokens this month</p>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#00D4FF] rounded-full" style={{ width: '72%' }} />
                        </div>
                        <p className="text-[10px] text-[#64748B] font-bold mt-2 uppercase tracking-widest text-center">72% OF MONTHLY QUOTA USED</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
