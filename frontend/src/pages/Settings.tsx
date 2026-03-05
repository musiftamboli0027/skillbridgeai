import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    Settings as SettingsIcon,
    Bell, Shield, Globe, Eye, LogOut, User,
    Moon, Sun, Lock, Smartphone, Trash2
} from 'lucide-react';
import GitHubStatusCard from '../components/github/GitHubStatusCard';

export default function Settings() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [notifications, setNotifications] = useState(true);

    const isRecruiter = user?.role === 'recruiter';

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        if (typeof document !== 'undefined') {
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-slide-in">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                    <p className="text-[#94A3B8] mt-1 text-sm font-medium">Manage your preferences and account settings</p>
                </div>

                {/* GitHub Integration */}
                {!isRecruiter && <GitHubStatusCard />}

                {/* Appearance & Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Appearance */}
                    <div className="glass-card p-6 space-y-5">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            <SettingsIcon size={18} className="text-[#00D4FF]" />
                            Appearance
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Dark Mode</p>
                                        <p className="text-xs text-[#94A3B8]">Toggle dark/light theme</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`w-11 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-[#10B981]' : 'bg-white/20'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="glass-card p-6 space-y-5">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            <Bell size={18} className="text-[#7C3AED]" />
                            Notifications
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center">
                                        <Bell size={20} className="text-[#7C3AED]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Push Notifications</p>
                                        <p className="text-xs text-[#94A3B8]">Get notified about {isRecruiter ? 'new applicants and updates' : 'new lessons and updates'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNotifications(!notifications)}
                                    className={`w-11 h-6 rounded-full relative transition-colors ${notifications ? 'bg-[#7C3AED]' : 'bg-white/20'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security & Account */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Security */}
                    <div className="glass-card p-6 space-y-5">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            <Shield size={18} className="text-[#10B981]" />
                            Security
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors text-left">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Lock size={20} className="text-[#94A3B8]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Change Password</p>
                                        <p className="text-xs text-[#94A3B8]">Update your account password</p>
                                    </div>
                                </div>
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors text-left">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Smartphone size={20} className="text-[#94A3B8]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                                        <p className="text-xs text-[#94A3B8]">Add extra security to your account</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-[#F59E0B]/20 text-[#F59E0B] text-[10px] font-bold rounded-full uppercase">Recommended</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors text-left">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Globe size={20} className="text-[#94A3B8]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Active Sessions</p>
                                        <p className="text-xs text-[#94A3B8]">Manage your logged-in devices</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Account */}
                    <div className="glass-card p-6 space-y-5">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            <User size={18} className="text-[#F59E0B]" />
                            Account
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors text-left">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <User size={20} className="text-[#94A3B8]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Edit Profile</p>
                                        <p className="text-xs text-[#94A3B8]">Update your personal information</p>
                                    </div>
                                </div>
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors text-left">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Eye size={20} className="text-[#94A3B8]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Privacy</p>
                                        <p className="text-xs text-[#94A3B8]">Control your profile visibility</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Danger Zone */}
                        <div className="pt-4 border-t border-white/5 space-y-3">
                            <p className="text-xs text-[#EF4444] font-bold">Danger Zone</p>
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to sign out?')) {
                                        logout();
                                        navigate('/');
                                    }
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-left"
                            >
                                <LogOut size={18} />
                                <span className="text-sm font-medium">Sign Out</span>
                            </button>
                            <button
                                onClick={() => alert('Please contact support to delete your account.')}
                                className="w-full flex items-center gap-3 p-3 rounded-xl text-[#64748B] hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-colors text-left"
                            >
                                <Trash2 size={18} />
                                <span className="text-sm font-medium">Delete Account</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
