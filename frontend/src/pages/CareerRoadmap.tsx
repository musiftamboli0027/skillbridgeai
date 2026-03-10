/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { toast } from 'sonner';
import {
  Compass, Target, Rocket, Zap, BookOpen, Award, Briefcase,
  Github, Globe2, Calendar, Clock, ChevronRight, CheckCircle2,
  TrendingUp, Star, AlertTriangle, Users, ArrowRight, Sparkles,
  Code2, Brain, BarChart3, Smartphone, Shield, Lightbulb
} from 'lucide-react';

const CAREER_OPTIONS = [
  'Software Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'AI/ML Engineer', 'Data Scientist', 'Data Analyst', 'Mobile App Developer',
  'DevOps Engineer', 'Cybersecurity Analyst', 'Cloud Engineer', 'Game Developer',
  'Blockchain Developer', 'Product Manager', 'UI/UX Designer', 'SAP Consultant'
];

const CAREER_ICONS: Record<string, any> = {
  'Software Developer': Code2, 'Frontend Developer': Globe2, 'Backend Developer': Shield,
  'Full Stack Developer': Code2, 'AI/ML Engineer': Brain, 'Data Scientist': BarChart3,
  'Data Analyst': BarChart3, 'Mobile App Developer': Smartphone, 'DevOps Engineer': Shield,
  'Cybersecurity Analyst': Shield, 'Cloud Engineer': Globe2, 'UI/UX Designer': Lightbulb,
};

const PRIORITY_COLORS: Record<string, string> = {
  'High': '#EF4444', 'Medium': '#F59E0B', 'Low': '#10B981'
};

