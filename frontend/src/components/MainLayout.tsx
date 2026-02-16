import React from 'react';
import Header from '../sections/Header';
import Footer from '../sections/Footer';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-[70px]">
                {children}
            </main>
            <Footer />
        </div>
    );
};
