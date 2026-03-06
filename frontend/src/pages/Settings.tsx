import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import {
    Settings as SettingsIcon,
    Bell, Shield, LogOut, User, X,
    Moon, Sun, Lock, Smartphone
} from 'lucide-react';
import GitHubStatusCard from '../components/github/GitHubStatusCard';
import { toast } from 'sonner';

export default function Settings() {
    const navigate = useNavigate();
    const { logout, user, updateProfile } = useAuth();
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
        }
        return 'dark';
    });
    // @ts-expect-error - notificationsEnabled exists on user in backend
    const [notifications, setNotifications] = useState(user?.notificationsEnabled !== false);

    // Modals state
    const [activeModal, setActiveModal] = useState<'password' | 'profile' | '2fa' | null>(null);

    // Forms state
    const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
    // @ts-expect-error - twoFactorEnabled exists on user in backend
    const [is2FAEnabled, setIs2FAEnabled] = useState(user?.twoFactorEnabled || false);
    const [loading, setLoading] = useState(false);

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
        toast.success(`Theme switched to ${newTheme} mode`);
    };

    const toggleNotifications = async () => {
        const newState = !notifications;
        setNotifications(newState);
        try {
            await api.updateNotificationSettings({ pushEnabled: newState });
            toast.success(`Push notifications ${newState ? 'enabled' : 'disabled'}`);
        } catch (error) {
            setNotifications(!newState);
            toast.error('Failed to update notification settings');
            console.error(error);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passForm.newPassword !== passForm.confirmPassword) {
            return toast.error('New passwords do not match');
        }
        if (passForm.newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }
        try {
            setLoading(true);
            const res = await api.changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
            if (res.success) {
                toast.success('Password updated successfully');
                setActiveModal(null);
                setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(res.message || 'Failed to update password');
            }
        } catch (error: unknown) {
            toast.error((error as Error).message || 'Error updating password');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await api.updateProfile({ name: profileForm.name });
            if (res.success) {
                toast.success('Profile updated successfully');
                updateProfile({ name: profileForm.name });
                setActiveModal(null);
            }
        } catch (error: unknown) {
            toast.error((error as Error).message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handle2FAToggle = async () => {
        try {
            setLoading(true);
            const res = await api.toggleTwoFactor();
            if (res.success) {
                setIs2FAEnabled(res.twoFactorEnabled);
                // @ts-expect-error - updating additional user fields not yet in interface type
                updateProfile({ twoFactorEnabled: res.twoFactorEnabled });
                toast.success(`Two-factor authentication ${res.twoFactorEnabled ? 'enabled' : 'disabled'}`);
                setActiveModal(null);
            }
        } catch (error: unknown) {
            toast.error('Failed to toggle 2FA');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-slide-in relative">
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
                                    onClick={toggleNotifications}
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
                            <button
                                onClick={() => setActiveModal('password')}
                                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors text-left"
                            >
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
                            <button
                                onClick={() => setActiveModal('2fa')}
                                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Smartphone size={20} className={is2FAEnabled ? 'text-[#10B981]' : 'text-[#94A3B8]'} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                                        <p className="text-xs text-[#94A3B8]">Add extra security to your account</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${is2FAEnabled ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                                    {is2FAEnabled ? 'Enabled' : 'Recommended'}
                                </span>
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
                            <button
                                onClick={() => setActiveModal('profile')}
                                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors text-left"
                            >
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
                        </div>
                    </div>
                </div>

                {/* MODALS */}
                {activeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-[#0A0E1A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <h3 className="text-lg font-bold text-white">
                                    {activeModal === 'password' && 'Change Password'}
                                    {activeModal === 'profile' && 'Edit Profile'}
                                    {activeModal === '2fa' && 'Two-Factor Authentication'}
                                </h3>
                                <button onClick={() => setActiveModal(null)} className="text-[#94A3B8] hover:text-white p-1">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="p-6">
                                {activeModal === 'password' && (
                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-medium text-[#94A3B8] mb-1 block">Current Password</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={passForm.currentPassword}
                                                onChange={e => setPassForm({...passForm, currentPassword: e.target.value})}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D4FF]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-[#94A3B8] mb-1 block">New Password</label>
                                            <input 
                                                type="password" 
                                                required minLength={6}
                                                value={passForm.newPassword}
                                                onChange={e => setPassForm({...passForm, newPassword: e.target.value})}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D4FF]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-[#94A3B8] mb-1 block">Confirm New Password</label>
                                            <input 
                                                type="password" 
                                                required minLength={6}
                                                value={passForm.confirmPassword}
                                                onChange={e => setPassForm({...passForm, confirmPassword: e.target.value})}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D4FF]"
                                            />
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-full py-2.5 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-bold rounded-xl mt-4 disabled:opacity-50"
                                        >
                                            {loading ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </form>
                                )}

                                {activeModal === 'profile' && (
                                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-medium text-[#94A3B8] mb-1 block">Full Name</label>
                                            <input 
                                                type="text" 
                                                required
                                                value={profileForm.name}
                                                onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F59E0B]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-[#94A3B8] mb-1 block">Email (Cannot be changed)</label>
                                            <input 
                                                type="email" 
                                                disabled
                                                value={profileForm.email}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[#94A3B8] cursor-not-allowed"
                                            />
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-full py-2.5 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-black font-bold rounded-xl mt-4 disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : 'Save Profile'}
                                        </button>
                                    </form>
                                )}

                                {activeModal === '2fa' && (
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Shield size={32} className="text-[#10B981]" />
                                        </div>
                                        <h4 className="text-white font-bold text-lg">
                                            {is2FAEnabled ? 'Turn Off 2FA?' : 'Secure Your Account'}
                                        </h4>
                                        <p className="text-[#94A3B8] text-sm px-4">
                                            {is2FAEnabled 
                                                ? 'Disabling Two-Factor Authentication means you will only use your password to log in. We recommend keeping it enabled.' 
                                                : 'Two-Factor Authentication adds an extra layer of security to your account.'}
                                        </p>
                                        <button 
                                            onClick={handle2FAToggle}
                                            disabled={loading}
                                            className={`w-full py-2.5 font-bold rounded-xl mt-4 disabled:opacity-50 ${
                                                is2FAEnabled 
                                                    ? 'bg-[#EF4444] hover:bg-[#EF4444]/90 text-white' 
                                                    : 'bg-[#10B981] hover:bg-[#10B981]/90 text-white'
                                            }`}
                                        >
                                            {loading ? 'Processing...' : is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                        </button>
                                        <button 
                                            onClick={() => setActiveModal(null)}
                                            className="w-full py-2.5 text-[#94A3B8] hover:text-white font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
