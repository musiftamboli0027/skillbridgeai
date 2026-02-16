import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  DollarSign,
  UserCheck,
  BarChart3,
  Globe,
  Loader2,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    fullDescription: '',
    category: 'Web Development',
    level: 'Beginner',
    duration: '',
    price: 0,
    originalPrice: 0,
    image: '',
    tags: '',
    features: ''
  });

  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [jsonContent, setJsonContent] = useState('');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [stats, coursesRes, studentsRes, enrollmentsRes] = await Promise.all([
        api.getAdminStats(),
        api.getCourses(),
        api.getStudents(),
        api.getAllEnrollments()
      ]);

      setDashboardData(stats);
      setAllCourses(coursesRes.courses || []);
      setStudents(studentsRes.students || []);
      setEnrollments(enrollmentsRes.enrollments || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.deleteCourse(id);
        fetchData(); // Refresh list
      } catch (error) {
        alert('Failed to delete course');
      }
    }
  };

  const handleOpenModal = (course: any = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        fullDescription: course.fullDescription,
        category: course.category,
        level: course.level,
        duration: course.duration,
        price: course.price,
        originalPrice: course.originalPrice,
        image: course.image,
        tags: course.tags?.join(', ') || '',
        features: course.features?.join(', ') || ''
      });
      setJsonContent(JSON.stringify(course, null, 2));
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        fullDescription: '',
        category: 'Web Development',
        level: 'Beginner',
        duration: '',
        price: 0,
        originalPrice: 0,
        image: '',
        tags: '',
        features: ''
      });
      setJsonContent(JSON.stringify({
        title: "New Course",
        category: "Programming",
        level: "Beginner",
        price: 4999,
        modules: []
      }, null, 2));
    }
    setShowJsonEditor(false); // Reset to Form view by default
    setShowModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
        features: formData.features.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (editingCourse) {
        await api.updateCourse(editingCourse._id, payload);
      } else {
        await api.createCourse(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (error: any) {
      alert(error.message || 'Failed to save course');
    }
  };

  const handleSaveJson = async () => {
    try {
      const payload = JSON.parse(jsonContent);

      // Basic validation
      if (!payload.title || !payload.description) {
        alert('JSON must have at least title and description');
        return;
      }

      if (editingCourse) {
        // Scrub internal fields that shouldn't be updated in the body
        const { _id, __v, createdAt, updatedAt, id, ...cleanPayload } = payload;
        await api.updateCourse(editingCourse._id, cleanPayload);
      } else {
        await api.createCourse(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (e: any) {
      alert('Invalid JSON: ' + e.message);
    }
  };

  const stats = [
    {
      label: 'Portfolio Value',
      value: `₹${(dashboardData?.payment?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: '#22c55e',
      trend: '+12.5%',
      description: 'Gross platform revenue'
    },
    {
      label: 'Active Cohorts',
      value: allCourses.length,
      icon: BookOpen,
      color: '#6366f1',
      trend: '+2 new',
      description: 'Programs in catalog'
    },
    {
      label: 'Global Alumni',
      value: dashboardData?.enrollment?.totalEnrollments || 0,
      icon: Users,
      color: '#8b5cf6',
      trend: '+48 this week',
      description: 'Authenticated learners'
    },
    {
      label: 'Engagement',
      value: `${dashboardData?.enrollment?.activeEnrollments || 0}`,
      icon: UserCheck,
      color: '#f43f5e',
      trend: '94% retention',
      description: 'In-progress enrollments'
    },
  ];

  const filteredCourses = allCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-8 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-lg shadow-indigo-600/40">
            <span className="text-white font-black text-xl italic">S</span>
          </div>
          <div>
            <span className="font-black text-lg text-white tracking-tighter">SKILLBRIDGE</span>
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] leading-none">Management</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {[
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'courses', label: 'Catalog', icon: BookOpen },
          { id: 'students', label: 'Learners', icon: Users },
          { id: 'analytics', label: 'Growth', icon: TrendingUp },
          { id: 'settings', label: 'Nodes', icon: Settings },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
              activeTab === item.id
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-white")} />
            <span className="font-bold text-sm">{item.label}</span>
            {activeTab === item.id && (
              <motion.div layoutId="activeTabIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/70 hover:bg-red-400/10 hover:text-red-400 transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          Terminate
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex max-h-screen overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0f172a] h-full fixed left-0 top-0 z-40 flex-shrink-0">
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-6 py-4 flex items-center justify-between flex-shrink-0 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Control Center
              </h1>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest hidden sm:block">
                Session Active: {user?.name || 'Admin'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all border border-slate-200 dark:border-white/10"
            >
              <Globe className="w-4 h-4" />
              Live Site
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-900 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-600/20 ring-2 ring-white dark:ring-slate-800">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 h-full">
              <Loader2 className="w-12 h-12 text-[#8b5cf6] animate-spin mb-4" />
              <p className="text-[#333333]">Loading dashboard data...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-6">
              {activeTab === 'dashboard' && (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={stat.label}
                        className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${stat.color}15` }}
                          >
                            <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                          </div>
                          <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500">
                            {stat.trend}
                          </span>
                        </div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{stat.value}</p>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-[10px] text-slate-400 mt-2">{stat.description}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activity & Actions */}
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50">
                      <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Stream: Live Enrollment</h2>
                        <button onClick={() => setActiveTab('analytics')} className="text-xs font-black uppercase tracking-widest text-indigo-600">History Log</button>
                      </div>

                      <div className="space-y-2">
                        {enrollments.length > 0 ? enrollments.slice(0, 5).map((enrollment: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-indigo-500/30 transition-all group">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-black text-lg shadow-inner">
                                {enrollment.user?.name?.charAt(0) || 'U'}
                              </div>
                              <div className="min-w-0">
                                <p className="font-black text-slate-900 dark:text-white text-sm">{enrollment.user?.name || 'Anonymous'}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate max-w-[180px]">
                                  {enrollment.course?.title || 'Unknown Asset'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-indigo-600 dark:text-indigo-400">₹{(enrollment.amount || 0).toLocaleString()}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                {enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleDateString() : 'REALTIME'}
                              </p>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-3xl">
                            <p className="text-slate-400 font-bold text-sm">Quiet channel. No recent data nodes.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]" />
                      <h2 className="text-xl font-black mb-8 relative z-10">Strategic Command</h2>
                      <div className="grid grid-cols-2 gap-4 relative z-10">
                        {[
                          { id: 'add', label: 'New Prototype', icon: Plus, color: 'bg-indigo-600', action: () => handleOpenModal() },
                          { id: 'students', label: 'Sync Users', icon: Users, color: 'bg-white/10', action: () => setActiveTab('students') },
                          { id: 'analytics', label: 'ROI Analysis', icon: BarChart3, color: 'bg-white/10', action: () => setActiveTab('analytics') },
                          { id: 'settings', label: 'Core Config', icon: Settings, color: 'bg-white/10', action: () => setActiveTab('settings') },
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={btn.action}
                            className={cn(
                              "flex flex-col items-center justify-center p-6 rounded-2xl transition-all border border-white/5 hover:border-white/20 hover:scale-[1.02] active:scale-95 group",
                              btn.color
                            )}
                          >
                            <btn.icon className="w-8 h-8 mb-3 group-hover:rotate-6 transition-transform" />
                            <p className="text-[10px] font-black uppercase tracking-widest">{btn.label}</p>
                          </button>
                        ))}
                      </div>

                      <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System Health: Operational</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'courses' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Program Inventory</h2>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Manage all active prototypes</p>
                    </div>
                    <button
                      onClick={() => handleOpenModal()}
                      className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      Add Node
                    </button>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-xl shadow-slate-200/50">
                    <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex gap-4 flex-col lg:flex-row">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Decrypt course archives..."
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 transition-all font-bold text-xs uppercase tracking-widest">
                          <Filter className="w-4 h-4" />
                          Filter
                        </button>
                      </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-white/5">
                            <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Asset & Track</th>
                            <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Complexity</th>
                            <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Node Cluster</th>
                            <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Valuation</th>
                            <th className="text-right px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Commands</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {filteredCourses.map((course) => (
                            <tr key={course.id} className="hover:bg-slate-50/80 dark:hover:bg-white/10 transition-colors group">
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <img src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'} alt={course.title} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors truncate">{course.title}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{course.category || 'MERN Tech'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <span className={cn(
                                  "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg",
                                  course.level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-500' :
                                    course.level === 'Intermediate' ? 'bg-amber-500/10 text-amber-500' :
                                      'bg-violet-500/10 text-violet-500'
                                )}>
                                  {course.level || 'Beginner'}
                                </span>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                    <Users className="w-3 h-3 text-slate-500" />
                                  </div>
                                  <span className="text-sm font-black text-slate-700 dark:text-slate-300">{(course.enrolledStudents || 0).toLocaleString()}</span>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <p className="text-sm font-black text-indigo-600 tracking-tight">₹{(course.price || 0).toLocaleString()}</p>
                              </td>
                              <td className="px-8 py-5 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleOpenModal(course)}
                                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCourse(course._id)}
                                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden divide-y divide-slate-100 dark:divide-white/5">
                      {filteredCourses.map((course) => (
                        <div key={course.id} className="p-6 space-y-4">
                          <div className="flex items-center gap-4">
                            <img src={course.image} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-black text-slate-900 dark:text-white truncate">{course.title}</h3>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{course.level}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div>
                              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Pricing</p>
                              <p className="text-lg font-black text-indigo-600">₹{course.price?.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenModal(course)}
                                className="p-3 bg-slate-100 dark:bg-white/5 text-blue-600 rounded-xl"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course._id)}
                                className="p-3 bg-slate-100 dark:bg-white/5 text-red-600 rounded-xl"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {filteredCourses.length === 0 && (
                      <div className="text-center py-24 bg-slate-50/50 dark:bg-white/5">
                        <Search className="w-16 h-16 text-slate-200 dark:text-white/10 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold">No archives matching "{searchQuery}" found in mainframe.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'students' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-xl shadow-slate-200/50">
                    <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Access Registry: Alumni</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Total Authenticated Nodes: {students.length}</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse min-w-[600px]">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-white/5">
                            <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Identity</th>
                            <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Contact Vector</th>
                            <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Registry Date</th>
                            <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Active Links</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {students.map((student: any) => (
                            <tr key={student._id} className="hover:bg-slate-50/80 dark:hover:bg-white/10 transition-colors group">
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-600/20 ring-2 ring-white/10">
                                    {student.name?.charAt(0) || 'U'}
                                  </div>
                                  <span className="font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{student.name}</span>
                                </div>
                              </td>
                              <td className="px-8 py-5 text-sm font-bold text-slate-500">{student.email}</td>
                              <td className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-tighter">
                                {new Date(student.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-8 py-5">
                                <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-lg text-[10px] font-black text-slate-600 dark:text-slate-400">
                                  {student.enrolledCourses?.length || 0} Assets
                                </span>
                              </td>
                            </tr>
                          ))}
                          {students.length === 0 && (
                            <tr>
                              <td colSpan={4} className="text-center py-24 text-slate-400 font-bold uppercase tracking-widest text-xs bg-slate-50/50">
                                Void signal. No alumni clusters detected.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-xl shadow-slate-200/50">
                    <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Transaction Ledger</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Fiscal Stream History</p>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest">
                        <TrendingUp className="w-4 h-4" /> Realtime Sync
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-white/5">
                            <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Entity</th>
                            <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Allocation</th>
                            <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Timestamp</th>
                            <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                            <th className="text-left px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Contract</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {enrollments.map((en: any) => (
                            <tr key={en._id} className="hover:bg-slate-50/80 dark:hover:bg-white/10 transition-colors group">
                              <td className="px-8 py-5">
                                <p className="font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{en.user?.name || 'Unknown'}</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Subscriber Node</p>
                              </td>
                              <td className="px-8 py-5">
                                <p className="text-sm font-black text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{en.course?.title || 'Unknown Course'}</p>
                              </td>
                              <td className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-tighter">
                                {en.createdAt ? new Date(en.createdAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-8 py-5">
                                <span className={cn(
                                  "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg",
                                  en.paymentStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                )}>
                                  {en.paymentStatus || 'pending'}
                                </span>
                              </td>
                              <td className="px-8 py-5 text-sm font-black text-indigo-500 italic uppercase tracking-tighter">{en.paymentPlan || 'full_access'}</td>
                            </tr>
                          ))}
                          {enrollments.length === 0 && (
                            <tr>
                              <td colSpan={5} className="text-center py-24 text-slate-400 font-bold uppercase tracking-widest text-xs bg-slate-50/50">
                                Ledger Empty. No fiscal telemetry.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-slate-900 rounded-[32px] p-12 border border-slate-200 dark:border-white/5 text-center shadow-xl max-w-2xl mx-auto"
                >
                  <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Settings className="w-10 h-10 text-indigo-600 animate-spin-slow" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Mainframe Configuration</h2>
                  <p className="text-slate-500 font-bold leading-relaxed mb-8">
                    System settings are currently locked to read-only. Comprehensive node management features are scheduled for the next deployment phase.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 opacity-50">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">API Key Status</p>
                      <p className="text-sm font-black text-slate-600 dark:text-slate-300">ACTIVE: RZP_TEST</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 opacity-50">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">CDN Cluster</p>
                      <p className="text-sm font-black text-slate-600 dark:text-slate-300">EDGE_UNSPLASH</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-slate-900 shadow-2xl z-50 flex flex-col h-full"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/50 hover:text-white bg-white/5 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <NavContent />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Re-polished */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[95vh] sm:h-auto sm:max-h-[85vh] rounded-t-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl relative z-10 flex flex-col"
            >
              <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-20">
                <div className="flex items-center gap-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {editingCourse ? 'Refine Asset' : 'Compile New Node'}
                  </h2>
                  <div className="flex bg-slate-100 dark:bg-white/5 rounded-2xl p-1 shadow-inner">
                    <button
                      onClick={() => setShowJsonEditor(false)}
                      className={cn(
                        "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                        !showJsonEditor ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      Interface
                    </button>
                    <button
                      onClick={() => setShowJsonEditor(true)}
                      className={cn(
                        "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                        showJsonEditor ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      Raw Data
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {showJsonEditor ? (
                  <div className="h-[600px] w-full border-b border-black/5">
                    <Editor
                      height="100%"
                      defaultLanguage="json"
                      value={jsonContent}
                      onChange={(value: string | undefined) => setJsonContent(value || '')}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        scrollBeyondLastLine: false,
                        automaticLayout: true
                      }}
                    />
                  </div>
                ) : (
                  <form id="courseForm" onSubmit={handleSaveCourse} className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-black">Title</label>
                        <input
                          required
                          type="text"
                          value={formData.title}
                          onChange={e => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
                          placeholder="e.g. MERN Stack Development"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-black">Subtitle</label>
                        <input
                          type="text"
                          value={formData.subtitle}
                          onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                          className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
                          placeholder="e.g. Full Stack JavaScript"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-black">Category</label>
                        <select
                          value={formData.category}
                          onChange={e => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:border-[#8b5cf6] bg-white"
                        >
                          <option>Programming</option>
                          <option>Web Development</option>
                          <option>Data Science</option>
                          <option>Cloud & DevOps</option>
                          <option>Mobile Development</option>
                          <option>Design</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-black">Level</label>
                        <select
                          value={formData.level}
                          onChange={e => setFormData({ ...formData, level: e.target.value })}
                          className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:border-[#8b5cf6] bg-white"
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-black">Duration (e.g. 12 weeks)</label>
                        <input
                          required
                          type="text"
                          value={formData.duration}
                          onChange={e => setFormData({ ...formData, duration: e.target.value })}
                          className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-black">Price (INR)</label>
                        <input
                          required
                          type="number"
                          value={formData.price}
                          onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium text-black">Image URL</label>
                        <input
                          required
                          type="text"
                          value={formData.image}
                          onChange={e => setFormData({ ...formData, image: e.target.value })}
                          className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium text-black">Description</label>
                        <textarea
                          required
                          rows={3}
                          value={formData.description}
                          onChange={e => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
                        />
                      </div>
                      {/* Tags and Features inputs here - retained from original */}
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium text-black">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={String(formData.tags || '')}
                          onChange={e => setFormData({ ...formData, tags: e.target.value })}
                          className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
                          placeholder="MongoDB, Express, React, Node.js"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium text-black">Features (comma separated)</label>
                        <input
                          type="text"
                          value={String(formData.features || '')}
                          onChange={e => setFormData({ ...formData, features: e.target.value })}
                          className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
                          placeholder="Certificates, Placement support, Hands-on projects"
                        />
                      </div>
                    </div>
                  </form>
                )}
              </div>

              <div className="flex justify-end gap-3 p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                >
                  Abort
                </button>
                <button
                  onClick={showJsonEditor ? handleSaveJson : undefined}
                  type={showJsonEditor ? 'button' : 'submit'}
                  form={showJsonEditor ? undefined : 'courseForm'}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                >
                  {editingCourse ? 'Update Archive' : 'Deploy Prototype'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
