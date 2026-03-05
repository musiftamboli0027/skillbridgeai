/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import {
  Users, Rocket, GitBranch, Trophy, Plus, ChevronRight,
  Target, Zap, Clock, CheckCircle2, Circle,
  Briefcase, Code2, Palette, BarChart3, Brain, Shield,
  Smartphone, Globe2, UserPlus, Star, TrendingUp, Activity,
  ListTodo, ArrowUpRight, X, Send, Play
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis
} from 'recharts';

const DOMAIN_COLORS: Record<string, string> = {
  'Software Development': '#00D4FF',
  'AI/ML': '#7C3AED',
  'Design': '#F59E0B',
  'Marketing': '#EC4899',
  'Business': '#10B981',
  'Data': '#3B82F6',
  'DevOps': '#EF4444',
  'Mobile': '#06B6D4',
  'Cybersecurity': '#8B5CF6'
};

const DOMAIN_ICONS: Record<string, any> = {
  'Software Development': Code2,
  'AI/ML': Brain,
  'Design': Palette,
  'Marketing': BarChart3,
  'Business': Briefcase,
  'Data': Activity,
  'DevOps': Shield,
  'Mobile': Smartphone,
  'Cybersecurity': Globe2
};

const TASK_STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  'Todo': { label: 'To Do', color: '#94A3B8', icon: Circle },
  'InProgress': { label: 'In Progress', color: '#F59E0B', icon: Clock },
  'Done': { label: 'Done', color: '#10B981', icon: CheckCircle2 }
};

// ── Sub-components ──────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, sub }: any) {
  return (
    <div className="glass-card p-5 group hover:border-white/10 transition-all">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <ArrowUpRight size={16} className="text-white/20 group-hover:text-white/40 transition-colors" />
      </div>
      <p className="text-2xl font-bold text-white mt-3">{value}</p>
      <p className="text-sm text-[#94A3B8] font-medium">{label}</p>
      {sub && <p className="text-xs text-[#64748B] mt-1">{sub}</p>}
    </div>
  );
}

