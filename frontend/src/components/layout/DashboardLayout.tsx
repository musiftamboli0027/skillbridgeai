import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '../../lib/utils';

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
        <div className="min-h-screen bg-[#03040A] flex text-white font-sans">

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

                <main className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
