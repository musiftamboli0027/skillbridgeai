import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    User, Mail, Camera, Check, Lock, Github, Linkedin,
    Award, Zap, Flame, Shield, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGitHub } from '../hooks/useGitHub';
import { api } from '../services/api';
import { toast } from 'sonner';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const isRecruiter = user?.role === 'recruiter';
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const { profile: ghProfile, isConnecting, connect: connectGitHub, disconnect: disconnectGitHub } = useGitHub();

    // Modals
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loadingPwd, setLoadingPwd] = useState(false);

    // Profile state
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        companyName: user?.recruiterProfile?.companyName || '',
        companyWebsite: user?.recruiterProfile?.companyWebsite || '',
        companyDescription: user?.recruiterProfile?.companyDescription || '',
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                companyName: user.recruiterProfile?.companyName || '',
                companyWebsite: user.recruiterProfile?.companyWebsite || '',
                companyDescription: user.recruiterProfile?.companyDescription || '',
            });
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await api.updateProfile(profileData);
            if (res.success) {
                updateProfile(profileData);
                setSaved(true);
                toast.success('Profile updated successfully');
                setTimeout(() => setSaved(false), 2000);
            } else {
                toast.error(res.message || 'Failed to update profile');
            }
        } catch (error: unknown) {
            toast.error((error as Error).message || 'An error occurred');
        } finally {
            setIsSaving(false);
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
            setLoadingPwd(true);
            const res = await api.changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
            if (res.success) {
                toast.success('Password updated successfully');
                setShowPasswordModal(false);
                setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(res.message || 'Failed to update password');
            }
        } catch (error: unknown) {
            toast.error((error as Error).message || 'Error updating password');
        } finally {
            setLoadingPwd(false);
        }
    };

    const handleUnlinkGithub = async () => {
        await disconnectGitHub();
        updateProfile({ githubId: undefined });
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-slide-in relative">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Profile</h1>
                        <p className="text-[#94A3B8] mt-1 text-sm font-medium">Manage your personal information</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-[#10B981] hover:bg-[#10B981]/80 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : saved ? (<>Saved <Check size={16} /></>) : 'Save Changes'}
                    </button>
                </div>

                {/* Profile Card */}
                <div className="glass-card p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group">
                            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${isRecruiter ? 'from-[#7C3AED] to-[#4F46E5]' : 'from-[#10B981] to-[#00D4FF]'} flex items-center justify-center text-white text-3xl font-bold border-4 border-[#0A0E1A]`}>
                                {user?.name?.[0]?.toUpperCase() || (isRecruiter ? 'R' : 'S')}
                            </div>
                            <button className={`absolute bottom-0 right-0 w-8 h-8 bg-white text-[#03040A] rounded-full shadow-lg flex items-center justify-center hover:${isRecruiter ? 'bg-[#7C3AED]' : 'bg-[#00D4FF]'} transition-all border-2 border-[#0A0E1A]`}>
                                <Camera size={14} />
                            </button>
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                            <p className="text-sm text-[#94A3B8]">{user?.email}</p>
                            {isRecruiter ? (
                                <p className="text-xs text-[#7C3AED] font-bold mt-1 capitalize">{user.recruiterProfile?.companyName || 'Corporate Recruiter'} • {user.recruiterProfile?.verificationStatus}</p>
                            ) : (
                                <p className="text-xs text-[#64748B] mt-1 capitalize">{user?.role || 'Student'} • {user?.year || '1st Year'}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                {!isRecruiter && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="glass-card p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/20 flex items-center justify-center">
                                    <Award size={16} className="text-[#00D4FF]" />
                                </div>
                                <span className="text-sm text-[#94A3B8]">Level</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{Math.floor((user?.totalXp || 0) / 1000) + 1}</p>
                        </div>
                        <div className="glass-card p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center">
                                    <Zap size={16} className="text-[#7C3AED]" />
                                </div>
                                <span className="text-sm text-[#94A3B8]">Total XP</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{(user?.totalXp || 0).toLocaleString()}</p>
                        </div>
                        <div className="glass-card p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center">
                                    <Flame size={16} className="text-[#F59E0B]" />
                                </div>
                                <span className="text-sm text-[#94A3B8]">Streak</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{user?.learningStreak || 0} days</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Details */}
                    <div className="glass-card p-6 space-y-5">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            <Shield size={18} className="text-[#00D4FF]" />
                            Personal Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-[#64748B] font-medium mb-1 block">Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                                    <input
                                        value={profileData.name}
                                        onChange={e => setProfileData({...profileData, name: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white focus:outline-none focus:border-[#10B981]/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-[#64748B] font-medium mb-1 block">Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                                    <input
                                        defaultValue={user?.email}
                                        readOnly
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white/60 focus:outline-none cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-[#64748B] font-medium mb-1 block">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                                    <input
                                        type="password"
                                        value="••••••••"
                                        readOnly
                                        className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white/60 focus:outline-none cursor-not-allowed"
                                    />
                                    <button 
                                        onClick={() => setShowPasswordModal(true)}
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold hover:underline ${isRecruiter ? 'text-[#7C3AED]' : 'text-[#10B981]'}`}
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                            {isRecruiter && (
                                <>
                                    <div>
                                        <label className="text-xs text-[#64748B] font-medium mb-1 block">Company Name</label>
                                        <div className="relative">
                                            <input
                                                value={profileData.companyName}
                                                onChange={e => setProfileData({...profileData, companyName: e.target.value})}
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white focus:outline-none focus:border-[#7C3AED]/50"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#64748B] font-medium mb-1 block">Company Website</label>
                                        <div className="relative">
                                            <input
                                                value={profileData.companyWebsite}
                                                onChange={e => setProfileData({...profileData, companyWebsite: e.target.value})}
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white focus:outline-none focus:border-[#7C3AED]/50"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#64748B] font-medium mb-1 block">Company Description</label>
                                        <div className="relative">
                                            <textarea
                                                value={profileData.companyDescription}
                                                onChange={e => setProfileData({...profileData, companyDescription: e.target.value})}
                                                rows={3}
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white focus:outline-none focus:border-[#7C3AED]/50 resize-none"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Connected Accounts & Badges - Student Only */}
                    {!isRecruiter && (
                        <div className="glass-card p-6 space-y-5">
                            <h3 className="text-white font-medium">Connected Accounts</h3>
                            <div className="space-y-3">
                                {/* GitHub */}
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white text-[#03040A] flex items-center justify-center">
                                            <Github size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">GitHub</p>
                                            <p className="text-xs text-[#94A3B8]">
                                                {ghProfile?.isConnected ? `@${ghProfile.username} • Connected` : 'Not connected'}
                                            </p>
                                        </div>
                                    </div>
                                    {ghProfile?.isConnected ? (
                                        <button
                                            onClick={handleUnlinkGithub}
                                            className="text-xs text-[#EF4444] font-bold hover:underline"
                                        >
                                            Disconnect
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => connectGitHub()}
                                            disabled={isConnecting}
                                            className="text-xs text-[#10B981] font-bold hover:underline"
                                        >
                                            {isConnecting ? 'Connecting...' : 'Connect'}
                                        </button>
                                    )}
                                </div>

                                {/* LinkedIn */}
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 opacity-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#0077B5] text-white flex items-center justify-center">
                                            <Linkedin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">LinkedIn</p>
                                            <p className="text-xs text-[#94A3B8]">Coming soon</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-[#64748B] font-medium">Soon</span>
                                </div>
                            </div>

                            {/* Badges */}
                            <h3 className="text-white font-medium pt-2">Achievements</h3>
                            <div className="space-y-2">
                                {[
                                    { name: 'Fast Learner', icon: Zap, color: '#F59E0B' },
                                    { name: 'Code Ninja', icon: Shield, color: '#00D4FF' },
                                    { name: 'Top Performer', icon: Award, color: '#7C3AED' },
                                ].map((badge, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${badge.color}20` }}>
                                            <badge.icon size={16} style={{ color: badge.color }} />
                                        </div>
                                        <span className="text-sm text-white font-medium">{badge.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Password Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-[#0A0E1A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <h3 className="text-lg font-bold text-white">Change Password</h3>
                                <button onClick={() => setShowPasswordModal(false)} className="text-[#94A3B8] hover:text-white p-1">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6">
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
                                        disabled={loadingPwd}
                                        className="w-full py-2.5 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-bold rounded-xl mt-4 disabled:opacity-50"
                                    >
                                        {loadingPwd ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
