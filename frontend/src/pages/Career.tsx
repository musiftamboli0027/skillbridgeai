import { motion } from 'framer-motion';
import { BadgeCheck, Briefcase, Filter, MapPin, Search, Star, Zap } from 'lucide-react';

export default function Career() {
    const jobs = [
        { title: 'Senior Product Designer', category: 'Design', type: 'Full-time', location: 'Remote', salary: '$120k - $160k' },
        { title: 'Full Stack Engineer', category: 'Engineering', type: 'Full-time', location: 'Europe / USA', salary: '$140k - $190k' },
        { title: 'Content strategist', category: 'Marketing', type: 'Part-time', location: 'Remote', salary: '$80k - $100k' },
        { title: 'Student Success Manager', category: 'Operations', type: 'Full-time', location: 'India (Hybrid)', salary: '$60k - $90k' },
        { title: 'AI Research Intern', category: 'Engineering', type: 'Internship', location: 'Remote', salary: '$30k - $45k' },
    ];

    const perks = [
        { title: 'Remote-First', description: 'Work from anywhere in the world.', icon: BadgeCheck },
        { title: 'Equity Options', description: 'Own a piece of the future.', icon: Star },
        { title: 'Learning Stipend', description: '$2,000 yearly for growth.', icon: Zap },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white">
            {/* Dark Mode Hero */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent -z-10" />
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-10 backdrop-blur-xl"
                        >
                            <Briefcase className="w-10 h-10 text-indigo-400" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-10"
                        >
                            BUILD THE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">FUTURE OF ED-TECH</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-400 text-xl md:text-2xl max-w-2xl font-medium leading-relaxed mb-12"
                        >
                            Join a globally distributed team that's redefining how millions of people learn and grow.
                        </motion.p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <button className="px-10 h-16 bg-white text-black font-black uppercase tracking-widest rounded-3xl hover:bg-slate-200 transition-all active:scale-95 shadow-2xl shadow-white/5">
                                View Open Roles
                            </button>
                            <button className="px-10 h-16 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-3xl hover:bg-white/10 transition-all active:scale-95 backdrop-blur-xl">
                                Our Culture
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Perks Section */}
            <section className="py-24 px-6 border-t border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        {perks.map((perk, idx) => (
                            <div key={idx} className="group p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                    <perk.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{perk.title}</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">{perk.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Job Listing Section */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-10">
                        <div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Open Roles</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm">We are always looking for talent</p>
                        </div>
                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input type="text" placeholder="Search function..." className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-all" />
                            </div>
                            <button className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-white/10">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {jobs.map((job, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ x: 10 }}
                                className="group flex flex-col md:flex-row md:items-center justify-between p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-indigo-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20">{job.category}</span>
                                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{job.type}</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white group-hover:text-indigo-400 transition-colors uppercase">{job.title}</h3>
                                    <div className="flex items-center gap-6 text-slate-400 text-sm font-bold">
                                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.location}</span>
                                        <span className="text-indigo-600/50">•</span>
                                        <span>{job.salary} / year</span>
                                    </div>
                                </div>
                                <button className="mt-8 md:mt-0 w-full md:w-auto px-8 h-14 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:border-indigo-600 transition-all">
                                    Apply Now
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
