import { useState } from 'react';
import {
    Plus, Search, Filter, Edit,
    Trash2, Copy, Eye, X, BookOpen
} from 'lucide-react';
import { mockCourses } from '../../data/mockData';

export function CourseManager() {
    const [courses] = useState(mockCourses);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Courses</h1>
                    <p className="text-[#94A3B8] mt-1 text-sm font-medium">Manage your university's courses</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary"
                >
                    <Plus size={18} />
                    Create Course
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search courses..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#10B981]/50"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${statusFilter === 'all'
                                ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                : 'bg-white/5 text-[#94A3B8] hover:bg-white/10'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter('published')}
                        className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${statusFilter === 'published'
                                ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                : 'bg-white/5 text-[#94A3B8] hover:bg-white/10'
                            }`}
                    >
                        Pub
                    </button>
                    <button
                        onClick={() => setStatusFilter('draft')}
                        className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${statusFilter === 'draft'
                                ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                                : 'bg-white/5 text-[#94A3B8] hover:bg-white/10'
                            }`}
                    >
                        Draft
                    </button>
                </div>
                <button className="hidden sm:block p-2.5 rounded-xl bg-white/5 text-[#94A3B8] hover:bg-white/10 transition-colors">
                    <Filter size={18} />
                </button>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="glass-card overflow-hidden group">
                        {/* Thumbnail */}
                        <div className="h-40 bg-gradient-to-br from-[#00D4FF]/20 to-[#7C3AED]/20 flex items-center justify-center relative">
                            <BookOpen size={48} className="text-[#00D4FF]/50" />
                            <div className="absolute top-3 right-3">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${course.status === 'published'
                                        ? 'bg-[#10B981]/20 text-[#10B981]'
                                        : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                                    }`}>
                                    {course.status}
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                                    <Eye size={18} />
                                </button>
                                <button className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                                    <Edit size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <h3 className="text-white font-bold truncate">{course.title}</h3>
                            <p className="text-sm text-[#94A3B8] mt-1 font-medium">{course.instructor}</p>

                            <div className="flex items-center gap-4 mt-3 text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                                <span>{course.totalLessons} lessons</span>
                                <span>{course.totalAssignments} assignments</span>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-[#00D4FF]/20 flex items-center justify-center text-[10px] font-bold text-[#00D4FF]">
                                        {course.enrolledCount}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">enrolled</span>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] transition-colors">
                                        <Edit size={14} />
                                    </button>
                                    <button className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] transition-colors">
                                        <Copy size={14} />
                                    </button>
                                    <button className="p-1.5 rounded-lg hover:bg-[#EF4444]/10 text-[#EF4444] transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="glass-card w-full max-w-lg p-6 animate-slide-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Create New Course</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 rounded-lg hover:bg-white/10 text-[#94A3B8]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Course Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Advanced React Patterns"
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="Brief description of the course..."
                                    className="input-field resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">Level</label>
                                    <select className="input-field">
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">Duration</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 8 weeks"
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="ai-tutor" className="rounded border-white/20 bg-white/5" />
                                <label htmlFor="ai-tutor" className="text-sm font-medium text-[#94A3B8]">
                                    Enable AI Tutor for this course
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="btn-primary flex-1"
                            >
                                Create Course
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
