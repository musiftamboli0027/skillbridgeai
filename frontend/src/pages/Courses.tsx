/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { Button } from '../components/ui/button';
import {
  Search,
  Filter,
  Star,
  Users,
  ChevronRight,
  BookOpen,
  X,
  Sparkles,
  Zap
} from 'lucide-react';

const categories = ['All', 'Programming', 'Web Development', 'Data Science', 'Cloud & DevOps', 'Design', 'Mobile Development'];
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
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      course.title?.toLowerCase().includes(searchLower) ||
      course.description?.toLowerCase().includes(searchLower) ||
      course.category?.toLowerCase().includes(searchLower);

    const matchesCategory = selectedCategory === 'All' ||
      course.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      course.tags?.some((tag: string) => tag.toLowerCase() === selectedCategory.toLowerCase());

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
    <div className="min-h-screen bg-[#03040A] text-white selection:bg-[#00D4FF]/30">
      {/* Dynamic Header */}
      <div className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[#00D4FF]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-[#7C3AED]/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[#00D4FF] text-[10px] font-bold uppercase tracking-[0.3em] mb-8 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SkillBridge Curriculum v2.0</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
              Architect Your <br />
              <span className="text-gradient">Digital Future</span>
            </h1>
            <p className="text-[#94A3B8] text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
              Access institutional-grade technical training designed to transform learners into world-class engineers.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter Shell */}
      <div className="sticky top-0 z-40">
        <div className="bg-[#03040A]/80 backdrop-blur-2xl border-b border-white/5 py-4">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search Core */}
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-[#00D4FF] transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search architecture, modules, or skills..."
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#00D4FF]/50 transition-all font-medium"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 md:flex-none px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest text-[#94A3B8] focus:outline-none focus:border-[#00D4FF]/50 transition-all cursor-pointer appearance-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-[#0A0E1A]">{cat}</option>
                  ))}
                </select>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="flex-1 md:flex-none px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest text-[#94A3B8] focus:outline-none focus:border-[#00D4FF]/50 transition-all cursor-pointer appearance-none"
                >
                  {levels.map(level => (
                    <option key={level} value={level} className="bg-[#0A0E1A]">{level}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden p-3 bg-white/5 border border-white/5 rounded-xl text-[#94A3B8]"
                >
                  <Filter size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog View */}
      <div className="container-custom py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Active Learning Paths</h2>
            <p className="text-[#64748B] text-sm mt-1 uppercase tracking-widest font-bold">Found {filteredCourses.length} programs matching your search</p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="flex items-center gap-2 text-[10px] font-bold text-[#00D4FF] uppercase tracking-[0.2em] hover:text-[#00D4FF]/80"
            >
              Reset Filters <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card animate-pulse h-[420px] relative overflow-hidden">
                <div className="h-48 bg-white/5" />
                <div className="p-8 space-y-6">
                  <div className="h-8 bg-white/5 rounded-xl w-3/4" />
                  <div className="h-4 bg-white/5 rounded-lg w-1/2" />
                  <div className="h-24 bg-white/5 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 glass-card border-dashed"
          >
            <div className="w-20 h-20 bg-[#00D4FF]/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#00D4FF]/10">
              <Search className="w-8 h-8 text-[#00D4FF]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Courses Found</h3>
            <p className="text-[#94A3B8] max-w-sm mx-auto font-medium">
              We couldn't find any curriculum matching your current criteria.
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="btn-admin mt-8">
              View All Courses
            </Button>
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
                  className="group relative flex flex-col h-full glass-card overflow-hidden hover:shadow-[0_20px_50px_rgba(0,212,255,0.1)] transition-all duration-500 border-white/5"
                >
                  {/* Visual Header */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/40 to-transparent" />

                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg">
                          {course.level}
                        </span>
                        {course.features?.some((f: string) => f.toLowerCase().includes('3d')) && (
                          <span className="px-3 py-1 bg-[#00D4FF]/20 text-[#00D4FF] text-[9px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1 border border-[#00D4FF]/30">
                            <Zap size={10} fill="currentColor" /> 3D Logic
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-bold text-white">{course.rating || 4.5}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> {
                            course.modules?.length ||
                            course.weeks?.reduce((acc: number, w: any) => acc + (w.modules?.length || 0), 0) ||
                            0
                          } Modules
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> {(course.enrolledStudents || 0).toLocaleString()} Learners
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Core Content */}
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-[#00D4FF] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-[#94A3B8] text-sm line-clamp-2 mb-8 font-medium leading-[1.6]">
                      {course.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                      {(course.tags || []).slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-white/5 text-[#94A3B8] text-[9px] font-bold rounded-lg uppercase tracking-widest border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Transaction Block */}
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-white tracking-tight">
                            ₹{(course.price || 0).toLocaleString()}
                          </span>
                          {course.originalPrice && (
                            <span className="text-sm text-[#64748B] line-through font-medium">
                              ₹{course.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] font-bold uppercase text-[#10B981] mt-0.5 tracking-widest">Lifetime Access</span>
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-[#00D4FF] text-[#03040A] flex items-center justify-center transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)] group-hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] group-hover:scale-105 active:scale-95">
                        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
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
      <div className="container-custom pb-32 text-center lg:pt-12">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mb-16" />
        <p className="text-[#94A3B8] text-sm mb-6 font-medium uppercase tracking-[0.2em] opacity-60">Architecting Special Clarity?</p>
        <button className="px-10 py-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-white uppercase tracking-[0.2em] backdrop-blur-xl hover:bg-white/10 transition-all active:scale-95 shadow-2xl">
          Request Institutional Path
        </button>
      </div>
    </div>
  );
}
