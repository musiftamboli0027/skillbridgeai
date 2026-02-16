import { motion } from 'framer-motion';
import { Camera, Coffee, Heart, Lightbulb, Rocket, Smile } from 'lucide-react';

export default function LifeAtSkillBridge() {
    const highlights = [
        {
            title: 'Innovative Culture',
            description: 'We foster an environment where every idea is heard and experimentation is encouraged.',
            icon: Lightbulb,
            color: 'text-amber-500',
            bg: 'bg-amber-50'
        },
        {
            title: 'Work-Life Harmony',
            description: 'Flexible hours and a remote-first mindset ensure our team stays fresh and motivated.',
            icon: Coffee,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50'
        },
        {
            title: 'Growth Mindset',
            description: 'Continuous learning is in our DNA. We provide ample resources for personal development.',
            icon: Rocket,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50'
        }
    ];

    const galleries = [
        { title: 'Tech Meetups', image: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=800' },
        { title: 'Team Retreats', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800' },
        { title: 'Hackathons', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800' },
        { title: 'Global Meetings', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800' }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-white">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-indigo-600/5 -skew-y-3 origin-top-left" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-8"
                        >
                            <Smile className="w-4 h-4" />
                            Inside SkillBridge
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-8"
                        >
                            Life at <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">SkillBridge</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-600 leading-relaxed font-medium"
                        >
                            A glimpse into the culture, people, and values that make SkillBridge a unique place to grow and create.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Culture Grid */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {highlights.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-slate-100"
                            >
                                <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-10`}>
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-6">{item.title}</h3>
                                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-24 px-6 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 uppercase tracking-tight">Our Moments of <br /><span className="text-indigo-600">Connection</span></h2>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed">Whether it's a team huddle, a global hackathon, or an informal coffee chat, we value every moment we spend together.</p>
                        </div>
                        <div className="flex items-center gap-2 px-6 py-3 bg-slate-100 rounded-2xl text-slate-600 font-black text-sm uppercase tracking-widest border border-slate-200">
                            <Camera className="w-5 h-5" />
                            Photo Log
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {galleries.map((img, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 0.98, rotate: idx % 2 === 0 ? 1 : -1 }}
                                className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl relative group"
                            >
                                <img src={img.image} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                                    <p className="text-white font-black uppercase tracking-widest text-sm">{img.title}</p>
                                </div>
                                <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white">
                                    <Camera className="w-4 h-4" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-24 px-6 bg-indigo-600 text-white">
                <div className="max-w-7xl mx-auto text-center">
                    <Heart className="w-16 h-16 text-indigo-400 mx-auto mb-10 opacity-50" />
                    <h2 className="text-3xl md:text-5xl font-black mb-10 leading-tight italic">
                        "SkillBridge is not just a company; it's a family of dreamers and doers who believe in the power of knowledge."
                    </h2>
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-4 border-indigo-400 p-1 mb-4">
                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full rounded-full" />
                        </div>
                        <p className="text-xl font-black uppercase tracking-widest">Sarah Jenkins</p>
                        <p className="text-indigo-200 font-bold text-sm tracking-widest uppercase mt-2">Product Designer @ SkillBridge</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
