import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { Mic, Camera, Brain, ChevronRight, Upload, Briefcase, User, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateInterviewData } = useInterview();
  const [formData, setFormData] = useState({
    candidateName: '',
    role: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    type: 'technical' as 'technical' | 'hr' | 'mixed',
  });
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState<File | null>(null);

  const roles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Product Manager',
    'UX Designer',
    'DevOps Engineer',
    'Machine Learning Engineer',
    'Mobile Developer',
  ];

  const handleStart = async () => {
    if (!formData.candidateName || !formData.role) return;

    setLoading(true);
    try {
      // For demo purposes, generate mock questions
      // In production, this would call the backend API
      const mockQuestions = generateMockQuestions(formData.role, formData.difficulty, formData.type);

      updateInterviewData({
        ...formData,
        questions: mockQuestions,
        startTime: new Date().toISOString(),
      });

      navigate('/interview');
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please try again.');
    }
    setLoading(false);
  };

  const generateMockQuestions = (role: string, difficulty: string, type: string) => {
    const questions: { text: string; category: string; difficulty: string }[] = [
      {
        text: `Tell me about yourself and why you're interested in this ${role} position.`,
        category: 'behavioral',
        difficulty: 'easy',
      },
      {
        text: `What are your greatest strengths that make you a good fit for this ${role} role?`,
        category: 'behavioral',
        difficulty: 'easy',
      },
      {
        text: `Describe a challenging project you worked on and how you overcame the obstacles.`,
        category: 'behavioral',
        difficulty: 'medium',
      },
      {
        text: `How do you stay updated with the latest technologies and trends in ${role}?`,
        category: 'technical',
        difficulty: 'medium',
      },
      {
        text: `Explain a complex technical concept you've worked with to a non-technical person.`,
        category: 'communication',
        difficulty: 'medium',
      },
      {
        text: `Where do you see yourself in 5 years in your career as a ${role}?`,
        category: 'behavioral',
        difficulty: 'medium',
      },
    ];

    // Filter based on type
    if (type === 'technical') {
      questions.push({
        text: `Describe your experience with the core technologies required for this ${role} position.`,
        category: 'technical',
        difficulty: difficulty,
      });
    } else if (type === 'hr') {
      questions.push({
        text: `How do you handle conflicts with team members or stakeholders?`,
        category: 'behavioral',
        difficulty: difficulty,
      });
    }

    return questions;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
    }
  };

  const isFormValid = formData.candidateName && formData.role;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Interview Pro
            </span>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Live Demo
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Master Your Interview with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI-Powered
            </span>{' '}
            Practice
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get real-time feedback on your answers, body language, and confidence. 
            Practice with AI-generated questions tailored to your role.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            icon={<Brain className="w-8 h-8 text-blue-600" />}
            title="AI-Powered Questions"
            description="Dynamic questions tailored to your role, experience level, and interview type"
            color="blue"
          />
          <FeatureCard
            icon={<Mic className="w-8 h-8 text-green-600" />}
            title="Voice Interaction"
            description="Natural speech-to-text for realistic interview practice with instant feedback"
            color="green"
          />
          <FeatureCard
            icon={<Camera className="w-8 h-8 text-purple-600" />}
            title="Behavior Analysis"
            description="Real-time feedback on confidence, eye contact, and facial expressions"
            color="purple"
          />
        </div>

        {/* Configuration Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Configure Your Interview</h2>
                  <p className="text-gray-500 text-sm">Customize your practice session</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.candidateName}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                    className="h-12"
                  />
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-700 font-medium flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Target Role
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select a role..." />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value: 'easy' | 'medium' | 'hard') =>
                        setFormData({ ...formData, difficulty: value })
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Interview Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'technical' | 'hr' | 'mixed') =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="hr">HR/Behavioral</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Resume (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer block">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {resume ? resume.name : 'Click to upload PDF or Word document'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Max file size: 5MB
                      </p>
                    </label>
                  </div>
                </div>

                {/* Start Button */}
                <Button
                  onClick={handleStart}
                  disabled={loading || !isFormValid}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Preparing Interview...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Start Interview
                      <ChevronRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-500">
                  You'll need camera and microphone access for the full experience
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Configure', desc: 'Set your role and preferences' },
              { step: '2', title: 'Practice', desc: 'Answer AI-generated questions' },
              { step: '3', title: 'Analyze', desc: 'Get real-time feedback' },
              { step: '4', title: 'Improve', desc: 'Review detailed insights' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mb-3">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10',
    green: 'from-green-500/10 to-green-600/5 hover:from-green-500/20 hover:to-green-600/10',
    purple: 'from-purple-500/10 to-purple-600/5 hover:from-purple-500/20 hover:to-purple-600/10',
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`h-full bg-gradient-to-br ${colorClasses[color]} border-0 shadow-lg`}>
        <CardContent className="p-6 text-center">
          <div className="mb-4 flex justify-center">{icon}</div>
          <h3 className="font-semibold text-lg mb-2 text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LandingPage;
