/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import {
  Search,
  Filter,
  Star,
  Users,
  ChevronRight,
  BookOpen,
  X,
  Sparkles
} from 'lucide-react';

const categories = ['All', 'Programming', 'Web Development', 'Data Science', 'Cloud & DevOps'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await api.getCourses();
        setCourses(response.courses || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' ||
      course.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      course.tags?.some((tag: string) => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Dynamic Header */}
      <div className="relative bg-slate-900 border-b border-white/5 pt-32 pb-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              <span>SkillBridge Catalog</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Master New <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Dimensions</span> of Tech
            </h1>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
              Unlock your potential with our expert-led programs designed for the next generation of digital pioneers.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Modern Filter Shell */}
      <div className="sticky top-[72px] z-40">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 shadow-sm">
          <div className="container-custom py-4">
            <div className="flex items-center gap-4">
              {/* Search Core */}
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses, mentors, or skills..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-white/5 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white transition-all placeholder:text-slate-500"
                />
              </div>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-slate-100 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="dark:bg-slate-900">{cat}</option>
                  ))}
                </select>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-3 bg-slate-100 dark:bg-white/5 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                >
                  {levels.map(level => (
                    <option key={level} value={level} className="dark:bg-slate-900">{level}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center p-3.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Drawer (Animated) */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden overflow-hidden"
                >
                  <div className="pt-4 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border-none rounded-xl text-sm font-medium"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border-none rounded-xl text-sm font-medium"
                      >
                        {levels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main Catalog View */}
      <div className="container-custom py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold dark:text-white">Active Curriculum</h3>
            <p className="text-slate-500 text-sm">Found {filteredCourses.length} programs matching your path</p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="flex items-center gap-1 text-xs font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-600"
            >
              Clear Results <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-white/5 rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 animate-pulse h-[400px]">
                <div className="h-48 bg-slate-200 dark:bg-white/10" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-200 dark:bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-1/2" />
                  <div className="h-20 bg-slate-200 dark:bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10"
          >
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold dark:text-white mb-2">No Courses Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              We couldn't find anything matching your current filters. Try expanding your search or selecting a different category.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCourses.map((course) => (
              <motion.div key={course._id || course.id} variants={itemVariants}>
                <Link
                  to={`/courses/${course._id || course.id}`}
                  className="group relative flex flex-col h-full bg-white dark:bg-white/5 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
                >
                  {/* Visual Header */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                        {course.level}
                      </span>
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-black/5 dark:border-white/10 shadow-lg">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold dark:text-white">{course.rating || 4.5}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest opacity-90">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> {(course.modules || []).length} Modules
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {(course.enrolledStudents || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Core Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight transition-colors group-hover:text-indigo-500">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Progress Indication / Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(course.tags || []).slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Transaction Block */}
                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          ₹{(course.price || 0).toLocaleString()}
                        </span>
                        {course.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{course.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl shadow-slate-200 dark:shadow-none">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Decorative Footer Element */}
      <div className="container-custom pb-24 text-center">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent mb-12" />
        <p className="text-slate-400 text-sm mb-4">Can't find what you're looking for?</p>
        <button className="px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md transition-all">
          Request Custom Training
        </button>
      </div>
    </div>
  );
}
