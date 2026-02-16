import { useState } from 'react';
import { Search, Bell, Menu, User, Settings, LogOut, Globe } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps {
    onMobileMenuOpen: () => void;
}

export default function Header({ onMobileMenuOpen }: HeaderProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    return (
        <header className="h-20 bg-skillbridge-header backdrop-blur-xl border-b border-teal-400 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-40 shadow-sm">

            {/* Left: Mobile Menu + Search */}
            <div className="flex items-center gap-6 flex-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-white hover:bg-white/10 rounded-xl"
                    onClick={onMobileMenuOpen}
                >
                    <Menu className="w-6 h-6" />
                </Button>

                <div className="relative max-w-md w-full hidden md:block group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                        <Search className="w-4 h-4 text-teal-100 group-focus-within:text-white transition-colors" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Search workspace..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-11 h-11 w-full bg-white/10 border-transparent placeholder:text-teal-50 text-white rounded-xl focus:bg-white/20 focus:ring-4 focus:ring-white/10 transition-all text-sm font-bold uppercase tracking-widest"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 border border-white/20 rounded bg-white/10 pointer-events-none opacity-50">
                        <span className="text-[10px] font-black text-white italic">⌘K</span>
                    </div>
                </div>
            </div>

            {/* Right: Actions + Profile */}
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">

                <div className="h-6 w-[1px] bg-white/20 mx-2 hidden lg:block" />

                {/* Visit Site Button */}
                <Link
                    to="/"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-[10px] font-black text-white hover:bg-white/10 rounded-xl transition-all uppercase tracking-[0.2em]"
                >
                    <Globe className="w-4 h-4" />
                    <span>Portal</span>
                </Link>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="h-10 w-10 relative text-white hover:bg-white/10 rounded-xl">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-400 rounded-full ring-2 ring-skillbridge-header animate-pulse"></span>
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 p-1 rounded-full hover:bg-white/10 transition-all outline-none focus:ring-2 focus:ring-white/20 group ml-2">
                            <div className="relative">
                                <Avatar className="h-10 w-10 border-2 border-white/20 shadow-sm ring-2 ring-transparent group-hover:ring-white/30 transition-all">
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback className="bg-skillbridge-button text-skillbridge-sidebar font-black text-sm">
                                        {user?.name?.[0]?.toUpperCase() || 'S'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-skillbridge-header rounded-full shadow-lg" />
                            </div>
                            <div className="text-left hidden lg:block pr-2">
                                <p className="text-xs font-black text-white leading-none uppercase tracking-tighter">{user?.name?.split(' ')[0] || 'Student'}</p>
                                <p className="text-[9px] text-teal-50 mt-1 font-black uppercase tracking-widest opacity-70">Expert Alumnus</p>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 mt-2 p-2 rounded-2xl shadow-xl border-slate-200 dark:border-slate-800">
                        <DropdownMenuLabel className="font-bold px-3 py-2 text-slate-900 dark:text-white uppercase text-xs tracking-widest opacity-50">Profile Menu</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 mb-1 group" onClick={() => navigate('/dashboard/profile')}>
                            <User className="w-4 h-4 mr-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            <span className="font-semibold text-sm">My Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 mb-1 group" onClick={() => navigate('/dashboard/settings')}>
                            <Settings className="w-4 h-4 mr-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            <span className="font-semibold text-sm">Account Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-rose-600 cursor-pointer rounded-xl px-3 py-2.5 group focus:bg-rose-50 dark:focus:bg-rose-900/10"
                            onClick={() => { logout(); navigate('/'); }}
                        >
                            <LogOut className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold text-sm">Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
