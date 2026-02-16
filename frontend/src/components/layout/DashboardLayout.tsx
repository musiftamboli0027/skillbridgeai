import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarCollapsed');
            return saved === 'true';
        }
        return false;
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
    }, [isSidebarCollapsed]);

    return (
        <div className="min-h-screen bg-skillbridge-background flex transition-colors duration-500 overflow-hidden text-skillbridge-text font-sans">

            {/* Sidebar Background (for contrast/visuals) */}
            <div className="fixed inset-y-0 left-0 bg-skillbridge-sidebar border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-10 shadow-xl"
                style={{ width: isSidebarCollapsed ? '80px' : '260px' }}
            />

            {/* Main Application Shell */}
            <div className="flex-1 flex flex-col min-h-screen relative z-20">

                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                    isMobileOpen={isMobileMenuOpen}
                    setIsMobileOpen={setIsMobileMenuOpen}
                />

                <div
                    className={cn(
                        "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                        isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
                    )}
                >
                    <Header onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />

                    <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">
                        {/* Page Transition Wrapper */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="max-w-[1440px] mx-auto"
                        >
                            {children}
                        </motion.div>
                    </main>

                    {/* Footer / Copyright (Optional but professional) */}
                    <footer className="px-10 py-6 text-center text-slate-400 dark:text-slate-600 text-xs font-medium uppercase tracking-widest bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm border-t border-slate-100 dark:border-slate-900">
                        © 2026 SkillBridge Learning Suite • Made with Precision
                    </footer>
                </div>
            </div>

            {/* Global Background Blobs (Soft & Minimal for Dashboard) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[100px]" />
            </div>
        </div>
    );
}
