import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Smartphone,
    Globe,
    CreditCard,
    Eye,
    LogOut,
    User,
    ChevronRight,
    Moon,
    Sun,
    Trash2,
    Lock
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';

export default function Settings() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    interface SettingItem {
        name: string;
        description: string;
        icon: any;
        badge?: string;
    }

    interface SettingSection {
        title: string;
        icon: any;
        items: SettingItem[];
    }

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const settingSections: SettingSection[] = [
        {
            title: 'Account Settings',
            icon: User,
            items: [
                { name: 'Profile Information', description: 'Update your name, email, and bio', icon: User },
                { name: 'Privacy Settings', description: 'Control who can see your activity', icon: Eye },
                { name: 'Connected Accounts', description: 'Manage GitHub, LinkedIn, etc.', icon: Globe },
            ]
        },
        {
            title: 'Security',
            icon: Shield,
            items: [
                { name: 'Change Password', description: 'Last changed 3 months ago', icon: Lock },
                { name: 'Two-Factor Authentication', description: 'Add an extra layer of security', icon: Smartphone, badge: 'Recommended' },
                { name: 'Active Sessions', description: 'Manage your logged-in devices', icon: Globe },
            ]
        },
        {
            title: 'Billing & Subscriptions',
            icon: CreditCard,
            items: [
                { name: 'Subscription Plan', description: 'Currently on Pro Plan', icon: CreditCard },
                { name: 'Payment Methods', description: 'Visa ending in 4242', icon: CreditCard },
                { name: 'Billing History', description: 'View and download invoices', icon: FileText },
            ]
        }
    ];

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-10 pb-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Settings</h1>
                        <p className="text-slate-500 font-bold mt-1">Configure your personal preferences and account security</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

                    {/* Left: Navigation */}
                    <div className="space-y-2">
                        {settingSections.map((section, idx) => (
                            <button
                                key={idx}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                                    idx === 0 ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none" : "hover:bg-white dark:hover:bg-slate-900 text-slate-500"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <section.icon className={cn("w-5 h-5", idx === 0 ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                                    <span className="font-bold text-sm tracking-tight">{section.title}</span>
                                </div>
                                <ChevronRight className={cn("w-4 h-4 opacity-50", idx === 0 && "opacity-100")} />
                            </button>
                        ))}
                        <div className="pt-8 space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2">System</p>
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to sign out?')) {
                                        logout();
                                        navigate('/');
                                    }
                                }}
                                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/10 text-rose-500 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-bold text-sm tracking-tight">Sign Out</span>
                                </div>
                            </button>
                            <button
                                onClick={() => alert('Feature coming soon: Account deletion is handled by system administrators.')}
                                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-rose-600 hover:text-white text-rose-600 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <Trash2 className="w-5 h-5" />
                                    <span className="font-bold text-sm tracking-tight">Delete Account</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="lg:col-span-3 space-y-8">

                        {/* Preferences Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm space-y-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                                    <SettingsIcon className="w-6 h-6 text-indigo-600" />
                                    Personalization
                                </h3>
                                <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Adjust your workspace experience</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-transparent hover:border-slate-100 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 border border-slate-100 dark:border-slate-800">
                                            {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Dark Mode</p>
                                            <p className="text-xs text-slate-400 font-bold">Switch between light and dark themes</p>
                                        </div>
                                    </div>
                                    <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                                </div>

                                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-transparent hover:border-slate-100 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 border border-slate-100 dark:border-slate-800">
                                            <Bell className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Notifications</p>
                                            <p className="text-xs text-slate-400 font-bold">Manage email and browser alerts</p>
                                        </div>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </div>

                        {/* List Sections */}
                        {settingSections[0].items.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</p>
                                            {item.badge && <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[9px] px-2">{item.badge}</Badge>}
                                        </div>
                                        <p className="text-xs text-slate-400 font-bold">{item.description}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 rounded-xl">
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </motion.div>
                        ))}

                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}

function FileText({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>
    )
}
