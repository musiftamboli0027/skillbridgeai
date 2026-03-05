import { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    onMobileMenuOpen: () => void;
}

export default function Header({ onMobileMenuOpen }: HeaderProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const isRecruiter = user?.role === 'recruiter';

    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#03040A]/80 backdrop-blur-xl sticky top-0 z-40">
            {/* Left */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMobileMenuOpen}
                    className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-[#94A3B8]"
                >
                    <Menu size={20} />
                </button>

                {/* Search */}
                <div className="relative flex-1 min-w-[300px] hidden md:block">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                        type="text"
                        placeholder={isRecruiter ? "Search candidates, skills..." : "Search courses, lessons..."}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-${isRecruiter ? '[#7C3AED]' : '[#10B981]'}/50`}
                    />
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 rounded-lg hover:bg-white/5 text-[#94A3B8] relative"
                    >
                        <Bell size={20} />
                        <span className={`absolute top-1 right-1 w-2 h-2 ${isRecruiter ? 'bg-[#7C3AED]' : 'bg-[#10B981]'} rounded-full`} />
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-[#0D121F] border border-white/5 rounded-xl overflow-hidden z-50 shadow-2xl">
                            <div className="p-3 border-b border-white/10">
                                <p className="text-sm font-medium text-white">Notifications</p>
                            </div>
                            <div className="p-2 space-y-1">
                                {isRecruiter ? (
                                    <>
                                        <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                            <p className="text-sm text-white">New applicant</p>
                                            <p className="text-xs text-[#94A3B8]">A student applied to Frontend Intern</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                            <p className="text-sm text-white">New lesson available</p>
                                            <p className="text-xs text-[#94A3B8]">React Fundamentals - State Management</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                            <p className="text-sm text-white">Assignment reminder</p>
                                            <p className="text-xs text-[#94A3B8]">Dashboard Layout due in 2 days</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-xl hover:bg-white/5 transition-colors"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm text-white font-medium">{user?.name || (isRecruiter ? 'Recruiter' : 'Student')}</p>
                            <p className="text-xs text-[#64748B] font-bold uppercase tracking-widest">{user?.role || 'student'}</p>
                        </div>
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${isRecruiter ? 'from-[#7C3AED] to-[#4F46E5]' : 'from-[#10B981] to-[#00D4FF]'} flex items-center justify-center text-white font-bold border border-white/10`}>
                            {user?.name?.charAt(0)?.toUpperCase() || (isRecruiter ? 'R' : 'S')}
                        </div>
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-[#0D121F] border border-white/5 rounded-xl overflow-hidden z-50 shadow-2xl">
                            <div className="p-4 border-b border-white/10">
                                <p className="text-sm font-medium text-white">{user?.name}</p>
                                <p className="text-xs text-[#94A3B8]">{user?.email}</p>
                            </div>
                            <div className="p-2">
                                <button
                                    onClick={() => { setShowProfile(false); navigate('/dashboard/profile'); }}
                                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:bg-white/5 hover:text-white transition-colors"
                                >
                                    Profile
                                </button>
                                { !isRecruiter && (
                                    <button
                                        onClick={() => { setShowProfile(false); navigate('/dashboard/settings'); }}
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:bg-white/5 hover:text-white transition-colors"
                                    >
                                        Settings
                                    </button>
                                )}
                                <button
                                    onClick={() => { setShowProfile(false); logout(); navigate('/'); }}
                                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
