import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    User,
    Mail,
    Shield,
    Camera,
    Check,
    Lock,
    Globe,
    Github,
    Linkedin,
    Award,
    Zap,
    Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { cn } from '../lib/utils';
import { api } from '../services/api';
import { toast } from 'sonner';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const levels = {
        current: 14,
        xp: 2450,
        next: 3000,
        rank: 'Elite Developer'
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 1000);
    };

    const handleLinkGithub = () => {
        const token = localStorage.getItem('skillbridge_token');
        if (!token) return;
        window.location.href = api.getGithubAuthUrl(token);
    };

    const handleUnlinkGithub = async () => {
        try {
            await api.unlinkGithub();
            updateProfile({ githubId: undefined });
            toast.success('GitHub account unlinked');
        } catch (error: any) {
            toast.error(error.message || 'Failed to unlink GitHub');
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-10 pb-20">

                {/* Profile Hero */}
                <div className="relative h-48 rounded-[2.5rem] bg-gradient-to-r from-indigo-600 to-violet-700 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="px-10 -mt-24 relative z-10 flex flex-col md:flex-row items-end gap-6">
                    <div className="relative group">
                        <Avatar className="h-36 w-36 border-4 border-white dark:border-slate-950 shadow-2xl">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback className="bg-indigo-600 text-white text-4xl font-black">
                                {user?.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-1 right-1 w-10 h-10 bg-white dark:bg-slate-900 rounded-full shadow-lg border-2 border-slate-50 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all hover:scale-110">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{user?.name}</h1>
                            <p className="text-slate-500 font-bold flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4" /> {user?.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 font-black rounded-2xl px-10 h-14 text-white shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95">
                                {isSaving ? 'Syncing...' : saved ? 'Changes Saved' : 'Update Profile'}
                                {saved && <Check className="w-4 h-4 ml-2" />}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left: General Info */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Gamification Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Level</p>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">{levels.current}</h3>
                                    <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 font-black px-2">{levels.rank}</Badge>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total XP</p>
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <Zap className="w-5 h-5 fill-current" />
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">{levels.xp.toLocaleString()}</h3>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Day Streak</p>
                                <div className="flex items-center gap-2 text-orange-500">
                                    <Flame className="w-5 h-5 fill-current" />
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">12</h3>
                                </div>
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <Shield className="w-6 h-6 text-indigo-600" />
                                Identity & Security
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input defaultValue={user?.name} className="h-14 pl-12 bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-600/10 rounded-2xl font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input defaultValue={user?.email} className="h-14 pl-12 bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-600/10 rounded-2xl font-bold" readOnly />
                                    </div>
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input type="password" value="••••••••••••" className="h-14 pl-12 bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-600/10 rounded-2xl font-bold" readOnly />
                                        <Button variant="ghost" className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-xs uppercase hover:bg-indigo-50">Change</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Connections */}
                        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <Globe className="w-6 h-6 text-indigo-600" />
                                Connected Platforms
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-100">
                                            <Github className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">GitHub</p>
                                            <p className={cn(
                                                "text-[10px] font-bold uppercase",
                                                user?.githubId ? "text-emerald-500" : "text-slate-400"
                                            )}>
                                                {user?.githubId ? 'Connected' : 'Not Linked'}
                                            </p>
                                        </div>
                                    </div>
                                    {user?.githubId ? (
                                        <Button
                                            variant="ghost"
                                            className="text-rose-500 font-bold text-xs"
                                            onClick={handleUnlinkGithub}
                                        >
                                            Unlink
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            className="text-indigo-600 font-bold text-xs"
                                            onClick={handleLinkGithub}
                                        >
                                            Connect
                                        </Button>
                                    )}
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-slate-200 transition-all opacity-60">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-100">
                                            <Linkedin className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">LinkedIn</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Coming Soon</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="text-indigo-600 font-bold text-xs" disabled>Connect</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar Info */}
                    <div className="space-y-10">
                        {/* Achievements Preview */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl" />
                            <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tight">
                                <Award className="w-6 h-6 text-indigo-400" />
                                Latest Badges
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Fast Learner', date: 'Earned 2d ago', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-400/10' },
                                    { name: 'Code Ninja', date: 'Earned 1w ago', icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                                    { name: 'Quiz Master', date: 'Earned 1m ago', icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                                ].map((badge, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", badge.bg)}>
                                            <badge.icon className={cn("w-6 h-6", badge.color)} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{badge.name}</p>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{badge.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="link" className="w-full text-indigo-400 font-black text-xs uppercase tracking-widest">View All 15 Badges</Button>
                        </div>

                        {/* Public View Toggle */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Profile Settings</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tighter">Public Profile</p>
                                        <p className="text-xs text-slate-400">Allow others to see your stats</p>
                                    </div>
                                    <div className="w-11 h-6 bg-emerald-500 rounded-full relative shadow-inner">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tighter">Stealth Mode</p>
                                        <p className="text-xs text-slate-400">Hide activity from leaderboard</p>
                                    </div>
                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
}


