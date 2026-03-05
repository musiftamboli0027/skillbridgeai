import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { api } from '../services/api';
import {
  Briefcase, MapPin, Calendar, Building2, ArrowRight,
  Search, TrendingUp, Award
} from 'lucide-react';

interface PublicJob {
  _id: string;
  title: string;
  companyName: string;
  jobType: string;
  requiredDomains: string[];
  requiredSkills: string[];
  experienceLevel: string;
  stipendOrSalary: string;
  location: string;
  description: string;
  applicationDeadline: string;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  'Internship': '#10B981',
  'Full-Time': '#3B82F6',
  'Part-Time': '#F59E0B',
  'Remote': '#8B5CF6',
  'Contract': '#EF4444',
};

export default function OpportunitiesPublic() {
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.getPublicJobs();
      setJobs(res.jobs || []);
    } catch {
      // silently fail for public
    } finally {
      setLoading(false);
    }
  };

  const filtered = search
    ? jobs.filter(j =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName.toLowerCase().includes(search.toLowerCase())
    )
    : jobs;

  const daysLeft = (deadline: string) => {
    const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return d > 0 ? d : 0;
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Opportunities at <span className="text-yellow-300">SkillBridge</span>
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Curated internships and jobs from verified recruiters — matched to your skills
            </p>
            <div className="max-w-xl mx-auto relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search jobs, companies..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-800 text-sm outline-none shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-slate-50 rounded-2xl p-6 animate-pulse">
                  <div className="h-5 w-40 bg-slate-200 rounded mb-3" />
                  <div className="h-3 w-24 bg-slate-100 rounded mb-4" />
                  <div className="h-20 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No opportunities available</h3>
              <p className="text-slate-500">New positions are posted regularly. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(job => (
                <div key={job._id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/5 flex items-center justify-center">
                      <Building2 size={18} className="text-[#7C3AED]" />
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-bold"
                      style={{ backgroundColor: `${TYPE_COLORS[job.jobType] || '#7C3AED'}15`, color: TYPE_COLORS[job.jobType] || '#7C3AED' }}>
                      {job.jobType}
                    </span>
                  </div>

                  <h3 className="text-slate-800 font-bold mb-1 group-hover:text-[#7C3AED] transition-colors">{job.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{job.companyName}</p>

                  <div className="flex flex-wrap gap-2 mb-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
                    <span className="flex items-center gap-1"><Award size={10} /> {job.stipendOrSalary}</span>
                    <span className="flex items-center gap-1"><TrendingUp size={10} /> {job.experienceLevel}</span>
                  </div>

                  {job.requiredSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {job.requiredSkills.slice(0, 3).map(s => (
                        <span key={s} className="text-[9px] px-2 py-0.5 bg-slate-50 text-slate-600 rounded-full border border-slate-100">{s}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Calendar size={10} />
                      {daysLeft(job.applicationDeadline)} days left
                    </span>
                    <Link to="/login" className="text-[10px] font-bold text-[#7C3AED] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Apply Now <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] rounded-3xl p-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Join SkillBridge to Apply</h2>
            <p className="text-white/80 mb-6">Create your profile, build skills, and get matched with the best opportunities</p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-[#7C3AED] font-bold px-6 py-3 rounded-xl hover:shadow-xl transition-all">
              Get Started Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
