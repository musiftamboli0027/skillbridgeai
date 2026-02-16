import { motion } from 'framer-motion';
import { Target, Users, Award, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function About() {
    const stats = [
        { label: 'Active Learners', value: '50K+', icon: Users },
        { label: 'Expert Mentors', value: '200+', icon: Award },
        { label: 'Course Satisfaction', value: '99%', icon: Zap },
        { label: 'Global Reach', value: '45+', icon: Globe },
    ];

    const values = [
        {
            title: 'Excellence in Education',
            description: 'We strive for the highest standards in everything we do, from course content to student support.',
            icon: Award,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        },
        {
            title: 'Student-First Approach',
            description: 'Our students are at the heart of our mission. We build features and content based on your needs.',
            icon: Target,
            color: 'text-rose-600',
            bg: 'bg-rose-50'
        },
        {
            title: 'Trust & Integrity',
            description: 'We believe in transparency and honest communication with our community of learners.',
            icon: ShieldCheck,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/50 skew-x-12 translate-x-1/3 -z-10" />
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-sm font-bold uppercase tracking-wider mb-6"
                        >
                            About SkillBridge
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-8"
                        >
                            Empowering Minds, <br />
                            <span className="text-indigo-600">Bridging the Future.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-600 leading-relaxed mb-10"
                        >
                            SkillBridge is more than just an ed-tech platform. We are a community of passionate learners and expert educators dedicated to making high-quality education accessible to everyone, everywhere.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-4xl font-black text-slate-900 mb-2">{stat.value}</h3>
                                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-24 bg-slate-50 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">Our Core Values</h2>
                        <p className="text-slate-500 font-medium max-w-2xl mx-auto">The principles that guide us in our journey to redefine the learning experience.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {values.map((value, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-lg"
                            >
                                <div className={`w-16 h-16 ${value.bg} ${value.color} rounded-[1.5rem] flex items-center justify-center mb-8`}>
                                    <value.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">{value.title}</h3>
                                <p className="text-slate-600 leading-relaxed font-medium">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="text-indigo-400 font-black uppercase tracking-[0.2em] text-sm">Our Mission</span>
                            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-8 leading-tight">We're on a mission to democratize skill-building globally.</h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                We believe that talent is universal, but opportunity is not. By leveraging technology and world-class expertize, we're building a platform where anyone can learn anything from the best in the field.
                            </p>
                            <ul className="space-y-4">
                                {['100% Practical Learning', 'Expert-Led Curriculum', 'Lifetime Access to Content', 'Global Certification'].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-indigo-600/20 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                        </div>
                                        <span className="font-bold text-slate-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-[4rem] bg-gradient-to-br from-indigo-600 to-indigo-800 rotate-6" />
                            <div className="absolute inset-0 aspect-square rounded-[4rem] bg-slate-800 -rotate-3 border-4 border-slate-700 p-10 flex flex-col justify-end">
                                <p className="text-3xl font-black italic">"Education is the most powerful weapon which you can use to change the world."</p>
                                <p className="mt-6 font-bold text-indigo-400">— Nelson Mandela</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
