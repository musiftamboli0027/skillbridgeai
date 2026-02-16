import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Video,
    Calendar,
    Clock,
    ArrowRight,
    Play,
    Sparkles,
    Search,
    ChevronRight,
    Radio
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { cn } from '../lib/utils';
import type { LiveSession } from '../types/dashboard';

export default function LiveClasses() {
    const [sessions] = useState<LiveSession[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(25); // Default to "today" simulation

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const filteredSessions = sessions.filter(s =>
        s.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.course.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-10 pb-20">

                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full w-fit">
                            <Radio className="w-3.5 h-3.5 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Interactive Learning</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Live Sessions</h1>
                            <p className="text-slate-500 font-bold mt-1">Join interactive workshops and expert-led Q&A sessions</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group flex-1 min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                            <Input
                                placeholder="Search upcoming topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-4 focus:ring-rose-500/10"
                            />
                        </div>
                        <Button className="h-14 bg-slate-900 dark:bg-white dark:text-slate-900 font-black rounded-2xl px-8 gap-2 shadow-xl hover:bg-rose-600 transition-all">
                            <Calendar className="w-4 h-4" />
                            Full Schedule
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left: Schedule & List */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Weekly Quick Access */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Weekly Overview</h3>
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                    <span>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-4">
                                {days.map((day, i) => {
                                    const date = 23 + i;
                                    const isSelected = selectedDate === date;
                                    return (
                                        <button
                                            key={day}
                                            onClick={() => setSelectedDate(date)}
                                            className={cn(
                                                "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2",
                                                isSelected
                                                    ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-none scale-110"
                                                    : "bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-400 hover:border-slate-200"
                                            )}
                                        >
                                            <span className="text-[10px] font-bold uppercase">{day}</span>
                                            <span className="text-xl font-black">{date}</span>
                                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Session List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-4">
                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Available Sessions</h3>
                                <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800 mx-6" />
                            </div>

                            {filteredSessions.length > 0 ? (
                                filteredSessions.map((session, idx) => (
                                    <motion.div
                                        key={session.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center gap-8 shadow-sm group hover:shadow-2xl hover:shadow-rose-500/5 transition-all"
                                    >
                                        <div className="w-full md:w-48 aspect-video md:aspect-[4/3] rounded-3xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative group-hover:scale-[1.02] transition-transform">
                                            <div className="absolute inset-0 flex items-center justify-center bg-rose-600/10 dark:bg-rose-900/20 group-hover:bg-rose-600/20 transition-colors">
                                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-rose-600 shadow-xl group-hover:scale-110 transition-transform">
                                                    <Play className="w-6 h-6 fill-current" />
                                                </div>
                                            </div>
                                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-rose-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase animate-pulse">
                                                <Radio className="w-3 h-3" />
                                                Live
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 font-black text-[9px] uppercase px-2">{session.course}</Badge>
                                                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {session.duration}
                                                    </div>
                                                </div>
                                                <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-rose-600 transition-colors leading-tight">
                                                    {session.topic}
                                                </h4>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-slate-900">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.instructor}`} />
                                                        <AvatarFallback>{session.instructor[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{session.instructor}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 pt-2">
                                                <Button className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 font-black rounded-xl gap-2 shadow-lg shadow-rose-100 dark:shadow-none">
                                                    Join Now
                                                    <ArrowRight className="w-4 h-4" />
                                                </Button>
                                                <Button variant="outline" className="h-12 w-12 rounded-xl p-0 border-slate-200 dark:border-slate-800">
                                                    <Sparkles className="w-5 h-5 text-indigo-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 p-20 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-24 h-24 rounded-[2rem] bg-rose-50 dark:bg-rose-900/10 flex items-center justify-center text-rose-200 dark:text-rose-800 shadow-sm">
                                        <Video className="w-12 h-12" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No live sessions</h3>
                                        <p className="text-slate-500 font-bold max-w-sm mx-auto mt-2">There are no live classes scheduled for this date. Check back later or explore recorded content.</p>
                                    </div>
                                    <Button
                                        onClick={() => window.location.hash = '#/courses'}
                                        className="h-14 font-black rounded-2xl px-10 bg-rose-600 hover:bg-rose-500 shadow-xl shadow-rose-100 dark:shadow-none"
                                    >
                                        Explore Courses
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Sidebar */}
                    <div className="space-y-10">
                        {/* Featured Workshop Card (Empty State) */}
                        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl" />
                            <Badge className="bg-white/20 text-white border-white/20 font-black text-[10px] uppercase mb-6">Expert Webinar</Badge>
                            <h3 className="text-2xl font-black uppercase leading-tight mb-4">Mastering Full-Stack Architecture</h3>
                            <div className="space-y-3 mb-8">
                                <p className="text-white/70 text-sm font-bold">Coming soon to SkillBridge. Stay tuned for dates!</p>
                            </div>
                            <Button disabled className="w-full h-14 bg-white/20 text-white font-black rounded-2xl cursor-not-allowed border border-white/10">
                                Coming Soon
                            </Button>
                        </div>

                        {/* Mentors Online (Ready to Help) */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Mentors Available</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase text-center py-10 border-2 border-dashed border-slate-50 dark:border-slate-800 rounded-3xl">Our mentors are currently offline. They usually host sessions between 9 AM - 6 PM PST.</p>
                        </div>
                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
}
