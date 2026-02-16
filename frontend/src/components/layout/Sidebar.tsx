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
    Command,
    Globe
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
}

const NAV_ITEMS = [
    { label: 'Visit Main Site', href: '/', icon: Globe },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
];

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
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

    const sidebarVariants = {
        expanded: { width: '260px' },
        collapsed: { width: '80px' }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={isMobile ? (isMobileOpen ? { x: 0 } : { x: '-100%' }) : (isCollapsed ? 'collapsed' : 'expanded')}
                variants={sidebarVariants}
                className={cn(
                    "fixed top-0 left-0 h-screen bg-skillbridge-sidebar border-r border-teal-900 transition-all duration-300 ease-in-out z-50 flex flex-col shadow-2xl",
                    isMobile && "w-64"
                )}
            >
                {/* Brand / Logo */}
                <div className="h-20 flex items-center px-6 border-b border-teal-900/50 shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-skillbridge-button flex items-center justify-center text-skillbridge-sidebar shrink-0 shadow-lg shadow-skillbridge-button/20">
                            <Command className="w-6 h-6" />
                        </div>
                        <AnimatePresence mode="wait">
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="font-black text-xl text-white tracking-tighter whitespace-nowrap uppercase"
                                >
                                    Skill<span className="text-skillbridge-button">Bridge</span>
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2 scrollbar-hide">
                    <TooltipProvider delayDuration={0}>
                        {NAV_ITEMS.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <div key={item.href}>
                                    {isCollapsed ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <NavLink
                                                    to={item.href}
                                                    className={cn(
                                                        "flex items-center justify-center w-full h-12 rounded-xl transition-all duration-200 group relative",
                                                        isActive
                                                            ? "bg-skillbridge-button text-skillbridge-sidebar shadow-lg shadow-skillbridge-button/20"
                                                            : "text-teal-100 hover:bg-white/10 hover:text-skillbridge-button"
                                                    )}
                                                >
                                                    <item.icon className="w-5 h-5 shrink-0" />
                                                </NavLink>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="font-semibold px-3 py-1.5 bg-skillbridge-button text-skillbridge-sidebar">
                                                {item.label}
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <NavLink
                                            to={item.href}
                                            onClick={() => isMobile && setIsMobileOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 group relative overflow-hidden",
                                                isActive
                                                    ? "bg-skillbridge-button text-skillbridge-sidebar shadow-lg shadow-skillbridge-button/20"
                                                    : "text-teal-100/70 hover:bg-white/5 hover:text-skillbridge-button"
                                            )}
                                        >
                                            <item.icon className={cn("w-5 h-5 transition-transform", !isActive && "group-hover:scale-110")} />
                                            <span className="truncate">{item.label}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-pill"
                                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-skillbridge-sidebar rounded-r-full"
                                                />
                                            )}
                                        </NavLink>
                                    )}
                                </div>
                            );
                        })}
                    </TooltipProvider>

                    {/* Divider */}
                    <div className="py-4 px-2">
                        <div className="h-px bg-teal-900/50" />
                    </div>

                    {/* Meta Items */}
                    <TooltipProvider delayDuration={0}>
                        {[
                            { label: 'Profile', href: '/dashboard/profile', icon: User },
                            { label: 'Settings', href: '/dashboard/settings', icon: Settings },
                        ].map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <div key={item.href}>
                                    {isCollapsed ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <NavLink
                                                    to={item.href}
                                                    className={cn(
                                                        "flex items-center justify-center w-full h-12 rounded-xl transition-all duration-200 group relative",
                                                        isActive
                                                            ? "bg-skillbridge-button text-skillbridge-sidebar shadow-lg"
                                                            : "text-teal-100 hover:bg-white/10 hover:text-skillbridge-button"
                                                    )}
                                                >
                                                    <item.icon className="w-5 h-5 shrink-0" />
                                                </NavLink>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="font-semibold bg-skillbridge-button text-skillbridge-sidebar">
                                                {item.label}
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <NavLink
                                            to={item.href}
                                            onClick={() => isMobile && setIsMobileOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 group relative overflow-hidden",
                                                isActive
                                                    ? "bg-skillbridge-button text-skillbridge-sidebar shadow-lg"
                                                    : "text-teal-100/70 hover:bg-white/5 hover:text-skillbridge-button"
                                            )}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="truncate">{item.label}</span>
                                        </NavLink>
                                    )}
                                </div>
                            );
                        })}
                    </TooltipProvider>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-teal-900/50">
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center gap-3 w-full px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-rose-300 hover:bg-rose-950/30 transition-all group",
                            isCollapsed && "justify-center px-0"
                        )}
                    >
                        <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
                        {!isCollapsed && <span>Logout</span>}
                    </button>

                    <div className="mt-4 hidden lg:block">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="w-full text-teal-200 hover:bg-white/5"
                        >
                            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
