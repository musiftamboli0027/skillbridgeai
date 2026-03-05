import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { toast } from 'sonner';
import {
  Briefcase, Plus, Users, Clock, Github, Building2, Eye,
  User as UserIcon
} from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  jobType: string;
  location: string;
  applicants: number;
  status: string;
  createdAt: string;
}

interface Applicant {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    year: string;
    branch: string;
  };
  resumeLink: string;
  portfolioLink: string;
  githubLink: string;
  coverLetter: string;
  status: string;
  performanceSnapshot: {
    communityScore: number;
    collaborationScore: number;
    xp: number;
    projectsCompleted: number;
    githubCommits: number;
  };
  matchScore?: number;
  createdAt: string;
}

export default function RecruiterDashboard() {
  const [tab, setTab] = useState<'jobs' | 'create'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Job State
  const [formData, setFormData] = useState({
    title: '', jobType: 'Internship', location: 'Remote', stipendOrSalary: '',
    experienceLevel: 'Any', description: '', applicationDeadline: ''
  });
  const [creating, setCreating] = useState(false);

  // Applicants State
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantSort, setApplicantSort] = useState('newest');

  useEffect(() => {
    if (tab === 'jobs') fetchJobs();
  }, [tab]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.getRecruiterJobs();
      setJobs(res.jobs || []);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createJob(formData);
      toast.success('Job posted successfully!');
      setTab('jobs');
      setFormData({
        title: '', jobType: 'Internship', location: 'Remote', stipendOrSalary: '',
        experienceLevel: 'Any', description: '', applicationDeadline: ''
      });
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Failed to post';
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  const viewApplicants = async (job: Job) => {
    setSelectedJob(job);
    setLoadingApplicants(true);
    try {
      const res = await api.getJobApplicants(job._id, applicantSort);
      setApplicants(res.applicants || []);
    } catch {
      toast.error('Failed to load applicants');
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    if (selectedJob) viewApplicants(selectedJob);
  }, [applicantSort]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (appId: string, status: string) => {
    try {
      await api.updateApplicationStatus(appId, { status });
      toast.success(`Applicant marked as ${status}`);
      if (selectedJob) viewApplicants(selectedJob); // refresh
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (selectedJob) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-6 animate-slide-in">
          <div className="flex items-center justify-between">
            <div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="text-[#94A3B8] hover:text-white text-sm mb-2 flex items-center gap-1 transition-colors"
              >
                ← Back to Jobs
              </button>
              <h1 className="text-2xl font-bold text-white">Applicants for: {selectedJob.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#94A3B8]">Sort by:</span>
              <select 
                value={applicantSort} 
                onChange={e => setApplicantSort(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
              >
                <option value="newest">Newest</option>
                <option value="score">Highest Match Score</option>
                <option value="xp">Highest XP</option>
                <option value="community">Community Score</option>
                <option value="collaboration">Collaboration Score</option>
              </select>
            </div>
          </div>

          {loadingApplicants ? (
            <div className="flex justify-center py-12"><Clock className="animate-spin text-[#7C3AED]" /></div>
          ) : applicants.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Users size={40} className="text-[#475569] mx-auto mb-3" />
              <h3 className="text-white font-bold mb-1">No applicants yet</h3>
              <p className="text-[#64748B] text-sm">Once students apply, they will appear here based on your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applicants.map(app => (
                <div key={app._id} className="glass-card p-5">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Student Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10 shrink-0 overflow-hidden">
                          {app.studentId?.avatar ? (
                            <img src={app.studentId.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon size={20} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-bold">{app.studentId?.name || 'Unknown Student'}</h3>
                          <p className="text-[11px] text-[#94A3B8]">{app.studentId?.branch} · {app.studentId?.year}</p>
                          <a href={`mailto:${app.studentId?.email}`} className="text-[10px] text-[#7C3AED] hover:underline">
                            {app.studentId?.email}
                          </a>
                        </div>
                      </div>
                      
                      {app.coverLetter && (
                        <div className="mb-4">
                          <p className="text-[10px] text-[#94A3B8] font-bold uppercase mb-1">Cover Letter</p>
                          <p className="text-xs text-[#E6EDF3] bg-white/[0.02] p-3 rounded-lg border border-white/5">{app.coverLetter}</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        {app.resumeLink && (
                          <a href={app.resumeLink} target="_blank" rel="noreferrer"
                            className="text-[10px] px-3 py-1.5 bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 rounded-md transition-colors">
                            View Resume
                          </a>
                        )}
                        {app.portfolioLink && (
                          <a href={app.portfolioLink} target="_blank" rel="noreferrer"
                            className="text-[10px] px-3 py-1.5 bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20 rounded-md transition-colors">
                            Portfolio
                          </a>
                        )}
                        {app.githubLink && (
                          <a href={app.githubLink} target="_blank" rel="noreferrer"
                            className="text-[10px] px-3 py-1.5 bg-white/10 text-white hover:bg-white/20 rounded-md transition-colors flex items-center gap-1">
                            <Github size={10} /> GitHub
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="md:w-64 shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                      <div className="space-y-3 mb-4">
                        <p className="text-[10px] text-[#94A3B8] font-bold uppercase">Performance Snapshot</p>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div className="bg-white/5 p-2 rounded flex flex-col">
                            <span className="text-[#64748B]">XP Avg</span>
                            <span className="text-white font-bold">{app.performanceSnapshot.xp}</span>
                          </div>
                          <div className="bg-white/5 p-2 rounded flex flex-col">
                            <span className="text-[#64748B]">Comm. Score</span>
                            <span className="text-white font-bold">{app.performanceSnapshot.communityScore}</span>
                          </div>
                          <div className="bg-white/5 p-2 rounded flex flex-col">
                            <span className="text-[#64748B]">Collab Score</span>
                            <span className="text-white font-bold">{app.performanceSnapshot.collaborationScore}</span>
                          </div>
                          <div className="bg-white/5 p-2 rounded flex flex-col">
                            <span className="text-[#64748B]">Match Score</span>
                            <span className="text-[#10B981] font-bold">{app.matchScore || 0}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] text-[#94A3B8] font-bold uppercase mb-1">Decision</p>
                        {app.status === 'Applied' ? (
                          <div className="flex gap-2">
                            <button onClick={() => updateStatus(app._id, 'Shortlisted')}
                              className="flex-1 py-1.5 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/20 rounded text-[10px] font-bold transition-all">
                              Shortlist
                            </button>
                            <button onClick={() => updateStatus(app._id, 'Rejected')}
                              className="flex-1 py-1.5 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/20 rounded text-[10px] font-bold transition-all">
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                             <div className={`flex-1 py-1.5 rounded text-[10px] font-bold text-center border ${
                                app.status === 'Shortlisted' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                                app.status === 'Hired' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                                'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
                             }`}>
                               {app.status}
                             </div>
                             {app.status === 'Shortlisted' && (
                                <button onClick={() => updateStatus(app._id, 'Hired')}
                                  className="flex-1 py-1.5 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/20 rounded text-[10px] font-bold transition-all">
                                  Mark Hired
                                </button>
                             )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Building2 size={24} className="text-[#7C3AED]" /> Hiring Dashboard
            </h1>
            <p className="text-[#94A3B8] text-sm mt-0.5">Manage your job postings and applicants</p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/5">
            <button onClick={() => setTab('jobs')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'jobs' ? 'bg-[#7C3AED] text-white' : 'text-[#94A3B8] hover:text-white'}`}>
              My Postings
            </button>
            <button onClick={() => setTab('create')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${tab === 'create' ? 'bg-[#7C3AED] text-white' : 'text-[#94A3B8] hover:text-white'}`}>
              <Plus size={14} /> Post New Job
            </button>
          </div>
        </div>

        {/* My Postings Tab */}
        {tab === 'jobs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full py-12 flex justify-center"><Clock className="animate-spin text-[#7C3AED]" /></div>
            ) : jobs.length === 0 ? (
              <div className="col-span-full glass-card p-12 text-center">
                <Briefcase size={40} className="text-[#475569] mx-auto mb-3" />
                <h3 className="text-white font-bold mb-1">No jobs posted</h3>
                <p className="text-[#64748B] text-sm">Create your first job posting to find top talent.</p>
              </div>
            ) : (
              jobs.map(job => (
                <div key={job._id} className="glass-card p-5 hover:border-white/10 transition-all flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-white font-bold">{job.title}</h3>
                    <span className={`text-[9px] px-2 py-1 rounded font-bold ${job.status === 'Active' ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#EF4444]/15 text-[#EF4444]'}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] flex items-center gap-2 mb-4">
                     <span className="bg-white/5 px-2 py-0.5 rounded">{job.jobType}</span>
                     <span>·</span>
                     <span>{job.location}</span>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-1.5 text-xs text-[#E6EDF3] font-bold">
                        <Users size={14} className="text-[#7C3AED]" />
                        {job.applicants} Applicants
                     </div>
                     <button onClick={() => viewApplicants(job)}
                       className="text-[10px] px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-md transition-colors flex items-center gap-1">
                       <Eye size={12} /> View
                     </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Create Job Tab */}
        {tab === 'create' && (
          <div className="glass-card p-6 max-w-3xl mx-auto">
            <h2 className="text-lg font-bold text-white mb-6">Post a New Opportunity</h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">Job Title *</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Frontend Developer Intern" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-[#475569] outline-none focus:border-[#7C3AED]/50" />
                </div>
                <div>
                  <label className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">Job Type *</label>
                  <select value={formData.jobType} onChange={e => setFormData({...formData, jobType: e.target.value})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-[#7C3AED]/50">
                    <option value="Internship">Internship</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">Location *</label>
                  <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. Remote, Bangalore, India" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-[#475569] outline-none focus:border-[#7C3AED]/50" />
                </div>
                <div>
                  <label className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">Stipend / Salary</label>
                  <input value={formData.stipendOrSalary} onChange={e => setFormData({...formData, stipendOrSalary: e.target.value})}
                    placeholder="e.g. 10k/month, Unpaid" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-[#475569] outline-none focus:border-[#7C3AED]/50" />
                </div>
                <div>
                  <label className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">Experience Level</label>
                  <select value={formData.experienceLevel} onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-[#7C3AED]/50">
                    <option value="Any">Any</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">Application Deadline *</label>
                  <input type="date" required value={formData.applicationDeadline} onChange={e => setFormData({...formData, applicationDeadline: e.target.value})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-[#475569] outline-none focus:border-[#7C3AED]/50 [color-scheme:dark]" />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">Job Description *</label>
                <textarea required rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-[#475569] outline-none focus:border-[#7C3AED]/50 resize-y" />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={creating}
                  className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#7C3AED]/80 text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50">
                  {creating ? <Clock size={16} className="animate-spin" /> : <Briefcase size={16} />}
                  {creating ? 'Posting...' : 'Post Job Opening'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
