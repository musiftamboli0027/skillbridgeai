import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Button } from '../components/ui/button';
import { Loader2, Share2, Award, CheckCircle2, Trophy, ArrowLeft, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Certificate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchCertificateData = async () => {
            try {
                // Here we fetch the enrollment details which contain course and user info
                // We'll use getCourseProgress since it returns enrollment data
                const res = await api.getCourseProgress(id!);
                if (res.success) {
                    setData(res.data);
                } else {
                    toast.error('Certificate data not found');
                }
            } catch (err) {
                toast.error('Failed to load certificate');
            } finally {
                setLoading(false);
            }
        };

        fetchCertificateData();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Generating Your Certificate...</p>
            </div>
        </div>
    );

    if (!data) return (
        <div className="h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-black text-slate-800">Verification Failed</h1>
                <p className="text-slate-500 mt-2">We couldn't find a valid certificate for this ID.</p>
                <Button onClick={() => navigate('/dashboard')} className="mt-6 rounded-2xl px-8 h-12 bg-indigo-600">Back to Dashboard</Button>
            </div>
        </div>
    );

    const completionDate = data.completionDate ? new Date(data.completionDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }) : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
            {/* Action Bar */}
            <div className="max-w-[1000px] w-full mb-8 flex items-center justify-between no-print">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-white"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </Button>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="rounded-2xl h-11 px-6 border-white bg-white shadow-sm hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest"
                    >
                        <Printer size={16} className="mr-2" /> Print PDF
                    </Button>
                    <Button
                        className="rounded-2xl h-11 px-8 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 font-black text-[10px] uppercase tracking-widest"
                    >
                        <Share2 size={16} className="mr-2" /> Share Result
                    </Button>
                </div>
            </div>

            {/* Certificate Canvas */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[1000px] w-full bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] rounded-[4rem] p-4 relative"
            >
                {/* Visual Borders */}
                <div className="absolute inset-8 border-[1px] border-slate-100 rounded-[2.5rem]" />
                <div className="absolute inset-10 border-[4px] border-slate-50 rounded-[2rem]" />

                <div className="relative z-10 p-16 md:p-24 flex flex-col items-center text-center space-y-12 h-full min-h-[700px]">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-200 mx-auto mb-6">
                            <Award className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                            Certificate <br /> <span className="text-indigo-600">of Excellence</span>
                        </h1>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Verified Proficiency Award</p>
                    </div>

                    {/* Content */}
                    <div className="space-y-6 max-w-2xl">
                        <p className="text-slate-500 font-bold italic text-lg decoration-indigo-600">This certifies that</p>
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                            {data.user?.name || 'Valued Student'}
                        </h2>
                        <p className="text-slate-500 leading-relaxed font-bold max-w-lg mx-auto">
                            has successfully completed the comprehensive curriculum and demonstration of practical mastery in the course:
                        </p>
                        <div className="py-4 px-10 bg-slate-50 rounded-3xl inline-block border border-slate-100">
                            <h3 className="text-2xl font-black text-slate-900 uppercase">
                                {data.course?.title || 'Mastering Advanced Technologies'}
                            </h3>
                        </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full pt-12">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Date</p>
                            <p className="text-sm font-black text-slate-800 uppercase">{completionDate}</p>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full border-4 border-emerald-50 text-emerald-500 flex items-center justify-center">
                                <CheckCircle2 size={32} />
                            </div>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Alumnus</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certificate ID</p>
                            <p className="text-sm font-bold text-slate-800 font-mono tracking-tight underline decoration-indigo-600 underline-offset-4">
                                SB-{id?.substring(0, 8).toUpperCase()}-{data._id.substring(data._id.length - 4).toUpperCase()}
                            </p>
                        </div>
                    </div>

                    {/* Final Badge */}
                    <div className="absolute bottom-12 right-12 flex flex-col items-center no-print">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl rotate-12">
                            <Trophy className="text-yellow-400 w-8 h-8" />
                        </div>
                    </div>
                </div>

                {/* Print Styling */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        .no-print { display: none !important; }
                        body { background: white !important; margin: 0; padding: 0; }
                        .shadow-2xl, .shadow-sm, .shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] { box-shadow: none !important; }
                        .rounded-[4rem], .rounded-[2.5rem], .rounded-[2rem] { border-radius: 0 !important; }
                        .bg-slate-50 { background-color: white !important; }
                        @page { size: landscape; margin: 0; }
                    }
                `}} />
            </motion.div>

            {/* Success Celebration Message */}
            <div className="mt-12 text-center no-print space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 font-black text-[10px] uppercase tracking-widest animate-bounce">
                    <Trophy size={14} /> You've achieved mastery!
                </div>
                <h3 className="text-xl font-black text-slate-800">Ready for your next challenge?</h3>
                <p className="text-slate-500 font-bold max-w-sm mx-auto text-sm">You can now display this verified credential on your professional profile or resume.</p>
                <Button onClick={() => navigate('/courses')} className="mt-4 rounded-2xl h-14 px-12 bg-slate-900 hover:bg-slate-800 font-black shadow-2xl">
                    Explore New Courses
                </Button>
            </div>
        </div>
    );
}
