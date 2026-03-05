import { useState, useEffect } from 'react';
import { api } from '../../../../services/api';
import { Building2, CheckCircle2, XCircle, Search, Mail, Globe, ExternalLink, RefreshCw, User } from 'lucide-react';
import { toast } from 'sonner';

export function RecruiterManager() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [recruiters, setRecruiters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All'); // All, Pending, Approved, Rejected

    const fetchRecruiters = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAdminRecruiters();
            if (data.success) {
                setRecruiters(data.recruiters);
            }
        } catch (error) {
            console.error('Failed to fetch recruiters:', error);
            toast.error('Failed to fetch recruiter data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecruiters();
    }, []);

    const handleVerify = async (userId: string, action: 'approve' | 'reject') => {
        try {
            const res = await api.verifyRecruiter(userId, action);
            if (res.success) {
                toast.success(`Recruiter successfully ${action}d!`);
                // Update local state instead of refetching for speed
                setRecruiters(prev => prev.map(r => {
                    if (r._id === userId) {
                        return { 
                            ...r, 
                            recruiterProfile: { 
                                ...r.recruiterProfile, 
                                isVerified: action === 'approve', 
                                verificationStatus: action === 'approve' ? 'Approved' : 'Rejected' 
                            } 
                        };
                    }
                    return r;
                }));
            }
        } catch {
            toast.error(`Verification action failed.`);
        }
    };

    const filteredRecruiters = recruiters.filter(r => {
        const matchesSearch = 
            r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.recruiterProfile?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filterStatus === 'All') return matchesSearch;
        return matchesSearch && r.recruiterProfile?.verificationStatus === filterStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-l-[#7C3AED]">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Building2 className="text-[#7C3AED]" />
                        Recruiter Verification
                    </h1>
                    <p className="text-[#94A3B8] text-sm mt-1">Manage employer accounts and platform access</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button onClick={fetchRecruiters} className="btn-secondary px-3 py-2">
                        <RefreshCw size={16} />
                    </button>
                    <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
                        {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                    filterStatus === status 
                                    ? 'bg-[#7C3AED] text-white shadow-lg' 
                                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by recruiter name, email or company..."
                    className="w-full bg-[#111827]/70 backdrop-blur-md border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-10 h-10 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin" />
                </div>
            ) : filteredRecruiters.length === 0 ? (
                <div className="glass-card p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Building2 size={32} className="text-[#64748B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No recruiters found</h3>
                    <p className="text-[#94A3B8]">Try adjusting your search or filters to see accounts.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecruiters.map((recruiter) => (
                        <div key={recruiter._id} className="glass-card p-6 flex flex-col justify-between hover:border-[#7C3AED]/30 transition-all group">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        {recruiter.recruiterProfile?.companyLogo ? (
                                            <img src={recruiter.recruiterProfile.companyLogo} alt={recruiter.recruiterProfile.companyName} className="w-12 h-12 rounded-lg object-cover bg-white" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] flex items-center justify-center text-white font-bold text-xl uppercase shadow-lg">
                                                {recruiter.recruiterProfile?.companyName?.charAt(0) || 'C'}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-white font-bold leading-tight group-hover:text-[#7C3AED] transition-colors">{recruiter.recruiterProfile?.companyName || 'Unknown Company'}</h3>
                                            <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mt-1 rounded-full border ${
                                                recruiter.recruiterProfile?.verificationStatus === 'Approved' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                                                recruiter.recruiterProfile?.verificationStatus === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                                            }`}>
                                                {recruiter.recruiterProfile?.verificationStatus || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                                        <User size={14} className="text-[#7C3AED]" />
                                        <span className="text-white">{recruiter.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                                        <Mail size={14} className="text-[#7C3AED]" />
                                        <span>{recruiter.email}</span>
                                    </div>
                                    {recruiter.recruiterProfile?.companyWebsite && (
                                        <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                                            <Globe size={14} className="text-[#7C3AED]" />
                                            <a href={recruiter.recruiterProfile.companyWebsite} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                                                {new URL(recruiter.recruiterProfile.companyWebsite).hostname.replace('www.', '')}
                                                <ExternalLink size={10} />
                                            </a>
                                        </div>
                                    )}
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 mt-4">
                                         <p className="text-xs text-[#94A3B8] line-clamp-3">
                                            {recruiter.recruiterProfile?.companyDescription || "No description provided."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {recruiter.recruiterProfile?.verificationStatus === 'Pending' ? (
                                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
                                    <button 
                                        onClick={() => handleVerify(recruiter._id, 'reject')}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-bold"
                                    >
                                        <XCircle size={16} /> Reject
                                    </button>
                                    <button 
                                        onClick={() => handleVerify(recruiter._id, 'approve')}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981] hover:text-white transition-all text-sm font-bold"
                                    >
                                        <CheckCircle2 size={16} /> Approve
                                    </button>
                                </div>
                            ) : recruiter.recruiterProfile?.verificationStatus === 'Approved' ? (
                                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                                     <button 
                                        onClick={() => handleVerify(recruiter._id, 'reject')}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all text-sm font-medium"
                                    >
                                        Revoke Access
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                                     <button 
                                        onClick={() => handleVerify(recruiter._id, 'approve')}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/10 transition-all text-sm font-medium"
                                    >
                                        Re-Approve
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