// ── Profile Form ──
function ProfileForm({ onGenerate, loading }: { onGenerate: (data: any) => void; loading: boolean }) {
  const [form, setForm] = useState({
    career: '', level: 'Beginner', skills: '',
    hours: '10 hours/week', budget: 'Free', goal: ''
  });

  const handleSubmit = () => {
    if (!form.career || !form.goal) {
      toast.error('Select a career interest and set a goal');
      return;
    }
    onGenerate({
      ...form,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full text-sm text-[#7C3AED] font-bold mb-4">
          <Sparkles size={16} /> AI-Powered Roadmap Generator
        </div>
        <h1 className="text-3xl font-bold text-white">Build Your Career Blueprint</h1>
        <p className="text-[#94A3B8] mt-2 max-w-lg mx-auto">Answer a few questions and our AI will generate a personalized 6-month roadmap tailored to your goals, level, and availability.</p>
      </div>

      {/* Form */}
      <div className="glass-card p-6 space-y-5">
        {/* Career Interest */}
        <div>
          <label className="text-sm text-[#94A3B8] font-medium block mb-2">Career Interest *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {CAREER_OPTIONS.map(c => {
              const Icon = CAREER_ICONS[c] || Compass;
              return (
                <button key={c} onClick={() => setForm(f => ({ ...f, career: c }))}
                  className={`px-3 py-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${form.career === c ? 'bg-[#7C3AED]/15 text-[#7C3AED] border border-[#7C3AED]/30' : 'bg-white/5 text-[#94A3B8] border border-white/5 hover:border-white/15'}`}>
                  <Icon size={13} /> {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Level */}
        <div>
          <label className="text-sm text-[#94A3B8] font-medium block mb-2">Current Level *</label>
          <div className="flex gap-2">
            {['Beginner', 'Intermediate', 'Advanced'].map(l => (
              <button key={l} onClick={() => setForm(f => ({ ...f, level: l }))}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${form.level === l ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30' : 'bg-white/5 text-[#94A3B8] border border-white/5 hover:border-white/15'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="text-sm text-[#94A3B8] font-medium block mb-2">Existing Skills (comma separated)</label>
          <input value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#7C3AED]/50"
            placeholder="e.g. Python, HTML, CSS, Git" />
        </div>

        {/* Hours & Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[#94A3B8] font-medium block mb-2">Weekly Hours Available *</label>
            <select value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none">
              {['5 hours/week', '10 hours/week', '15 hours/week', '20 hours/week', '25+ hours/week'].map(h => (
                <option key={h} value={h} className="bg-[#0A0E1A]">{h}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-[#94A3B8] font-medium block mb-2">Certification Budget *</label>
            <select value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none">
              {['Free', 'Low (< ₹5000)', 'Medium (₹5000-15000)', 'High (> ₹15000)'].map(b => (
                <option key={b} value={b} className="bg-[#0A0E1A]">{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Goal */}
        <div>
          <label className="text-sm text-[#94A3B8] font-medium block mb-2">Final Goal *</label>
          <input value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#7C3AED]/50"
            placeholder="e.g. Internship in 3rd year, Build a SaaS startup, Get placed at FAANG" />
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-[#7C3AED] to-[#00D4FF] text-white rounded-xl font-bold text-sm transition-all hover:opacity-90 shadow-lg shadow-[#7C3AED]/20 flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating your roadmap...</>
          ) : (
            <><Sparkles size={18} /> Generate My Personalized Roadmap</>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Roadmap Viewer ──
function RoadmapViewer({ roadmap, profile, onRegenerate }: { roadmap: any; profile: any; onRegenerate: () => void }) {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'semester', label: 'Semester Plan', icon: Calendar },
    { id: 'skills', label: 'Skills & Certs', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: Code2 },
    { id: 'internship', label: 'Internships', icon: Briefcase },
    { id: 'weekly', label: 'Weekly Plan', icon: Clock },
    { id: 'strategy', label: 'Strategy', icon: Target },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Rocket size={24} className="text-[#7C3AED]" /> {roadmap.title || 'Your Career Roadmap'}
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1 max-w-2xl">{roadmap.summary}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#7C3AED]/15 text-[#7C3AED]">{profile?.career || 'Career'}</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#10B981]/15 text-[#10B981]">{profile?.level || 'Level'}</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F59E0B]/15 text-[#F59E0B]">{profile?.hours || 'Hours'}</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00D4FF]/15 text-[#00D4FF]">{profile?.budget || 'Budget'}</span>
          </div>
        </div>
        <button onClick={onRegenerate}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-[#94A3B8] hover:text-white font-bold transition-all flex items-center gap-2 shrink-0">
          <Sparkles size={14} /> Regenerate
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/5 overflow-x-auto">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeSection === s.id ? 'bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}>
            <s.icon size={14} /> {s.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* KPIs */}
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-[#10B981]" /> Key Performance Indicators</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(roadmap.kpis || []).map((k: any, i: number) => (
                  <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
                    <p className="text-lg font-bold text-white">{k.target}</p>
                    <p className="text-xs text-[#94A3B8] mt-1">{k.metric}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">{k.timeframe}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Tech Stack */}
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Code2 size={16} className="text-[#00D4FF]" /> Recommended Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {(roadmap.techStack || []).map((t: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/15">{t}</span>
                ))}
              </div>
            </div>
            {/* Differentiator */}
            {roadmap.differentiator && (
              <div className="glass-card p-5 border-[#F59E0B]/20 bg-[#F59E0B]/5">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Star size={16} className="text-[#F59E0B]" /> Your Differentiator</h3>
                <p className="text-sm text-[#CBD5E1]">{roadmap.differentiator}</p>
              </div>
            )}
          </div>
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Mistakes to Avoid */}
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-[#EF4444]" /> Mistakes to Avoid</h3>
              <ul className="space-y-2">
                {(roadmap.mistakesToAvoid || []).map((m: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                    <AlertTriangle size={12} className="text-[#EF4444] shrink-0 mt-0.5" /> {m}
                  </li>
                ))}
              </ul>
            </div>
            {/* Networking */}
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Users size={16} className="text-[#EC4899]" /> Networking Strategy</h3>
              <ul className="space-y-2">
                {(roadmap.networkingStrategy || []).map((n: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                    <ArrowRight size={12} className="text-[#EC4899] shrink-0 mt-0.5" /> {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── SEMESTER PLAN ── */}
      {activeSection === 'semester' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[roadmap.semester3, roadmap.semester4].map((sem: any, si: number) => sem && (
            <div key={si} className="glass-card p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Calendar size={16} className={si === 0 ? 'text-[#7C3AED]' : 'text-[#10B981]'} /> {sem.title}
              </h3>
              <div className="space-y-4">
                {(sem.months || []).map((m: any, mi: number) => (
                  <div key={mi} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white font-bold">{m.month}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#7C3AED]/15 text-[#7C3AED] rounded-full font-bold">{m.focus}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {(m.tasks || []).map((t: string, ti: number) => (
                        <li key={ti} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                          <CheckCircle2 size={12} className="text-[#10B981] shrink-0 mt-0.5" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SKILLS & CERTS ── */}
      {activeSection === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Zap size={16} className="text-[#F59E0B]" /> Skills to Learn</h3>
            <div className="space-y-2">
              {(roadmap.skills || []).map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: PRIORITY_COLORS[s.priority] || '#64748B' }} />
                    <span className="text-sm text-white font-medium">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#64748B]">{s.timeToLearn}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                      style={{ background: `${PRIORITY_COLORS[s.priority] || '#64748B'}20`, color: PRIORITY_COLORS[s.priority] || '#64748B' }}>
                      {s.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Award size={16} className="text-[#10B981]" /> Certifications</h3>
            <div className="space-y-3">
              {(roadmap.certifications || []).map((c: any, i: number) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">{c.name}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{c.provider}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${c.cost === 'Free' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                      {c.cost}
                    </span>
                  </div>
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-[#00D4FF] hover:underline mt-1 inline-flex items-center gap-1">
                      <Globe2 size={10} /> View Certification
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PROJECTS ── */}
      {activeSection === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(roadmap.projects || []).map((p: any, i: number) => (
            <div key={i} className="glass-card p-5 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white font-bold">{p.title}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${p.difficulty === 'Beginner' ? 'bg-[#10B981]/20 text-[#10B981]' : p.difficulty === 'Advanced' ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                  {p.difficulty}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(p.techStack || []).map((t: string) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#7C3AED]/10 text-[#7C3AED]">{t}</span>
                ))}
              </div>
              <p className="text-[10px] text-[#64748B] mt-2 flex items-center gap-1"><Clock size={10} /> {p.estimatedTime}</p>
            </div>
          ))}
          {/* Platforms */}
          <div className="glass-card p-5 md:col-span-2">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Target size={16} className="text-[#00D4FF]" /> Practice Platforms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(roadmap.platforms || []).map((p: any, i: number) => (
                <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                  className="bg-white/[0.03] border border-white/5 rounded-xl p-3 hover:border-white/10 transition-all">
                  <p className="text-sm text-white font-medium">{p.name}</p>
                  <p className="text-xs text-[#64748B] mt-1">{p.purpose}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── INTERNSHIP ── */}
      {activeSection === 'internship' && roadmap.internshipStrategy && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Briefcase size={16} className="text-[#10B981]" /> Internship Strategy</h3>
            <div className="mb-4 px-4 py-3 bg-[#10B981]/5 border border-[#10B981]/15 rounded-xl">
              <p className="text-xs text-[#10B981] font-bold">Timeline: {roadmap.internshipStrategy.timeline}</p>
            </div>
            <h4 className="text-xs text-[#94A3B8] font-bold mb-2">Preparation Steps</h4>
            <ul className="space-y-2 mb-4">
              {(roadmap.internshipStrategy.preparationSteps || []).map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                  <CheckCircle2 size={12} className="text-[#10B981] shrink-0 mt-0.5" /> {s}
                </li>
              ))}
            </ul>
            <h4 className="text-xs text-[#94A3B8] font-bold mb-2">Target Companies</h4>
            <div className="flex flex-wrap gap-2">
              {(roadmap.internshipStrategy.targetCompanies || []).map((c: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-white">{c}</span>
              ))}
            </div>
          </div>
          {/* Portfolio */}
          <div className="space-y-4">
            {roadmap.portfolioStrategy && (
              <div className="glass-card p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Github size={16} className="text-white" /> Portfolio Strategy</h3>
                {roadmap.portfolioStrategy.githubTips?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-[10px] text-[#94A3B8] font-bold mb-1.5">GitHub</h4>
                    <ul className="space-y-1.5">{roadmap.portfolioStrategy.githubTips.map((t: string, i: number) => (
                      <li key={i} className="text-xs text-[#94A3B8] flex items-start gap-1.5"><Github size={10} className="shrink-0 mt-0.5 text-white" /> {t}</li>
                    ))}</ul>
                  </div>
                )}
                {roadmap.portfolioStrategy.linkedinTips?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-[10px] text-[#94A3B8] font-bold mb-1.5">LinkedIn</h4>
                    <ul className="space-y-1.5">{roadmap.portfolioStrategy.linkedinTips.map((t: string, i: number) => (
                      <li key={i} className="text-xs text-[#94A3B8] flex items-start gap-1.5"><Users size={10} className="shrink-0 mt-0.5 text-[#00D4FF]" /> {t}</li>
                    ))}</ul>
                  </div>
                )}
              </div>
            )}
            {/* Achievements */}
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Award size={16} className="text-[#F59E0B]" /> Achievement Targets</h3>
              <div className="space-y-2">
                {(roadmap.achievements || []).map((a: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-xs text-white font-medium">{a.target}</p>
                      <p className="text-[10px] text-[#64748B]">{a.category}</p>
                    </div>
                    <span className="text-[10px] text-[#F59E0B] font-bold">{a.deadline}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WEEKLY PLAN ── */}
      {activeSection === 'weekly' && roadmap.weeklyPlan && (
        <div className="glass-card p-5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Clock size={16} className="text-[#7C3AED]" /> Weekly Study Plan ({roadmap.weeklyPlan.totalHours})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {(roadmap.weeklyPlan.breakdown || []).map((d: any, i: number) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
                <p className="text-sm text-white font-bold">{d.day}</p>
                <p className="text-2xl font-bold text-[#7C3AED] mt-2">{d.hours}h</p>
                <p className="text-[10px] text-[#94A3B8] mt-1 leading-tight">{d.focus}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STRATEGY ── */}
      {activeSection === 'strategy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roadmap.differentiator && (
            <div className="glass-card p-5 border-[#F59E0B]/20 bg-[#F59E0B]/5 lg:col-span-2">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Star size={16} className="text-[#F59E0B]" /> Your #1 Differentiator</h3>
              <p className="text-sm text-[#CBD5E1]">{roadmap.differentiator}</p>
            </div>
          )}
          <div className="glass-card p-5">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Users size={16} className="text-[#EC4899]" /> Networking Strategy</h3>
            <ul className="space-y-2">
              {(roadmap.networkingStrategy || []).map((n: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                  <ChevronRight size={12} className="text-[#EC4899] shrink-0 mt-0.5" /> {n}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-5">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-[#EF4444]" /> Common Mistakes to Avoid</h3>
            <ul className="space-y-2">
              {(roadmap.mistakesToAvoid || []).map((m: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                  <AlertTriangle size={12} className="text-[#EF4444] shrink-0 mt-0.5" /> {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──
export default function CareerRoadmap() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Load saved roadmap on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.getSavedRoadmap();
        if (res.success && res.exists) {
          setRoadmap(res.roadmap);
          setProfile(res.profile);
        } else {
          setShowForm(true);
        }
      } catch {
        setShowForm(true);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  const handleGenerate = async (data: any) => {
    try {
      setLoading(true);
      const res = await api.generateRoadmap(data);
      if (res.success) {
        setRoadmap(res.roadmap);
        setProfile(res.profile);
        setShowForm(false);
        toast.success('Your personalized roadmap is ready! 🚀');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 w-64 bg-white/5 rounded-lg" />
          <div className="h-96 bg-white/5 rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-slide-in">
        {showForm || !roadmap || !profile ? (
          <ProfileForm onGenerate={handleGenerate} loading={loading} />
        ) : (
          <RoadmapViewer roadmap={roadmap} profile={profile} onRegenerate={() => setShowForm(true)} />
        )}
      </div>
    </DashboardLayout>
  );
}
