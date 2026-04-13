import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    User,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Bot,
    Code,
    Compass,
    Github,
    Briefcase,
    FileText,
    Mic,
    TrendingUp,
    GraduationCap,
    Globe
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
}

const NAV_ITEMS = [
    { label: 'Visit Main Site', href: '/', icon: Globe, years: ['1st Year', '2nd Year', '3rd Year', '4th Year'] },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, years: ['1st Year', '2nd Year', '3rd Year', '4th Year'] },
    { label: 'My Courses', href: '/dashboard/courses', icon: BookOpen, years: ['1st Year', '2nd Year', '3rd Year', '4th Year'] },
    { label: 'Practice Lab', href: '/dashboard/practice', icon: Code, years: ['1st Year', '2nd Year', '3rd Year', '4th Year'] },

    // 2nd Year+
    { label: 'Career Explorer', href: '/dashboard/career', icon: Compass, years: ['1st Year', '2nd Year', '3rd Year', '4th Year'] },
    { label: 'Skill Tracker', href: '/dashboard/skills', icon: TrendingUp, years: ['1st Year', '2nd Year', '3rd Year', '4th Year'] },
    { label: 'GitHub Sync', href: '/dashboard/github', icon: Github, years: ['1st Year', '2nd Year', '3rd Year', '4th Year'] },
    { label: 'Collaboration', href: '/dashboard/collaboration', icon: Briefcase, years: ['2nd Year', '3rd Year', '4th Year'] },
    { label: 'Opportunities', href: '/dashboard/opportunities', icon: Briefcase, years: ['1st Year', '2nd Year', '3rd Year', '4th Year'] },

    // 3rd Year+
    { label: 'Internships', href: '/dashboard/internships', icon: Briefcase, years: ['3rd Year', '4th Year'] },

    // 4th Year Only
    { label: 'AI Interview', href: '/dashboard/ai-interview', icon: Mic, years: ['4th Year'] },
];

const BOTTOM_ITEMS = [
    { label: 'Profile', href: '/dashboard/profile', icon: User },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setIsCollapsed(false);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setIsCollapsed]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    let roleNav = NAV_ITEMS.filter(item => !item.years || item.years.includes(user?.year || '1st Year'));

    if (user?.role === 'recruiter') {
        roleNav = [
            { label: 'Hiring Dashboard', href: '/dashboard/recruiter', icon: Briefcase, years: [] },
            { label: 'Public Opportunities', href: '/opportunities', icon: Globe, years: [] }
        ];
    } else if (user?.role === 'admin' || user?.role === 'super_admin') {
        roleNav.push({ label: 'Recruiter Hub', href: '/dashboard/recruiter', icon: Briefcase, years: [] });
    }

    const isRecruiter = user?.role === 'recruiter';

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={cn(
                    "fixed top-0 left-0 h-screen bg-[#0A0E1A] border-r border-white/5 transition-all duration-300 z-50 flex flex-col",
                    isMobile
                        ? cn("w-64", isMobileOpen ? "translate-x-0" : "-translate-x-full")
                        : isCollapsed ? "w-20" : "w-64"
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-4 border-b border-white/5 shrink-0">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${isRecruiter ? 'from-[#7C3AED] to-[#4F46E5]' : 'from-[#10B981] to-[#00D4FF]'} flex items-center justify-center shrink-0`}>
                        {isRecruiter ? <Briefcase size={20} className="text-white" /> : <GraduationCap size={20} className="text-white" />}
                    </div>
                    {!isCollapsed && (
                        <div className="ml-3 overflow-hidden">
                            <span className="font-bold text-white text-lg">{isRecruiter ? 'Recruiter' : 'Student'}</span>
                            <span className="text-xs text-[#94A3B8] block -mt-1">{isRecruiter ? 'SkillBridge Hiring' : 'SkillBridge'}</span>
                        </div>
                    )}
                </div>

                {/* Toggle Button */}
                {!isMobile && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={14} className="text-white" /> : <ChevronLeft size={14} className="text-white" />}
                    </button>
                )}

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
                    {roleNav.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <NavLink
                                key={item.href + item.label}
                                to={item.href}
                                onClick={() => isMobile && setIsMobileOpen(false)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                                    isActive
                                        ? (isRecruiter ? "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20" : "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20")
                                        : "text-[#94A3B8] hover:bg-white/5 hover:text-white",
                                    isCollapsed && "justify-center px-0"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon size={20} className="shrink-0" />
                                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                            </NavLink>
                        );
                    })}

                    {/* Divider */}
                    <div className="py-3">
                        <div className="h-px bg-white/5" />
                    </div>

                    {/* Profile & Settings */}
                    {BOTTOM_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <NavLink
                                key={item.href}
                                to={item.href}
                                onClick={() => isMobile && setIsMobileOpen(false)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                                    isActive
                                        ? (isRecruiter ? "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20" : "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20")
                                        : "text-[#94A3B8] hover:bg-white/5 hover:text-white",
                                    isCollapsed && "justify-center px-0"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon size={20} className="shrink-0" />
                                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer: Logout */}
                <div className="p-3 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#EF4444] hover:bg-[#EF4444]/10 transition-all",
                            isCollapsed && "justify-center px-0"
                        )}
                    >
                        <LogOut size={20} className="shrink-0" />
                        {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
