import { useState } from 'react';
import { AdminSidebar } from './admin/components/admin/AdminSidebar';
import { AdminTopBar } from './admin/components/admin/AdminTopBar';
import { AdminDashboardView } from './admin/views/admin/AdminDashboardView';
import { SuperDashboardView } from './admin/views/superadmin/SuperDashboardView';
import { CourseManager } from './admin/views/admin/CourseManager';
import { AIConfigView } from './admin/views/admin/AIConfigView';
import { AnalyticsView } from './admin/views/admin/AnalyticsView';
import { CourseApprovalView } from './admin/views/superadmin/CourseApprovalView';
import { RecruiterManager } from './admin/views/admin/RecruiterManager';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

type AdminView = 'dashboard' | 'courses' | 'students' | 'assignments' | 'analytics' | 'ai-config' | 'settings' | 'super-dashboard' | 'universities' | 'global-analytics' | 'subscriptions' | 'system-ai' | 'course-ingestion' | 'recruiters';

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<AdminView>(
    user?.role === 'super_admin' ? 'super-dashboard' : 'dashboard'
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Initial view set by useState initialization.

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#03040A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00D4FF]/20 border-t-[#00D4FF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'university_admin' && user?.role !== 'super_admin')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#03040A] text-[#FAFBFC] font-inter">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        
        :root {
          --admin-bg: #03040A;
          --admin-card: rgba(17, 24, 39, 0.7);
          --admin-border: rgba(255, 255, 255, 0.06);
          --admin-accent: #00D4FF;
          --admin-secondary: #7C3AED;
          --admin-success: #10B981;
        }

        .font-inter { font-family: 'Inter', sans-serif; }
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .glass-card {
          background: var(--admin-card);
          backdrop-filter: blur(24px);
          border: 1px solid var(--admin-border);
          border-radius: 16px;
          box-shadow: 0 32px 64px rgba(0, 0, 0, 0.4);
        }

        .glass-card-sm {
          background: rgba(17, 24, 39, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid var(--admin-border);
          border-radius: 12px;
        }

        .btn-primary {
          background: var(--admin-accent);
          color: var(--admin-bg);
          padding: 10px 24px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0, 212, 255, 0.35);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #FAFBFC;
          padding: 10px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
          border: 1px solid var(--admin-border);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .input-field {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--admin-border);
          border-radius: 10px;
          padding: 12px 16px;
          color: #FAFBFC;
          font-size: 14px;
          transition: all 0.2s ease;
          width: 100%;
        }

        .input-field:focus {
          outline: none;
          border-color: var(--admin-accent);
          background: rgba(255, 255, 255, 0.08);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
      `}</style>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view as AdminView)}
        />

        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-0 lg:ml-64'}`}>
          <AdminTopBar
            onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <main className="flex-1 p-4 lg:p-8 overflow-x-hidden bg-[#03040A]">
            <div className="max-w-7xl mx-auto">
              {currentView === 'dashboard' && <AdminDashboardView />}
              {currentView === 'super-dashboard' && <SuperDashboardView />}
              {currentView === 'courses' && <CourseManager />}
              {currentView === 'ai-config' && <AIConfigView />}
              {currentView === 'analytics' && <AnalyticsView />}
              {currentView === 'course-ingestion' && <CourseApprovalView />}
              {currentView === 'recruiters' && <RecruiterManager />}
              {(currentView === 'students' || currentView === 'universities') && (
                <div className="glass-card p-12 text-center animate-slide-in">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {currentView === 'students' ? 'Student Management' : 'University Management'}
                  </h2>
                  <p className="text-[#94A3B8]">Coming soon: Comprehensive tracking and analytics.</p>
                </div>
              )}
              {(currentView === 'assignments' || currentView === 'subscriptions') && (
                <div className="glass-card p-12 text-center animate-slide-in">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {currentView === 'assignments' ? 'Assignment Review' : 'Subscription Manager'}
                  </h2>
                  <p className="text-[#94A3B8]">Manage {currentView === 'assignments' ? 'student submissions' : 'platform subscriptions'} with AI assistance.</p>
                </div>
              )}
              {(currentView === 'analytics' || currentView === 'global-analytics') && currentView !== 'analytics' && (
                <div className="glass-card p-12 text-center animate-slide-in">
                  <h2 className="text-2xl font-bold text-white mb-2">Global Platform Analytics</h2>
                  <p className="text-[#94A3B8]">Advanced insights into the entire platform ecosystem.</p>
                </div>
              )}
              {currentView === 'system-ai' && (
                <div className="glass-card p-12 text-center animate-slide-in">
                  <h2 className="text-2xl font-bold text-white mb-2">System AI Control</h2>
                  <p className="text-[#94A3B8]">Global LLM orchestration and token management.</p>
                </div>
              )}
              {currentView === 'settings' && (
                <div className="glass-card p-12 animate-slide-in">
                  <h1 className="text-2xl font-bold text-white mb-4">University Settings</h1>
                  <p className="text-[#94A3B8] mb-8">Configure your university's profile and global settings.</p>

                  <div className="space-y-6 max-w-2xl">
                    <div className="p-4 border border-white/5 rounded-xl bg-white/5">
                      <h3 className="text-white font-bold mb-1">University Name</h3>
                      <p className="text-xs text-[#64748B] mb-3">Visible to all students in certificates and communications.</p>
                      <input className="input-field" defaultValue="SkillBridge University" />
                    </div>

                    <div className="p-4 border border-white/5 rounded-xl bg-white/5">
                      <h3 className="text-white font-bold mb-1">Domain Restriction</h3>
                      <p className="text-xs text-[#64748B] mb-3">Limit registration to specific email domains.</p>
                      <input className="input-field" defaultValue="skillbridge.edu" />
                    </div>

                    <button className="btn-primary">Save Changes</button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
