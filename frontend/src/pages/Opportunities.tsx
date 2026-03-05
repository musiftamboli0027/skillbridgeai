import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { toast } from 'sonner';
import {
  Briefcase, MapPin, Clock, Calendar, Search, Filter,
  Building2, Send, Award, TrendingUp, FileText, X, CheckCircle2
} from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  jobType: string;
  requiredDomains: string[];
  requiredSkills: string[];
  experienceLevel: string;
  stipendOrSalary: string;
  location: string;
  description: string;
  responsibilities: string;
  applicationDeadline: string;
  status: string;
  hasApplied: boolean;
  applicationStatus: string | null;
  createdAt: string;
}

interface Application {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    companyName: string;
    companyLogo: string;
    jobType: string;
    location: string;
    stipendOrSalary: string;
    applicationDeadline: string;
    status: string;
  };
  status: string;
  recruiterFeedback: string;
  createdAt: string;
}

const JOB_TYPES = ['All', 'Internship', 'Full-Time', 'Part-Time', 'Remote', 'Contract'];
const DOMAINS = ['All', 'Software Development', 'AI/ML', 'Data Science', 'Design', 'Marketing', 'Business', 'DevOps', 'Cybersecurity'];

const TYPE_COLORS: Record<string, string> = {
  'Internship': '#10B981',
  'Full-Time': '#3B82F6',
  'Part-Time': '#F59E0B',
  'Remote': '#8B5CF6',
  'Contract': '#EF4444',
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  'Applied': { bg: '#3B82F6/15', text: '#3B82F6' },
  'Shortlisted': { bg: '#F59E0B/15', text: '#F59E0B' },
  'Rejected': { bg: '#EF4444/15', text: '#EF4444' },
  'Hired': { bg: '#10B981/15', text: '#10B981' },
};

