import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';



// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RecruiterLogin from './pages/RecruiterLogin';
import RecruiterRegister from './pages/RecruiterRegister';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import VerifyEmail from './pages/VerifyEmail';
import LearningInterface from './pages/LearningInterface';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyCourses from './pages/MyCourses';
import Settings from './pages/Settings';
import About from './pages/About';
import LifeAtSkillBridge from './pages/LifeAtSkillBridge';
import Career from './pages/Career';
import CareerRoadmap from './pages/CareerRoadmap';
import SkillTracker from './pages/SkillTracker';
import GitHubSync from './pages/GitHubSync';
import AITutor from './pages/AITutor';
import PracticeLab from './pages/PracticeLab';
import CommunicationBuilder from './pages/CommunicationBuilder';
import InternshipHub from './pages/InternshipHub';
import CollaborativeHub from './pages/CollaborativeHub';
import CollaborationDashboard from './pages/CollaborationDashboard';
import CommunityPublic from './pages/CommunityPublic';
import CommunityDashboard from './pages/CommunityDashboard';
import PlacementDashboard from './pages/PlacementDashboard';
import Blogs from './pages/Blogs';
import Certificate from './pages/Certificate';
import VerifyCertificate from './pages/VerifyCertificate';
import PracticeLayout from './pages/LogicPractice/PracticeLayout';
import Opportunities from './pages/Opportunities';
import OpportunitiesPublic from './pages/OpportunitiesPublic';
import RecruiterDashboard from './pages/RecruiterDashboard';

import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <Router>
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
      </Router>
    </AuthProvider>
  );
}

export default App;
