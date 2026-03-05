import {
    LayoutDashboard, BookOpen, Users, FileCode,
    BarChart3, Bot, Settings, ChevronLeft, ChevronRight, Shield,
    Database, Briefcase
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

interface AdminSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    currentView: string;
    onNavigate: (view: string) => void;
}

const adminItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileCode },
    { id: 'recruiters', label: 'Recruiters', icon: Briefcase },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-config', label: 'AI Config', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
];

const superAdminItems = [
    { id: 'super-dashboard', label: 'Platform', icon: LayoutDashboard },
    { id: 'universities', label: 'Universities', icon: Shield },
    { id: 'global-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'subscriptions', label: 'Subscriptions', icon: Users },
    { id: 'recruiters', label: 'Recruiters', icon: Briefcase },
    { id: 'course-ingestion', label: 'Ingestion', icon: Database },
    { id: 'system-ai', label: 'AI Control', icon: Bot },
];

export function AdminSidebar({ collapsed, onToggle, currentView, onNavigate }: AdminSidebarProps) {
    const { user } = useAuth();
    const items = user?.role === 'super_admin' ? superAdminItems : adminItems;
    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-[#0A0E1A] border-r border-white/5 transition-all duration-300 z-50 ${collapsed ? 'w-16' : 'w-64'
                }`}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#00D4FF] flex items-center justify-center">
                    <Shield size={20} className="text-white" />
                </div>
                {!collapsed && (
                    <div className="ml-3">
                        <span className="font-bold text-white text-lg">Admin</span>
                        <span className="text-xs text-[#94A3B8] block -mt-1">SkillBridge University</span>
                    </div>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Navigation */}
            <nav className="p-3 space-y-1">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                                ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                                : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Quick Stats */}
            {!collapsed && (
                <div className="absolute bottom-4 left-3 right-3">
                    <div className="glass-card-sm p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-[#64748B]">Active Students</span>
                            <span className="text-sm font-bold text-white">1,240</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#10B981] rounded-full" style={{ width: '78%' }} />
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
