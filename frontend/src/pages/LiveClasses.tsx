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
    Radio,
    Users
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
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
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pt-6">
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg w-fit">
                            <Radio className="w-3.5 h-3.5 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Synchronous Learning</span>
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">LIVE <span className="text-gradient">WORKSHOPS</span></h1>
                            <p className="text-[#94A3B8] font-medium mt-2 max-w-xl">Accelerate your architectural mastery with real-time expert coordination and peer intelligence.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group flex-1 min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-rose-500 transition-colors" />
                            <Input
                                placeholder="Search live architecture streams..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 h-14 bg-white/5 border-white/5 rounded-2xl text-white placeholder:text-[#64748B] focus:outline-none focus:border-rose-500/30 transition-all font-medium"
                            />
                        </div>
                        <Button className="btn-admin h-14 px-8 gap-2 bg-[#0A0E1A] border-white/10 hover:bg-white/5">
                            <Calendar className="w-4 h-4 text-rose-500 font-bold" />
                            Institutional Schedule
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left: Schedule & List */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Weekly Quick Access */}
                        <div className="glass-card p-10 border-white/5">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="font-bold text-white tracking-tight text-xl">Chronosphere</h3>
                                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.2em] mt-1">Weekly Coordination</p>
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[#94A3B8] text-xs font-bold uppercase tracking-widest">
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
                                                "flex flex-col items-center gap-3 p-5 rounded-2xl transition-all border shrink-0",
                                                isSelected
                                                    ? "bg-rose-600 border-rose-500 text-white shadow-[0_15px_30px_rgba(225,29,72,0.3)] scale-110"
                                                    : "bg-white/5 border-white/5 text-[#64748B] hover:border-white/10 hover:text-[#94A3B8]"
                                            )}
                                        >
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{day}</span>
                                            <span className="text-2xl font-bold">{date}</span>
                                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Session List */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-rose-600 rounded-full" />
                                    <h3 className="font-bold text-white uppercase tracking-[0.2em] text-sm">Active Grid</h3>
                                </div>
                                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Global Live Access</p>
                            </div>

                            {filteredSessions.length > 0 ? (
                                filteredSessions.map((session, idx) => (
                                    <motion.div
                                        key={session.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="glass-card p-6 flex flex-col md:flex-row md:items-center gap-8 border-white/5 group hover:shadow-[0_20px_50px_rgba(225,29,72,0.1)] transition-all duration-500"
                                    >
                                        <div className="w-full md:w-56 aspect-video rounded-2xl bg-white/5 border border-white/5 overflow-hidden relative">
                                            <div className="absolute inset-0 flex items-center justify-center bg-rose-500/5 group-hover:bg-rose-500/10 transition-colors">
                                                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-rose-500 shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all duration-500">
                                                    <Play className="w-6 h-6 fill-current" />
                                                </div>
                                            </div>
                                            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-rose-600 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-white shadow-lg shadow-rose-900/40">
                                                <Radio className="w-3.5 h-3.5 animate-[pulse_1.5s_infinite]" />
                                                Streaming
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-5">
                                            <div>
                                                <div className="flex items-center gap-4 mb-3">
                                                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg font-bold text-[9px] uppercase tracking-widest">
                                                        {session.course}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-[#64748B] text-[10px] font-bold uppercase tracking-widest">
                                                        <Clock className="w-3.5 h-3.5 text-[#00D4FF]" />
                                                        {session.duration}
                                                    </div>
                                                </div>
                                                <h4 className="text-2xl font-bold text-white leading-tight hover:text-rose-500 transition-colors">
                                                    {session.topic}
                                                </h4>
                                            </div>

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <Avatar className="h-10 w-10 ring-2 ring-white/5 border border-white/10">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.instructor}`} />
                                                            <AvatarFallback>{session.instructor[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#0A0E1A]" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest line-clamp-1">Orchestrator</span>
                                                        <span className="text-sm font-bold text-white">{session.instructor}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Button variant="outline" className="h-12 w-12 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20">
                                                        <Sparkles className="w-5 h-5 text-indigo-400" />
                                                    </Button>
                                                    <Button className="h-12 px-8 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl gap-2 shadow-[0_10px_30px_rgba(225,29,72,0.3)] uppercase tracking-widest text-[11px] group">
                                                        Establish Link
                                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="glass-card border-dashed p-24 flex flex-col items-center justify-center text-center space-y-8">
                                    <div className="w-28 h-28 rounded-3xl bg-rose-500/5 flex items-center justify-center text-rose-500 border border-rose-500/10 shadow-2xl">
                                        <Video className="w-12 h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Spectrum Quiet</h3>
                                        <p className="text-[#94A3B8] font-medium max-w-sm mx-auto">No live transmission archetypes detected for this coordination. Return to the curriculum grid for asynchronous study.</p>
                                    </div>
                                    <Button
                                        onClick={() => window.location.hash = '#/courses'}
                                        className="btn-admin h-14 px-12 bg-white/5 text-white border-white/10 hover:bg-white/10"
                                    >
                                        Return to Core
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Sidebar */}
                    <div className="space-y-10">
                        {/* Featured Workshop Card */}
                        <div className="bg-[#7C3AED] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-[0_30px_60px_rgba(124,58,237,0.3)] border border-white/10">
                            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 blur-[80px]" />
                            <div className="absolute bottom-[-20%] left-[-20%] w-64 h-64 bg-black/10 blur-[80px]" />

                            <div className="relative z-10">
                                <span className="px-4 py-1.5 bg-black/20 backdrop-blur-md text-white border border-white/20 font-bold text-[9px] uppercase tracking-[0.3em] rounded-lg mb-8 inline-block">Flash Sync</span>
                                <h3 className="text-3xl font-bold uppercase leading-[1.1] mb-6 tracking-tight">Global <br />Network <br />Audit</h3>
                                <p className="text-indigo-100/70 text-sm font-medium mb-10 leading-relaxed">Intelligence gathering on planetary design systems. Synchronized session incoming.</p>
                                <Button disabled className="w-full h-15 bg-white text-[#7C3AED] font-bold rounded-2xl cursor-not-allowed border-none opacity-50 uppercase tracking-widest text-xs">
                                    Sync Locked
                                </Button>
                            </div>
                        </div>

                        {/* Mentors Online */}
                        <div className="glass-card p-8 border-white/5">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-white uppercase tracking-widest text-[11px]">Active Mentors</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#64748B]" />
                                    <span className="text-[9px] font-bold text-[#64748B] uppercase">Syncing</span>
                                </div>
                            </div>
                            <div className="py-12 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center px-6 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                                    <Users className="w-6 h-6 text-[#64748B]" />
                                </div>
                                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.2em] leading-relaxed">Coordinators are currently out of sync. Return during peak network hours.</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
}
