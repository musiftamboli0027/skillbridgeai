import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search, BookOpen, Share2 } from 'lucide-react';

export default function Blogs() {
    const posts = [
        {
            title: 'The Future of Web Development in 2026: What to Expect',
            excerpt: 'Explore the emerging trends, from AI-driven coding to the rise of edge computing and how it will redefine the web.',
            author: 'Alex River',
            date: 'Feb 01, 2026',
            readTime: '8 min read',
            category: 'Tech Trends',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800'
        },
        {
            title: 'Mastering React Server Components: A Comprehensive Guide',
            excerpt: 'Deep dive into RSCs, understanding how they change the way we build data-heavy applications with performance in mind.',
            author: 'Jordan Smith',
            date: 'Jan 28, 2026',
            readTime: '12 min read',
            category: 'Engineering',
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800'
        },
        {
            title: 'Designing for the User: Psychology and UX Principles',
            excerpt: 'How psychological triggers can be used ethically to build interfaces that are not only beautiful but highly functional.',
            author: 'Mia Chen',
            date: 'Jan 24, 2026',
            readTime: '6 min read',
            category: 'UI/UX Design',
            image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800'
        },
        {
            title: 'Building a Career in AI: From Beginner to Expert',
            excerpt: 'The roadmap you need to navigate the rapidly evolving landscape of Artificial Intelligence and Machine Learning.',
            author: 'Dr. Sarah Lee',
            date: 'Jan 20, 2026',
            readTime: '15 min read',
            category: 'Career',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Blog Header */}
            <section className="bg-white pt-32 pb-24 px-6 border-b border-slate-100">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-10"
                    >
                        <BookOpen className="w-4 h-4" />
                        SkillBridge Insights
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 text-center uppercase tracking-tight leading-none mb-10"
                    >
                        Read. Learn. <br /> <span className="text-indigo-600 italic">Evolve.</span>
                    </motion.h1>
                    <div className="relative w-full max-w-2xl group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find articles, guides, and insights..."
                            className="w-full h-18 bg-slate-50 border-2 border-transparent focus:border-indigo-600/20 focus:bg-white rounded-[2rem] pl-16 pr-6 text-lg font-medium transition-all outline-none py-5 shadow-inner"
                        />
                    </div>
                </div>
            </section>

            {/* Featured Post Area */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                        {posts.map((post, idx) => (
                            <motion.article
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100 transition-all flex flex-col"
                            >
                                <div className="aspect-[16/9] overflow-hidden relative">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute top-8 left-8">
                                        <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">{post.category}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-10 flex flex-col flex-1">
                                    <div className="flex items-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.date}</span>
                                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.readTime}</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-6">{post.title}</h2>
                                    <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8 line-clamp-2">{post.excerpt}</p>

                                    <div className="mt-auto flex items-center justify-between pt-8 border-t border-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden text-center flex items-center justify-center font-black text-xs text-indigo-600">
                                                {post.author.charAt(0)}
                                            </div>
                                            <span className="font-black text-slate-900 uppercase text-xs tracking-widest">{post.author}</span>
                                        </div>
                                        <button className="flex items-center gap-2 text-indigo-600 font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                                            Read More <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <button className="px-12 h-16 bg-slate-900 text-white font-black uppercase tracking-widest rounded-3xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-4 mx-auto shadow-2xl shadow-indigo-200">
                            Load More Articles
                            <Clock className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Newsletter Minimal CTA */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center bg-slate-900 rounded-[4rem] p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full" />
                    <Share2 className="w-12 h-12 text-white/10 mx-auto mb-8" />
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">Stay in the <span className="text-indigo-400">Loop</span></h2>
                    <p className="text-slate-400 font-medium text-lg mb-10 max-w-xl mx-auto">Get the latest insights, tutorials, and tech news delivered straight to your inbox monthly.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input type="email" placeholder="you@example.com" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium" />
                        <button className="px-8 h-14 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-all">Subscribe</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