function ProposalModal({ open, onClose, onSubmit }: any) {
  const [form, setForm] = useState({
    title: '', description: '', problemStatement: '',
    requiredDomains: [] as string[], projectType: 'Startup', techStack: ''
  });
  const domains = Object.keys(DOMAIN_COLORS);

  if (!open) return null;

  const toggleDomain = (d: string) => {
    setForm(f => ({
      ...f,
      requiredDomains: f.requiredDomains.includes(d)
        ? f.requiredDomains.filter(x => x !== d)
        : [...f.requiredDomains, d]
    }));
  };

  const handleSubmit = () => {
    if (!form.title || !form.description || !form.problemStatement) {
      toast.error('Fill all required fields');
      return;
    }
    if (form.requiredDomains.length < 3) {
      toast.error('Select at least 3 domains');
      return;
    }
    onSubmit({
      ...form,
      techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0A0E1A] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">New Project Proposal</h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#94A3B8] block mb-1.5">Project Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#10B981]/50 outline-none"
              placeholder="e.g. AI-Powered Student Feedback System" />
          </div>
          <div>
            <label className="text-sm text-[#94A3B8] block mb-1.5">Problem Statement *</label>
            <textarea value={form.problemStatement} onChange={e => setForm(f => ({ ...f, problemStatement: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#10B981]/50 outline-none h-24 resize-none"
              placeholder="What problem does this solve?" />
          </div>
          <div>
            <label className="text-sm text-[#94A3B8] block mb-1.5">Description *</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#10B981]/50 outline-none h-20 resize-none"
              placeholder="Detailed description of the project" />
          </div>
          <div>
            <label className="text-sm text-[#94A3B8] block mb-1.5">Project Type</label>
            <div className="flex flex-wrap gap-2">
              {['Startup', 'SaaS', 'AI', 'College', 'NGO', 'OpenSource'].map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, projectType: t }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${form.projectType === t ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30' : 'bg-white/5 text-[#94A3B8] border border-white/5 hover:border-white/15'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-[#94A3B8] block mb-1.5">Required Domains (min 3) *</label>
            <div className="flex flex-wrap gap-2">
              {domains.map(d => (
                <button key={d} onClick={() => toggleDomain(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${form.requiredDomains.includes(d) ? 'border' : 'bg-white/5 text-[#94A3B8] border border-white/5 hover:border-white/15'}`}
                  style={form.requiredDomains.includes(d) ? { background: `${DOMAIN_COLORS[d]}20`, color: DOMAIN_COLORS[d], borderColor: `${DOMAIN_COLORS[d]}40` } : {}}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-[#94A3B8] block mb-1.5">Tech Stack (comma separated)</label>
            <input value={form.techStack} onChange={e => setForm(f => ({ ...f, techStack: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#10B981]/50 outline-none"
              placeholder="React, Node.js, MongoDB, etc." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm text-[#94A3B8] hover:text-white transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 bg-[#10B981] hover:bg-[#10B981]/80 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2">
            <Send size={16} /> Submit Proposal
          </button>
        </div>
      </div>
    </div>
  );
}

function SprintBoard({ sprint, onUpdateTask }: any) {
  if (!sprint) return (
    <div className="glass-card p-8 text-center">
      <ListTodo size={40} className="text-[#64748B] mx-auto mb-3" />
      <p className="text-white font-medium">No Active Sprint</p>
      <p className="text-sm text-[#64748B] mt-1">Team lead can create a new sprint to start tracking tasks</p>
    </div>
  );

  const cols = ['Todo', 'InProgress', 'Done'];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold">{sprint.title || `Sprint ${sprint.sprintNumber}`}</h3>
          {sprint.goal && <p className="text-xs text-[#64748B] mt-0.5">{sprint.goal}</p>}
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F59E0B]/20 text-[#F59E0B]">
          {sprint.status}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cols.map(col => {
          const info = TASK_STATUS_MAP[col];
          const tasks = (sprint.tasks || []).filter((t: any) => t.status === col);
          return (
            <div key={col} className="bg-white/[0.02] rounded-xl p-3 border border-white/5 min-h-[200px]">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                <info.icon size={14} style={{ color: info.color }} />
                <span className="text-sm font-bold" style={{ color: info.color }}>{info.label}</span>
                <span className="ml-auto text-xs text-[#64748B] bg-white/5 px-2 py-0.5 rounded-full">{tasks.length}</span>
              </div>
              <div className="space-y-2">
                {tasks.map((task: any) => (
                  <div key={task._id} className="bg-white/[0.03] border border-white/5 rounded-lg p-3 hover:border-white/10 transition-all cursor-pointer group">
                    <p className="text-sm text-white font-medium">{task.title}</p>
                    {task.description && <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{task.description}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                        style={{ background: `${DOMAIN_COLORS[task.domainTag] || '#64748B'}20`, color: DOMAIN_COLORS[task.domainTag] || '#64748B' }}>
                        {task.domainTag}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {col !== 'Done' && (
                          <button onClick={() => onUpdateTask(sprint._id, task._id, col === 'Todo' ? 'InProgress' : 'Done')}
                            className="text-xs text-[#10B981] hover:underline">
                            {col === 'Todo' ? '▶ Start' : '✓ Done'}
                          </button>
                        )}
                      </div>
                    </div>
                    {task.assignedTo && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C3AED] flex items-center justify-center text-[8px] text-white font-bold">
                          {task.assignedTo.name?.[0] || '?'}
                        </div>
                        <span className="text-[10px] text-[#64748B]">{task.assignedTo.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TeamCard({ team, onJoin }: any) {
  const domains = [...new Set((team.members || []).map((m: any) => m.domain))];
  const neededDomains = (team.projectId?.requiredDomains || []).filter((d: string) => !domains.includes(d));

  return (
    <div className="glass-card p-5 hover:border-white/10 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-white font-bold">{team.name}</h4>
          <p className="text-xs text-[#64748B] mt-0.5">{team.projectId?.title}</p>
        </div>
        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#F59E0B]/20 text-[#F59E0B]">
          {team.members?.length || 0}/{team.maxMembers || 6} Members
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {(team.members || []).map((m: any, i: number) => (
          <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px]"
            style={{ background: `${DOMAIN_COLORS[m.domain] || '#64748B'}15`, color: DOMAIN_COLORS[m.domain] || '#64748B' }}>
            <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold">
              {m.userId?.name?.[0] || '?'}
            </div>
            {m.domain}
          </div>
        ))}
      </div>
      {neededDomains.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-[#64748B] mb-1">Looking for:</p>
          <div className="flex flex-wrap gap-1">
            {neededDomains.map((d: string) => (
              <span key={d} className="text-[10px] px-2 py-0.5 rounded-full border border-dashed border-white/10 text-[#94A3B8]">{d}</span>
            ))}
          </div>
        </div>
      )}
      <button onClick={() => onJoin(team._id)}
        className="w-full mt-2 py-2 rounded-xl text-sm font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981]/20 transition-all flex items-center justify-center gap-2">
        <UserPlus size={14} /> Request to Join
      </button>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────

export default function CollaborationDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProposalModal, setShowProposalModal] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getCollabDashboard();
      if (res.success) setDashboard(res.dashboard);
    } catch (err: any) {
      console.error('Collab dashboard error:', err);
      toast.error(err.message || 'Failed to load collaboration data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const handleCreateProposal = async (data: any) => {
    try {
      const res = await api.createCollabProject(data);
      if (res.success) {
        toast.success('Project proposal submitted!');
        setShowProposalModal(false);
        fetchDashboard();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit proposal');
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      const res = await api.requestJoinTeam(teamId, {
        domain: user?.primaryDomain || 'Software Development',
        role: 'Developer',
        message: 'I would like to join this team!'
      });
      if (res.success) {
        toast.success('Join request sent!');
        fetchDashboard();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send request');
    }
  };

  const handleUpdateTask = async (sprintId: string, taskId: string, status: string) => {
    try {
      await api.updateSprintTask(sprintId, taskId, { status });
      toast.success('Task updated!');
      fetchDashboard();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Rocket },
    { id: 'sprints', label: 'Sprint Board', icon: ListTodo },
    { id: 'projects', label: 'Explore Projects', icon: Globe2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  // ── Loading ──
  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 w-64 bg-white/5 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
          </div>
          <div className="h-96 bg-white/5 rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  const d = dashboard || { stats: {}, myTeam: null, activeSprint: null, myProposals: [], availableProjects: [], formingTeams: [] };
  const teamMembers = d.myTeam?.members || [];
  const domainDistribution = teamMembers.reduce((acc: any[], m: any) => {
    const existing = acc.find((x: any) => x.name === m.domain);
    if (existing) existing.value++;
    else acc.push({ name: m.domain, value: 1, color: DOMAIN_COLORS[m.domain] || '#64748B' });
    return acc;
  }, []);

  const sprintTasks = d.activeSprint?.tasks || [];
  const totalTasks = sprintTasks.length;
  const doneTasks = sprintTasks.filter((t: any) => t.status === 'Done').length;
  const sprintProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Rocket size={24} className="text-[#10B981]" /> Collaboration Hub
            </h1>
            <p className="text-[#94A3B8] text-sm mt-1">Build real-world projects with cross-domain teams</p>
          </div>
          <button onClick={() => setShowProposalModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-[#10B981] to-[#00D4FF] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-[#10B981]/20">
            <Plus size={16} /> New Proposal
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/5 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Target} label="Total Tasks" value={d.stats.totalTasks || 0} color="#00D4FF" sub="Across all projects" />
          <StatCard icon={GitBranch} label="Commits" value={d.stats.totalCommits || 0} color="#7C3AED" sub="GitHub contributions" />
          <StatCard icon={Zap} label="Collab Score" value={d.stats.collaborationScore || 0} color="#10B981" sub="Performance rating" />
          <StatCard icon={Star} label="Leadership" value={d.stats.leadershipScore || 0} color="#F59E0B" sub="Leadership index" />
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Team */}
            <div className="lg:col-span-2 space-y-6">
              {d.myTeam ? (
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-bold flex items-center gap-2">
                        <Users size={18} className="text-[#10B981]" /> {d.myTeam.name}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-0.5">{d.myTeam.projectId?.title}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${d.myTeam.status === 'Active' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                      {d.myTeam.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {teamMembers.map((m: any, i: number) => {
                      const DIcon = DOMAIN_ICONS[m.domain] || Code2;
                      return (
                        <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C3AED] flex items-center justify-center text-sm text-white font-bold shrink-0">
                            {m.userId?.name?.[0] || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-white font-medium truncate">{m.userId?.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <DIcon size={10} style={{ color: DOMAIN_COLORS[m.domain] || '#64748B' }} />
                              <span className="text-[10px]" style={{ color: DOMAIN_COLORS[m.domain] || '#64748B' }}>{m.domain}</span>
                            </div>
                            {m.role === 'Lead' && <span className="text-[9px] px-1.5 py-0.5 bg-[#F59E0B]/20 text-[#F59E0B] rounded mt-1 inline-block font-bold">LEAD</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="glass-card p-8 text-center">
                  <Users size={40} className="text-[#64748B] mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white">No Team Yet</h3>
                  <p className="text-sm text-[#64748B] mt-1 max-w-sm mx-auto">Create a project proposal or join an existing team below</p>
                  <button onClick={() => setActiveTab('projects')}
                    className="mt-4 px-6 py-2.5 bg-[#10B981] hover:bg-[#10B981]/80 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 mx-auto">
                    <Globe2 size={16} /> Explore Projects
                  </button>
                </div>
              )}

              {/* Sprint Board */}
              <SprintBoard sprint={d.activeSprint} onUpdateTask={handleUpdateTask} />
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Sprint Progress */}
              {d.activeSprint && (
                <div className="glass-card p-5">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2"><Play size={14} className="text-[#10B981]" /> Sprint Progress</h3>
                  <div className="text-center py-3">
                    <p className="text-4xl font-bold text-white">{sprintProgress}%</p>
                    <p className="text-sm text-[#94A3B8] mt-1">{doneTasks}/{totalTasks} tasks done</p>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-gradient-to-r from-[#10B981] to-[#00D4FF] rounded-full transition-all" style={{ width: `${sprintProgress}%` }} />
                  </div>
                </div>
              )}

              {/* Domain Distribution */}
              {domainDistribution.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-white font-medium mb-3">Team Domains</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={domainDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                          {domainDistribution.map((entry: any, idx: number) => (
                            <Cell key={idx} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#0A0E1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1.5 mt-2">
                    {domainDistribution.map((d: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                          <span className="text-[#94A3B8] text-xs">{d.name}</span>
                        </div>
                        <span className="text-white text-xs font-bold">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* My Proposals */}
              <div className="glass-card p-5">
                <h3 className="text-white font-medium mb-3">My Proposals</h3>
                {d.myProposals.length > 0 ? d.myProposals.slice(0, 4).map((p: any) => (
                  <div key={p._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{p.title}</p>
                      <p className="text-xs text-[#64748B]">{p.projectType}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ml-2 ${p.status === 'Approved' ? 'bg-[#10B981]/20 text-[#10B981]' : p.status === 'Rejected' ? 'bg-[#EF4444]/20 text-[#EF4444]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                      {p.status}
                    </span>
                  </div>
                )) : <p className="text-sm text-[#64748B]">No proposals yet</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── SPRINT BOARD TAB ── */}
        {activeTab === 'sprints' && (
          <SprintBoard sprint={d.activeSprint} onUpdateTask={handleUpdateTask} />
        )}

        {/* ── EXPLORE PROJECTS TAB ── */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Forming Teams */}
            {d.formingTeams?.length > 0 && (
              <div>
                <h3 className="text-white font-bold mb-3 flex items-center gap-2"><UserPlus size={18} className="text-[#10B981]" /> Teams Looking for Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {d.formingTeams.map((t: any) => <TeamCard key={t._id} team={t} onJoin={handleJoinTeam} />)}
                </div>
              </div>
            )}

            {/* Available Projects */}
            <div>
              <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Rocket size={18} className="text-[#00D4FF]" /> Approved Projects</h3>
              {d.availableProjects?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {d.availableProjects.map((p: any) => (
                    <div key={p._id} className="glass-card p-5 hover:border-white/10 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-bold">{p.title}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] shrink-0 ml-2">{p.projectType}</span>
                      </div>
                      <p className="text-sm text-[#94A3B8] line-clamp-2">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.requiredDomains?.map((d: string) => (
                          <span key={d} className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: `${DOMAIN_COLORS[d] || '#64748B'}15`, color: DOMAIN_COLORS[d] || '#64748B' }}>{d}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C3AED] flex items-center justify-center text-[10px] text-white font-bold">
                          {p.createdBy?.name?.[0] || '?'}
                        </div>
                        <span className="text-xs text-[#64748B]">{p.createdBy?.name}</span>
                        <ChevronRight size={14} className="text-[#64748B] ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-8 text-center">
                  <Rocket size={32} className="text-[#64748B] mx-auto mb-2" />
                  <p className="text-sm text-[#64748B]">No approved projects available yet. Submit a proposal!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-4">Performance Overview</h3>
              <div className="space-y-4">
                {[
                  { label: 'Technical Score', value: d.stats.technicalScore || 0, max: 100, color: '#00D4FF' },
                  { label: 'Collaboration Score', value: d.stats.collaborationScore || 0, max: 100, color: '#10B981' },
                  { label: 'Leadership Score', value: d.stats.leadershipScore || 0, max: 100, color: '#F59E0B' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-[#94A3B8]">{s.label}</span>
                      <span className="text-white font-bold">{s.value}/{s.max}</span>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(s.value / s.max) * 100}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-4">Contribution Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Tasks', value: d.stats.totalTasks || 0 },
                    { name: 'Commits', value: d.stats.totalCommits || 0 },
                    { name: 'Projects', value: d.stats.performance?.projectsCompleted || 0 },
                    { name: 'Deployed', value: d.stats.performance?.deployedApps || 0 },
                  ]}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: '#0A0E1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }} />
                    <Bar dataKey="value" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="lg:col-span-2 glass-card p-5">
              <h3 className="text-white font-bold mb-4">Placement Readiness</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Projects Completed', value: d.stats.performance?.projectsCompleted || 0, target: 2, icon: Rocket },
                  { label: 'Deployed Apps', value: d.stats.performance?.deployedApps || 0, target: 1, icon: Globe2 },
                  { label: 'Total Contributions', value: d.stats.performance?.totalContributions || 0, target: 20, icon: GitBranch },
                  { label: 'Avg Score', value: d.stats.performance?.avgScore || 0, target: 70, icon: TrendingUp },
                ].map((item, i) => {
                  const Icon = item.icon;
                  const pct = Math.min(100, Math.round((item.value / item.target) * 100));
                  return (
                    <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center">
                      <Icon size={20} className="text-[#10B981] mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{item.value}<span className="text-sm text-[#64748B]">/{item.target}</span></p>
                      <p className="text-xs text-[#94A3B8] mt-1">{item.label}</p>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── LEADERBOARD TAB ── */}
        {activeTab === 'leaderboard' && <LeaderboardTab />}
      </div>

      <ProposalModal open={showProposalModal} onClose={() => setShowProposalModal(false)} onSubmit={handleCreateProposal} />
    </DashboardLayout>
  );
}

function LeaderboardTab() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getCollabLeaderboard();
        if (res.success) setLeaders(res.leaderboard);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />;

  return (
    <div className="glass-card p-5">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Trophy size={18} className="text-[#F59E0B]" /> Collaboration Leaderboard</h3>
      {leaders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-[#64748B] uppercase tracking-wider">
                <th className="pb-3 font-bold">#</th>
                <th className="pb-3 font-bold">Student</th>
                <th className="pb-3 font-bold">Domain</th>
                <th className="pb-3 font-bold">Collab Score</th>
                <th className="pb-3 font-bold">Tech Score</th>
                <th className="pb-3 font-bold">Projects</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {leaders.map((s: any, i: number) => (
                <tr key={s._id} className="border-t border-white/5">
                  <td className="py-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-white/5 text-[#94A3B8]'}`}>{i + 1}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold">{s.name?.[0]}</div>
                      <span className="text-white font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${DOMAIN_COLORS[s.primaryDomain] || '#64748B'}20`, color: DOMAIN_COLORS[s.primaryDomain] || '#64748B' }}>{s.primaryDomain || 'Not set'}</span></td>
                  <td className="py-3 text-white font-bold">{s.collaborationScore || 0}</td>
                  <td className="py-3 text-[#94A3B8]">{s.technicalScore || 0}</td>
                  <td className="py-3 text-[#94A3B8]">{s.secondYearPerformance?.projectsCompleted || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy size={32} className="text-[#64748B] mx-auto mb-2" />
          <p className="text-sm text-[#64748B]">Leaderboard is empty. Start collaborating to appear here!</p>
        </div>
      )}
    </div>
  );
}
