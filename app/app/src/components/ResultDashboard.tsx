import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import {
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Download,
  Brain,
  Eye,
  Smile,
  Target,
  MessageSquare,
  Lightbulb,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ResultDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { interviewData, resetInterview } = useInterview();
  const { finalReport, candidateName, role } = interviewData;

  useEffect(() => {
    if (!finalReport) {
      navigate('/');
    }
  }, [finalReport, navigate]);

  if (!finalReport) return null;

  const {
    overallScore,
    categoryScores,
    strengths,
    weaknesses,
    improvements,
    behaviorAnalysis,
    feedback,
  } = finalReport;

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number): string => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const handleNewInterview = () => {
    resetInterview();
    navigate('/');
  };

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-12"
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 print:hidden">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Interview Results
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleNewInterview}>
              <RotateCcw className="w-4 h-4 mr-2" />
              New Interview
            </Button>
            <Button onClick={handleDownloadReport}>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Success Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white mb-6 shadow-lg"
          >
            <Award className="w-12 h-12" />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
          <p className="text-gray-600 text-lg">
            Great job, <span className="font-semibold text-gray-900">{candidateName}</span>! 
            Here's your detailed performance analysis for the{' '}
            <span className="font-semibold text-gray-900">{role}</span> position.
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8 border-0 shadow-xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div
                  className={`w-40 h-40 rounded-full ${getScoreBg(
                    overallScore
                  )} border-4 border-white shadow-lg flex items-center justify-center`}
                >
                  <div className="text-center">
                    <span className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>
                      {overallScore}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">out of 100</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Overall Performance</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{feedback}</p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  <Badge
                    className={`${
                      overallScore >= 80
                        ? 'bg-green-100 text-green-700'
                        : overallScore >= 60
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                  <Badge variant="secondary">{role}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="scores" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="scores">Category Scores</TabsTrigger>
            <TabsTrigger value="behavior">Behavior Analysis</TabsTrigger>
            <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(categoryScores).map(([category, score], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            {category === 'technical' && <Target className="w-5 h-5 text-blue-600" />}
                            {category === 'communication' && <MessageSquare className="w-5 h-5 text-blue-600" />}
                            {category === 'confidence' && <Star className="w-5 h-5 text-blue-600" />}
                            {category === 'clarity' && <Lightbulb className="w-5 h-5 text-blue-600" />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 capitalize">
                              {category.replace(/([A-Z])/g, ' $1').trim()}
                            </h3>
                          </div>
                        </div>
                        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</span>
                      </div>
                      <div className="space-y-2">
                        <Progress
                          value={score}
                          className="h-3"
                        />
                        <p className="text-sm text-gray-500">
                          {score >= 80
                            ? 'Excellent performance in this area'
                            : score >= 60
                            ? 'Good performance with room for improvement'
                            : 'Needs significant improvement'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Behavioral Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">Eye Contact</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className={`text-3xl font-bold ${getScoreColor(behaviorAnalysis.eyeContact)}`}>
                        {behaviorAnalysis.eyeContact}%
                      </span>
                    </div>
                    <Progress value={behaviorAnalysis.eyeContact} className="h-2 mt-2" />
                    <p className="text-sm text-gray-500 mt-2">
                      {behaviorAnalysis.eyeContact >= 70
                        ? 'Great eye contact with the camera'
                        : behaviorAnalysis.eyeContact >= 40
                        ? 'Moderate eye contact, try to look at the camera more'
                        : 'Limited eye contact detected'}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">Confidence Level</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className={`text-3xl font-bold ${getScoreColor(behaviorAnalysis.confidence)}`}>
                        {behaviorAnalysis.confidence}%
                      </span>
                    </div>
                    <Progress value={behaviorAnalysis.confidence} className="h-2 mt-2" />
                    <p className="text-sm text-gray-500 mt-2">
                      {behaviorAnalysis.confidence >= 70
                        ? 'You appeared very confident'
                        : behaviorAnalysis.confidence >= 40
                        ? 'Moderate confidence, work on posture'
                        : 'Low confidence detected, practice more'}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Smile className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-700">Dominant Expression</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-gray-900 capitalize">
                        {behaviorAnalysis.dominantExpression}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      {behaviorAnalysis.dominantExpression === 'happy'
                        ? 'You maintained a positive demeanor'
                        : behaviorAnalysis.dominantExpression === 'neutral'
                        ? 'Professional neutral expression'
                        : 'Try to show more positive expressions'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                        </div>
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Improvement Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Detailed Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {improvements.map((improvement, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500"
                    >
                      <h4 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        {improvement.area}
                      </h4>
                      <p className="text-blue-800">{improvement.suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 print:hidden">
          <Button
            onClick={handleNewInterview}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Start New Interview
          </Button>
          <Button onClick={handleDownloadReport} variant="outline" size="lg">
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm print:hidden">
          <p>AI Mock Interview System • Practice makes perfect</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultDashboard;
