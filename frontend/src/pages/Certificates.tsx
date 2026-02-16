import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Award,
    Download,
    Share2,
    ExternalLink,
    Linkedin,
    Twitter,
    CheckCircle2,
    Search,
    Filter,
    Trophy,
    Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import type { Certificate } from '../types/dashboard';
import { api } from '../services/api';

export default function Certificates() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                setIsLoading(true);
                const response = await api.getMyEnrollments();
                // Enrollments include certificate data if completed
                const completed = (response.enrollments || [])
                    .filter((e: any) => e.certificateIssued)
                    .map((e: any) => ({
                        id: e._id,
                        courseTitle: e.course.title,
                        issueDate: e.completionDate || e.updatedAt,
                        credentialId: `SB-${e._id.substring(0, 8).toUpperCase()}`,
                        downloadUrl: e.certificateUrl
                    }));
                setCertificates(completed);
            } catch (error) {
                console.error('Failed to fetch certificates:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    const filteredCertificates = certificates.filter(c =>
        c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="h-96 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-10 pb-20">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Achievements</h1>
                        <p className="text-slate-500 font-bold mt-1">Manage and share your professional certifications</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search certificates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl w-64 shadow-sm"
                            />
                        </div>
                        <Button variant="outline" className="h-12 w-12 rounded-xl p-0 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <Filter className="w-5 h-5 text-slate-500" />
                        </Button>
                    </div>
                </div>

                {/* Certificates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredCertificates.length > 0 ? (
                        filteredCertificates.map((cert, idx) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col"
                            >
                                <div className="relative aspect-[16/10] bg-slate-50 dark:bg-slate-800 rounded-3xl overflow-hidden mb-8 border border-slate-100 dark:border-slate-700">
                                    <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-gradient-to-br from-indigo-500/5 to-violet-500/5">
                                        <div className="space-y-3">
                                            <Award className="w-12 h-12 text-indigo-600 mx-auto" />
                                            <div>
                                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">SkillBridge Certified</p>
                                                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{cert.courseTitle}</h3>
                                            </div>
                                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 w-24 mx-auto" />
                                            <p className="text-[9px] font-bold text-slate-400 italic">Issued on {new Date(cert.issueDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-90 transition-opacity flex items-center justify-center gap-4 cursor-pointer">
                                        <Button size="icon" className="bg-white text-indigo-600 hover:bg-slate-100 rounded-xl h-12 w-12">
                                            <Download className="w-5 h-5" />
                                        </Button>
                                        <Button size="icon" className="bg-white text-indigo-600 hover:bg-slate-100 rounded-xl h-12 w-12" onClick={() => window.open(cert.downloadUrl, '_blank')}>
                                            <ExternalLink className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-black text-xl text-slate-900 dark:text-white leading-tight mb-2 uppercase tracking-tight">{cert.courseTitle}</h4>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[9px] uppercase px-2">Verified</Badge>
                                                <span className="text-[10px] font-bold text-slate-400">ID: {cert.id}</span>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-emerald-500 border border-slate-100 dark:border-slate-700">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                                <Linkedin className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg">
                                                <Twitter className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <Button variant="link" className="text-indigo-600 font-black text-xs uppercase tracking-widest p-0 h-auto">View Details</Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 p-20 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/10 flex items-center justify-center text-indigo-400 dark:text-indigo-800 shadow-sm">
                                <Trophy className="w-12 h-12" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No certificates yet</h3>
                                <p className="text-slate-500 font-bold max-w-sm mx-auto mt-2">Complete courses and final assessments to earn and showcase your verified achievements.</p>
                            </div>
                            <Button
                                onClick={() => window.location.hash = '#/courses'}
                                className="h-14 font-black rounded-2xl px-10 bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-100 dark:shadow-none"
                            >
                                Browse Courses
                            </Button>
                        </div>
                    )}

                    {/* Milestone Placeholder (Only show if there are certificates) */}
                    {filteredCertificates.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-200 dark:text-slate-700">
                                <Award className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">Next Milestone Awaits!</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Keep learning to earn more</p>
                            </div>
                            <Button onClick={() => window.location.hash = '#/courses'} className="bg-slate-900 dark:bg-white dark:text-slate-900 font-black text-[10px] uppercase rounded-xl px-6">Explore</Button>
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}
