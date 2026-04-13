import { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';



// Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const RecruiterLogin = lazy(() => import('./pages/RecruiterLogin'));
const RecruiterRegister = lazy(() => import('./pages/RecruiterRegister'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Contact = lazy(() => import('./pages/Contact'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const LearningInterface = lazy(() => import('./pages/LearningInterface'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const MyCourses = lazy(() => import('./pages/MyCourses'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));
const LifeAtSkillBridge = lazy(() => import('./pages/LifeAtSkillBridge'));
const Career = lazy(() => import('./pages/Career'));
const CareerRoadmap = lazy(() => import('./pages/CareerRoadmap'));
const SkillTracker = lazy(() => import('./pages/SkillTracker'));
const GitHubSync = lazy(() => import('./pages/GitHubSync'));
const AITutor = lazy(() => import('./pages/AITutor'));
const PracticeLab = lazy(() => import('./pages/PracticeLab'));
const CommunicationBuilder = lazy(() => import('./pages/CommunicationBuilder'));
const InternshipHub = lazy(() => import('./pages/InternshipHub'));
const CollaborativeHub = lazy(() => import('./pages/CollaborativeHub'));
const CollaborationDashboard = lazy(() => import('./pages/CollaborationDashboard'));
const CommunityPublic = lazy(() => import('./pages/CommunityPublic'));
const CommunityDashboard = lazy(() => import('./pages/CommunityDashboard'));
const PlacementDashboard = lazy(() => import('./pages/PlacementDashboard'));
const Blogs = lazy(() => import('./pages/Blogs'));
const Certificate = lazy(() => import('./pages/Certificate'));
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate'));
const PracticeLayout = lazy(() => import('./pages/LogicPractice/PracticeLayout'));
const Opportunities = lazy(() => import('./pages/Opportunities'));
const OpportunitiesPublic = lazy(() => import('./pages/OpportunitiesPublic'));
const RecruiterDashboard = lazy(() => import('./pages/RecruiterDashboard'));
const AIInterview = lazy(() => import('./pages/AIInterview/AIInterview'));

// Loader component for suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
    <div className="w-12 h-12 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
  </div>
);

// Sonner
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes - No Shell or Different Shell */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recruiter-login" element={<RecruiterLogin />} />
          <Route path="/recruiter-register" element={<RecruiterRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/verify/:enrollmentId" element={<VerifyCertificate />} />
          <Route path="/courses" element={<MainLayout><Courses /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/life" element={<MainLayout><LifeAtSkillBridge /></MainLayout>} />
          <Route path="/careers" element={<MainLayout><Career /></MainLayout>} />
          <Route path="/blogs" element={<MainLayout><Blogs /></MainLayout>} />
          <Route path="/practice" element={<PracticeLayout />} />
          <Route path="/community" element={<CommunityPublic />} />
          <Route path="/opportunities" element={<OpportunitiesPublic />} />

          {/* User Dashboard & Learning */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/dashboard/career" element={<ProtectedRoute><CareerRoadmap /></ProtectedRoute>} />
          <Route path="/dashboard/skills" element={<ProtectedRoute><SkillTracker /></ProtectedRoute>} />
          <Route path="/dashboard/github" element={<ProtectedRoute><GitHubSync /></ProtectedRoute>} />
          <Route path="/dashboard/ai-tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
          <Route path="/dashboard/practice" element={<ProtectedRoute><PracticeLab /></ProtectedRoute>} />
          <Route path="/dashboard/comm-builder" element={<ProtectedRoute><CommunicationBuilder /></ProtectedRoute>} />
          <Route path="/dashboard/internships" element={<ProtectedRoute><InternshipHub /></ProtectedRoute>} />
          <Route path="/dashboard/community" element={<ProtectedRoute><CollaborativeHub /></ProtectedRoute>} />
          <Route path="/dashboard/collaboration" element={<ProtectedRoute><CollaborationDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/community-feed" element={<ProtectedRoute><CommunityDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/hackathons" element={<ProtectedRoute><CollaborativeHub /></ProtectedRoute>} />
          <Route path="/dashboard/placement" element={<ProtectedRoute><PlacementDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/ai-interview" element={<ProtectedRoute><AIInterview /></ProtectedRoute>} />
          <Route path="/dashboard/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
          <Route path="/dashboard/recruiter" element={<ProtectedRoute><RecruiterDashboard /></ProtectedRoute>} />

          <Route
            path="/certificate/:id"
            element={
              <ProtectedRoute>
                <Certificate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:id"
            element={
              <MainLayout>
                <CourseDetail />
              </MainLayout>
            }
          />
          <Route
            path="/learn/:id"
            element={
              <ProtectedRoute>
                <LearningInterface />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 - Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
