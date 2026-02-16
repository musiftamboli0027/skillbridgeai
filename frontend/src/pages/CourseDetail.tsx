/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Clock,
  BarChart3,
  CheckCircle,
  Play,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Award,
  BookOpen,
  ShoppingCart,
  Loader2,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, enrollInCourse } = useAuth();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [relatedCourses, setRelatedCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch the specific course
        const courseData = await api.getCourse(id);
        setCourse(courseData.course);

        // Fetch all courses for related courses
        const allCoursesData = await api.getCourses();
        const related = (allCoursesData.courses || [])
          .filter((c: any) => (c._id || c.id) !== id)
          .slice(0, 3);
        setRelatedCourses(related);
      } catch (err: any) {
        console.error('Failed to fetch course:', err);
        setError(err.message || 'Failed to load course');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const isEnrolled = user?.enrolledCourses?.some((c: any) => {
    if (typeof c === 'string') return c === id;
    if (typeof c.course === 'string') return c.course === id;
    return (c.course?._id === id || c.course?.id === id);
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#8b5cf6] animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Preparing your learning path...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold dark:text-white mb-4">Course Unavailable</h1>
          <p className="text-slate-500 mb-8">
            {error || "The program you're looking for might have been moved or is currently private."}
          </p>
          <Link to="/courses" className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all">
            Explore Alternatives
          </Link>
        </div>
      </div>
    );
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(m => m !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!course) return;

    try {
      setIsEnrolling(true);

      const courseId = course._id || course.id;
      const response = await api.createPaymentOrder(courseId);

      if (response.isFree) {
        await enrollInCourse(courseId);
        window.location.href = '/#/dashboard';
        window.location.reload();
        return;
      }

      const order = response.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RqcnSOFMz23OWi',
        amount: order.amount,
        currency: order.currency,
        name: 'SKILLBRIDGE',
        description: `Enrollment for ${course.title}`,
        order_id: order.orderId,
        handler: async (paymentResponse: any) => {
          try {
            const result = await api.verifyPayment({
              ...paymentResponse,
              razorpay_order_id: order.orderId,
              courseId: course._id || course.id
            });

            if (result.success) {
              window.location.href = '/#/dashboard';
              window.location.reload();
            }
          } catch (error: any) {
            console.error('Verification failed:', error);
            alert(`Payment verification failed: ${error.message}`);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#8b5cf6',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Enrollment error:', error);
      if (confirm('Direct enrollment for demo?')) {
        const courseId = course._id || course.id;
        await enrollInCourse(courseId);
        window.location.href = '/#/dashboard';
        window.location.reload();
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const totalLessons = (course.modules || []).reduce((acc: number, m: any) => acc + (m.lessons || []).length, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Premium Hero Section */}
      <div className="relative bg-slate-900 pt-32 pb-48 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative z-10">
          <Link to="/courses" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Active Catalog
          </Link>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-wrap items-center gap-4 mb-6"
            >
              <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-600/20">
                {course.level || 'Professional'}
              </span>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm text-yellow-400 text-sm font-bold">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span>{course.rating || 4.9}</span>
                <span className="text-white/40 font-medium">({(course.enrolledStudents || 1240).toLocaleString()}+ Learning)</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight"
            >
              {course.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 mb-8 leading-relaxed max-w-2xl"
            >
              {course.subtitle || 'Become an industry expert with our structured, project-based curriculum path.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 p-0.5 overflow-hidden">
                <img
                  src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80'}
                  alt={course.instructor?.name}
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <div>
                <p className="text-white font-bold">{course.instructor?.name || 'Dr. Alex Rivers'}</p>
                <p className="text-indigo-400 text-xs font-black uppercase tracking-widest">{course.instructor?.role || 'Senior Software Engineer'}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container-custom -mt-24 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Detailed Info */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <h2 className="text-2xl font-black dark:text-white mb-6 tracking-tight">Curriculum Preview</h2>
              <div
                className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: course.fullDescription || course.description || 'Detailed curriculum roadmap coming soon.' }}
              />
            </div>

            {/* Learning Outcomes */}
            <div className="bg-indigo-600 rounded-[32px] p-8 text-white">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <Zap className="w-6 h-6" /> Mastery Outcomes
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {(course.features || ['Industry standard tools', 'Advanced patterns', 'Real-world deployment', 'Certification']).map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <CheckCircle className="w-6 h-6 text-indigo-200 flex-shrink-0" />
                    <span className="text-sm font-bold leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Modules Accordion */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black dark:text-white">Module Roadmap</h3>
                <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">{totalLessons} Key Milestones</span>
              </div>

              <div className="space-y-3">
                {(course.modules || []).map((module: any, index: number) => (
                  <div key={module.id || module._id || `module-${index}`} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[24px] overflow-hidden transition-all shadow-sm">
                    <button
                      onClick={() => toggleModule(module.id || module._id)}
                      className="w-full flex items-center justify-between p-6 text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-black text-slate-400 dark:text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white leading-tight">{module.title}</p>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{(module.lessons || []).length} Strategic Lessons</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center dark:text-white">
                        {expandedModules.includes(module.id || module._id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedModules.includes(module.id || module._id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6"
                        >
                          <div className="pt-2 space-y-2">
                            {(module.lessons || []).map((lesson: any, lIndex: number) => (
                              <div key={lIndex} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group/lesson">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0 group-hover/lesson:scale-110 transition-transform">
                                  {lesson.type === 'video' ? <Play className="w-5 h-5 text-indigo-600" /> : <BookOpen className="w-5 h-5 text-indigo-600" />}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-900 dark:text-white">{lesson.title}</p>
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{lesson.duration} • {lesson.type}</p>
                                </div>
                                {lesson.isPreview && (
                                  <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-full uppercase tracking-tighter">Preview</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sticky Enrollment Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none"
              >
                <div className="p-2">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-56 object-cover rounded-[24px] shadow-sm"
                  />
                </div>

                <div className="p-8">
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-4xl font-black dark:text-white tracking-tighter">₹{(course.price || 0).toLocaleString()}</span>
                    {course.originalPrice && (
                      <span className="text-lg text-slate-400 line-through">₹{course.originalPrice.toLocaleString()}</span>
                    )}
                    <span className="ml-auto px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-md">80% OFF</span>
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={() => navigate(`/learn/${course._id || course.id}`)}
                      className="w-full py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-600/20 shadow-xl"
                    >
                      <Zap className="w-5 h-5" /> Continue Learning
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      className="w-full py-5 bg-indigo-600 hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-70"
                    >
                      {isEnrolling ? <Loader2 className="w-6 h-6 animate-spin" /> : <><ShoppingCart className="w-5 h-5" /> Enroll Path</>}
                    </button>
                  )}

                  <div className="mt-8 space-y-4">
                    {[
                      { icon: Clock, label: 'Access Control', detail: 'Lifetime Learning' },
                      { icon: BookOpen, label: 'Curriculum', detail: `${totalLessons} Milestones` },
                      { icon: BarChart3, label: 'Difficulty', detail: course.level || 'Professional' },
                      { icon: Award, label: 'Outcome', detail: 'Verified Certificate' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">{item.label}</p>
                          <p className="text-sm font-bold dark:text-white leading-none">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                      <ShieldCheck className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                        Secure checkout. 7-day technical support guarantee included with full enrollment.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Related Courses Mini-Grid */}
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-black uppercase tracking-tighter dark:text-white">Next in your path</h4>
                <div className="space-y-3">
                  {relatedCourses.map((related) => (
                    <Link
                      key={related._id || related.id}
                      to={`/courses/${related._id || related.id}`}
                      className="flex items-center gap-4 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-indigo-500 transition-all group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={related.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold dark:text-white truncate group-hover:text-indigo-500 transition-colors">{related.title}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">₹{related.price?.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