export default function Opportunities() {
  const [tab, setTab] = useState<'browse' | 'applied'>('browse');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterDomain, setFilterDomain] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyData, setApplyData] = useState({ resumeLink: '', portfolioLink: '', githubLink: '', coverLetter: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === 'browse') {
        const params: Record<string, string> = {};
        if (filterType !== 'All') params.type = filterType;
        if (filterDomain !== 'All') params.domain = filterDomain;
        if (search) params.search = search;
        const res = await api.browseJobs(params);
        setJobs(res.jobs || []);
      } else {
        const res = await api.getMyApplications();
        setApplications(res.applications || []);
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchData();

  const openApply = (job: Job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
    setApplyData({ resumeLink: '', portfolioLink: '', githubLink: '', coverLetter: '' });
  };

  const submitApplication = async () => {
    if (!selectedJob) return;
    setSubmitting(true);
    try {
      await api.applyToJob(selectedJob._id, applyData);
      toast.success('Application submitted! 🎉');
      setShowApplyModal(false);
      fetchData();
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Failed to apply';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const daysLeft = (deadline: string) => {
    const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return d > 0 ? d : 0;
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase size={24} className="text-[#7C3AED]" /> Opportunities
            </h1>
            <p className="text-[#94A3B8] text-sm mt-0.5">Find internships and jobs curated for your skills</p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/5">
            <button onClick={() => setTab('browse')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'browse' ? 'bg-[#7C3AED] text-white' : 'text-[#94A3B8] hover:text-white'}`}>
              Browse Jobs
            </button>
            <button onClick={() => setTab('applied')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'applied' ? 'bg-[#7C3AED] text-white' : 'text-[#94A3B8] hover:text-white'}`}>
              My Applications
            </button>
          </div>
        </div>

        {/* Browse Tab */}
        {tab === 'browse' && (
          <>
            {/* Filters */}
            <div className="glass-card p-4 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Search jobs, companies..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-[#64748B] outline-none focus:border-[#7C3AED]/50"
                />
              </div>
              <select value={filterType} onChange={e => { setFilterType(e.target.value); }}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#94A3B8] outline-none">
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={filterDomain} onChange={e => { setFilterDomain(e.target.value); }}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#94A3B8] outline-none">
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <button onClick={handleSearch}
                className="px-4 py-2.5 bg-[#7C3AED] hover:bg-[#7C3AED]/80 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all">
                <Filter size={12} /> Filter
              </button>
            </div>

            {/* Job Cards */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="glass-card p-5 animate-pulse">
                    <div className="h-5 w-48 bg-white/10 rounded mb-3" />
                    <div className="h-3 w-32 bg-white/5 rounded mb-4" />
                    <div className="h-16 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Briefcase size={40} className="text-[#475569] mx-auto mb-3" />
                <h3 className="text-white font-bold mb-1">No opportunities found</h3>
                <p className="text-[#64748B] text-sm">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map(job => (
                  <div key={job._id} className="glass-card p-5 hover:border-white/10 transition-all group">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#7C3AED] border border-white/5">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-sm group-hover:text-[#7C3AED] transition-colors">{job.title}</h3>
                          <p className="text-[10px] text-[#64748B]">{job.companyName}</p>
                        </div>
                      </div>
                      <span className="text-[9px] px-2 py-1 rounded-full font-bold"
                        style={{ backgroundColor: `${TYPE_COLORS[job.jobType] || '#7C3AED'}20`, color: TYPE_COLORS[job.jobType] || '#7C3AED' }}>
                        {job.jobType}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-3 mb-3 text-[10px] text-[#94A3B8]">
                      <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Award size={10} /> {job.stipendOrSalary}</span>
                      <span className="flex items-center gap-1"><TrendingUp size={10} /> {job.experienceLevel}</span>
                    </div>

                    {/* Skills */}
                    {job.requiredSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {job.requiredSkills.slice(0, 4).map(s => (
                          <span key={s} className="text-[9px] px-2 py-0.5 bg-white/5 text-[#94A3B8] rounded-full border border-white/5">{s}</span>
                        ))}
                        {job.requiredSkills.length > 4 && (
                          <span className="text-[9px] px-2 py-0.5 text-[#64748B]">+{job.requiredSkills.length - 4} more</span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <Calendar size={10} className="text-[#64748B]" />
                        <span className={`text-[10px] font-bold ${daysLeft(job.applicationDeadline) <= 3 ? 'text-[#EF4444]' : 'text-[#64748B]'}`}>
                          {daysLeft(job.applicationDeadline) === 0 ? 'Deadline passed' : `${daysLeft(job.applicationDeadline)} days left`}
                        </span>
                      </div>
                      {job.hasApplied ? (
                        <span className="text-[10px] font-bold flex items-center gap-1"
                          style={{ color: STATUS_COLORS[job.applicationStatus || 'Applied']?.text || '#3B82F6' }}>
                          <CheckCircle2 size={12} /> {job.applicationStatus || 'Applied'}
                        </span>
                      ) : (
                        <button onClick={() => openApply(job)}
                          className="px-3 py-1.5 bg-[#7C3AED] hover:bg-[#7C3AED]/80 text-white text-[10px] font-bold rounded-lg flex items-center gap-1.5 transition-all">
                          <Send size={10} /> Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Applications Tab */}
        {tab === 'applied' && (
          <>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-card p-5 animate-pulse">
                    <div className="h-5 w-48 bg-white/10 rounded mb-2" />
                    <div className="h-3 w-32 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <FileText size={40} className="text-[#475569] mx-auto mb-3" />
                <h3 className="text-white font-bold mb-1">No applications yet</h3>
                <p className="text-[#64748B] text-sm">Browse opportunities and apply to get started</p>
                <button onClick={() => setTab('browse')}
                  className="mt-4 px-4 py-2 bg-[#7C3AED] text-white text-xs font-bold rounded-lg">
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map(app => {
                  const sc = STATUS_COLORS[app.status];
                  return (
                    <div key={app._id} className="glass-card p-5 hover:border-white/10 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#7C3AED] border border-white/5">
                            <Building2 size={18} />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-sm">{app.jobId?.title || 'Position'}</h3>
                            <p className="text-[10px] text-[#64748B]">{app.jobId?.companyName} · {app.jobId?.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] px-2.5 py-1 rounded-full font-bold"
                            style={{ backgroundColor: `${sc.text}15`, color: sc.text }}>
                            {app.status}
                          </span>
                          <span className="text-[9px] text-[#475569]">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {app.recruiterFeedback && (
                        <div className="mt-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                          <p className="text-[10px] text-[#64748B] uppercase font-bold mb-1">Recruiter Feedback</p>
                          <p className="text-xs text-[#94A3B8]">{app.recruiterFeedback}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowApplyModal(false)}>
          <div className="glass-card w-full max-w-lg p-6 space-y-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold">Apply to {selectedJob.title}</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-[#64748B] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <p className="text-[10px] text-[#64748B]">{selectedJob.companyName} · {selectedJob.location}</p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">Resume Link</label>
                <input value={applyData.resumeLink} onChange={e => setApplyData({ ...applyData, resumeLink: e.target.value })}
                  placeholder="https://drive.google.com/..." className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-[#475569] outline-none focus:border-[#7C3AED]/50" />
              </div>
              <div>
                <label className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">Portfolio Link</label>
                <input value={applyData.portfolioLink} onChange={e => setApplyData({ ...applyData, portfolioLink: e.target.value })}
                  placeholder="https://yourportfolio.com" className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-[#475569] outline-none focus:border-[#7C3AED]/50" />
              </div>
              <div>
                <label className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">GitHub Link</label>
                <input value={applyData.githubLink} onChange={e => setApplyData({ ...applyData, githubLink: e.target.value })}
                  placeholder="https://github.com/username" className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-[#475569] outline-none focus:border-[#7C3AED]/50" />
              </div>
              <div>
                <label className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">Cover Letter</label>
                <textarea value={applyData.coverLetter} onChange={e => setApplyData({ ...applyData, coverLetter: e.target.value })}
                  rows={4} placeholder="Why are you a good fit for this role..."
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-[#475569] outline-none resize-none focus:border-[#7C3AED]/50" />
              </div>
            </div>

            <div className="p-3 bg-[#7C3AED]/5 border border-[#7C3AED]/10 rounded-lg">
              <p className="text-[10px] text-[#7C3AED]">
                ✨ Your SkillBridge performance metrics (XP, courses, projects, community score) will be automatically attached to your application.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowApplyModal(false)}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-[#94A3B8] text-xs font-bold rounded-lg hover:bg-white/10 transition-all">
                Cancel
              </button>
              <button onClick={submitApplication} disabled={submitting}
                className="flex-1 px-4 py-2.5 bg-[#7C3AED] hover:bg-[#7C3AED]/80 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all disabled:opacity-50">
                {submitting ? <Clock size={12} className="animate-spin" /> : <Send size={12} />}
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
