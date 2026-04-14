import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import InterviewPage from './components/InterviewPage';
import ResultDashboard from './components/ResultDashboard';
import { InterviewProvider } from './context/InterviewContext';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <InterviewProvider>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/results" element={<ResultDashboard />} />
        </Routes>
      </AnimatePresence>
      <Toaster position="top-right" />
    </InterviewProvider>
  );
}

export default App;
