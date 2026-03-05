/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { toast } from 'sonner';
import {
  TrendingUp, Award, BookOpen, Code2, Github, Target,
  CheckCircle2, Star, Flame, Trophy, ArrowUpRight, Plus, X,
  BarChart3, Clock, Shield
} from 'lucide-react';

const DOMAIN_OPTIONS = ['Software Development', 'AI/ML', 'Design', 'Marketing', 'Business', 'Data', 'DevOps', 'Mobile', 'Cybersecurity'];

const DOMAIN_COLORS: Record<string, string> = {
  'Software Development': '#00D4FF', 'AI/ML': '#7C3AED', 'Design': '#F59E0B',
  'Marketing': '#EC4899', 'Business': '#10B981', 'Data': '#3B82F6',
  'DevOps': '#EF4444', 'Mobile': '#06B6D4', 'Cybersecurity': '#8B5CF6'
};

const RANK_ICONS: Record<string, string> = {
  'Novice': '🌱', 'Apprentice': '⚡', 'Specialist': '🔷', 'Expert': '💎', 'Master': '🏆', 'Legend': '🔥'
};

export default function SkillTracker() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSkillEditor, setShowSkillEditor] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [editDomain, setEditDomain] = useState('');
  const [editLevel, setEditLevel] = useState('');
  const [editSkills, setEditSkills] = useState<string[]>([]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.getSkillAnalytics();
      if (res.success) {
        setAnalytics(res.analytics);
        setEditDomain(res.analytics.primaryDomain || '');
        setEditLevel(res.analytics.domainLevel || 'Beginner');
        setEditSkills(res.analytics.secondarySkills || []);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);

  const handleSaveSkills = async () => {
    try {
      await api.updateUserSkills({
        primaryDomain: editDomain,
        secondarySkills: editSkills,
        domainLevel: editLevel
      });
      toast.success('Skills updated!');
      setShowSkillEditor(false);
      fetchAnalytics();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !editSkills.includes(skillInput.trim())) {
      setEditSkills([...editSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  if (loading || !analytics) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 w-48 bg-white/5 rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-white/5 rounded-2xl" />)}
          </div>
          <div className="h-64 bg-white/5 rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={24} className="text-[#10B981]" /> Skill Tracker
            </h1>
            <p className="text-[#94A3B8] text-sm mt-1">Track your learning progress, XP, and skill growth</p>
          </div>
          <button onClick={() => setShowSkillEditor(!showSkillEditor)}
            className="px-4 py-2 bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl text-xs text-[#10B981] font-bold hover:bg-[#10B981]/15 transition-all flex items-center gap-1.5">
            <Target size={14} /> Edit Skills
          </button>
        </div>

        {/* XP & Level Hero */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 rounded-full blur-[100px] pointer-events-none"
            style={{ background: `${analytics.level?.color || '#10B981'}15` }} />
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* Rank Badge */}
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl shrink-0"
              style={{ background: `${analytics.level?.color || '#10B981'}15`, border: `2px solid ${analytics.level?.color || '#10B981'}30` }}>
              {RANK_ICONS[analytics.rank] || '🌱'}
            </div>
            {/* XP Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-3xl font-bold text-white">{analytics.xp.toLocaleString()} XP</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: `${analytics.level?.color}20`, color: analytics.level?.color }}>
                  {analytics.rank}
                </span>
              </div>
              <p className="text-sm text-[#94A3B8] mt-1">
                {analytics.xpToNextLevel > 0 ? `${analytics.xpToNextLevel} XP to ${analytics.level?.title === 'Novice' ? 'Apprentice' : 'next rank'}` : 'Max level reached!'}
              </p>
              {/* XP Progress Bar */}
              <div className="mt-3 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 max-w-md">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${analytics.xpProgressPercent}%`, background: `linear-gradient(90deg, ${analytics.level?.color}, ${analytics.level?.color}88)` }} />
              </div>
            </div>
            {/* Streak */}
            <div className="text-center px-6 py-4 bg-white/[0.03] rounded-2xl border border-white/5 shrink-0">
              <Flame size={20} className={`mx-auto mb-1 ${analytics.isActiveToday ? 'text-[#F59E0B]' : 'text-[#64748B]'}`} />
              <p className="text-2xl font-bold text-white">{analytics.streak}</p>
              <p className="text-[10px] text-[#94A3B8] font-medium">Day Streak</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'Courses', value: analytics.totalCourses, icon: BookOpen, color: '#00D4FF' },
            { label: 'Completed', value: analytics.completedCourses, icon: CheckCircle2, color: '#10B981' },
            { label: 'In Progress', value: analytics.inProgressCourses, icon: Clock, color: '#F59E0B' },
            { label: 'Lessons Done', value: analytics.totalLessonsCompleted, icon: Code2, color: '#7C3AED' },
            { label: 'Certificates', value: analytics.certificates, icon: Award, color: '#EC4899' },
            { label: 'Badges', value: analytics.badges?.length || 0, icon: Trophy, color: '#EF4444' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon size={16} style={{ color: s.color }} />
                  <ArrowUpRight size={12} className="text-white/10" />
                </div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-[#94A3B8] font-medium">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Progress */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-[#00D4FF]" /> Course Progress</h3>
              {analytics.courseProgress?.length > 0 ? (
                <div className="space-y-3">
                  {analytics.courseProgress.map((c: any, i: number) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm text-white font-medium">{c.title}</p>
                          <p className="text-[10px] text-[#64748B]">{c.completedLessons} lessons · {c.category || 'Course'}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${c.status === 'completed' ? 'bg-[#10B981]/20 text-[#10B981]' : c.status === 'active' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-white/5 text-[#64748B]'}`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${c.progress}%`, background: c.status === 'completed' ? '#10B981' : '#00D4FF' }} />
                      </div>
                      <p className="text-[10px] text-[#64748B] text-right mt-1">{c.progress}%</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen size={32} className="text-[#64748B] mx-auto mb-2" />
                  <p className="text-sm text-[#64748B]">No courses enrolled yet</p>
                </div>
              )}
            </div>

            {/* DSA & Coding Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 size={16} className="text-[#7C3AED]" />
                  <h3 className="text-white font-bold">DSA Progress</h3>
                </div>
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#7C3AED" strokeWidth="8"
                      strokeDasharray={`${(analytics.dsaProgress / 100) * 264} 264`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{analytics.dsaProgress}%</span>
                  </div>
                </div>
              </div>
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Github size={16} className="text-white" />
                  <h3 className="text-white font-bold">Coding Practice</h3>
                </div>
                <p className="text-4xl font-bold text-white text-center mt-4">{analytics.codingPracticeCount}</p>
                <p className="text-xs text-[#94A3B8] text-center mt-1">Total commits/submissions</p>
                <div className="mt-3">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${analytics.githubConnected ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'}`}>
                    {analytics.githubConnected ? '✓ GitHub Connected' : '✗ GitHub Not Connected'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Skills Profile */}
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Shield size={16} className="text-[#7C3AED]" /> Skills Profile</h3>
              {analytics.primaryDomain ? (
                <>
                  <div className="flex items-center gap-3 mb-3 px-3 py-2.5 rounded-xl"
                    style={{ background: `${DOMAIN_COLORS[analytics.primaryDomain] || '#64748B'}10`, border: `1px solid ${DOMAIN_COLORS[analytics.primaryDomain] || '#64748B'}25` }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: DOMAIN_COLORS[analytics.primaryDomain] || '#64748B' }} />
                    <div>
                      <p className="text-sm text-white font-bold">{analytics.primaryDomain}</p>
                      <p className="text-[10px] text-[#64748B]">{analytics.domainLevel}</p>
                    </div>
                  </div>
                  {analytics.secondarySkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {analytics.secondarySkills.map((s: string) => (
                        <span key={s} className="text-[10px] px-2.5 py-1 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] font-medium">{s}</span>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-[#64748B]">No skills set yet</p>
                  <button onClick={() => setShowSkillEditor(true)}
                    className="mt-2 text-xs text-[#10B981] hover:underline">+ Add Skills</button>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Trophy size={16} className="text-[#F59E0B]" /> Badges</h3>
              {analytics.badges?.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {analytics.badges.map((b: any, i: number) => (
                    <div key={i} className="text-center p-2 bg-white/[0.03] rounded-xl">
                      <span className="text-2xl">{b.icon || '🏅'}</span>
                      <p className="text-[9px] text-[#94A3B8] mt-1 truncate">{b.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Award size={28} className="text-[#64748B] mx-auto mb-2" />
                  <p className="text-xs text-[#64748B]">Complete lessons to earn badges</p>
                </div>
              )}
            </div>

            {/* Scores */}
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Star size={16} className="text-[#EC4899]" /> Activity Scores</h3>
              <div className="space-y-3">
                {[
                  { label: 'Technical Score', value: analytics.technicalScore, max: 100, color: '#00D4FF' },
                  { label: 'Collaboration Score', value: analytics.collaborationScore, max: 100, color: '#7C3AED' },
                  { label: 'Overall Progress', value: analytics.avgProgress, max: 100, color: '#10B981' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#94A3B8]">{s.label}</span>
                      <span className="text-white font-bold">{s.value}/{s.max}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(s.value / s.max) * 100}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skill Editor Modal */}
        {showSkillEditor && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSkillEditor(false)}>
            <div className="glass-card p-6 w-full max-w-lg space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">Edit Your Skills</h3>
                <button onClick={() => setShowSkillEditor(false)} className="text-[#64748B] hover:text-white"><X size={18} /></button>
              </div>

              {/* Domain */}
              <div>
                <label className="text-xs text-[#94A3B8] font-medium block mb-2">Primary Domain</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {DOMAIN_OPTIONS.map(d => (
                    <button key={d} onClick={() => setEditDomain(d)}
                      className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${editDomain === d ? 'border' : 'bg-white/5 text-[#64748B]'}`}
                      style={editDomain === d ? { background: `${DOMAIN_COLORS[d]}15`, color: DOMAIN_COLORS[d], borderColor: `${DOMAIN_COLORS[d]}30` } : {}}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <label className="text-xs text-[#94A3B8] font-medium block mb-2">Domain Level</label>
                <div className="flex gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                    <button key={l} onClick={() => setEditLevel(l)}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${editLevel === l ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30' : 'bg-white/5 text-[#64748B] border border-white/5'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="text-xs text-[#94A3B8] font-medium block mb-2">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                    placeholder="Add a skill..." />
                  <button onClick={addSkill}
                    className="px-3 py-2 bg-[#10B981] text-white rounded-lg text-xs font-bold"><Plus size={14} /></button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {editSkills.map(s => (
                    <span key={s} className="text-[10px] px-2.5 py-1 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] font-medium flex items-center gap-1">
                      {s}
                      <button onClick={() => setEditSkills(editSkills.filter(x => x !== s))} className="hover:text-white"><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>

              <button onClick={handleSaveSkills}
                className="w-full py-3 bg-[#10B981] text-white rounded-xl text-sm font-bold hover:bg-[#10B981]/80 transition-all">
                Save Skills
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
