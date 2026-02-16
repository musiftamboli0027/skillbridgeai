import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import LogicVisualizer3D from './LogicVisualizer3D';
import { Terminal, BrainCircuit, Zap, Layers, Menu, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type VisualState = 'idle' | 'if' | 'else' | 'loop';

const PracticeLayout: React.FC = () => {
    const [visualState, setVisualState] = useState<VisualState>('idle');
    const [code, setCode] = useState<string>(`// Neural Engine: Decision Mapping
if (input > threshold) {
    for (let i = 0; i < 5; i++) {
        process_node(i);
    }
} else {
    standby_mode();
}`);

    return (
        <div className="flex h-screen w-full bg-[#050506] overflow-hidden selection:bg-indigo-500/30">
            {/* 1. LEFT SIDEBAR (Fixed 260px) */}
            <aside className="w-[260px] h-full border-r border-white/5 bg-[#09090b] hidden lg:flex flex-col shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-white/5 gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <BrainCircuit size={18} className="text-white" />
                    </div>
                    <span className="font-black text-sm tracking-tighter text-white uppercase italic">SkillBridge</span>
                </div>

                <div className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-2">Navigation</div>
                        <SidebarItem icon={<Code2 size={16} />} label="Neural Compiler" active />
                        <SidebarItem icon={<Zap size={16} />} label="Live Visualizer" />
                        <SidebarItem icon={<Layers size={16} />} label="Architecture" />
                    </div>
                </div>

                <div className="p-4 border-t border-white/5">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Runtime Version</p>
                        <p className="text-[11px] font-bold text-indigo-400 font-mono">v4.2.0-STABLE</p>
                    </div>
                </div>
            </aside>

            {/* 2. REMAINING CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header (64px) */}
                <header className="h-[64px] border-b border-white/5 flex items-center justify-between px-6 bg-[#050506]/50 backdrop-blur-xl shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <Menu size={20} className="text-slate-400 lg:hidden" />
                        <div>
                            <h1 className="text-sm font-black text-white uppercase tracking-tight italic">Visualizing Decision</h1>
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold font-mono">Interact with the code to morph the 3D logic flow in real-time.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Synchronized</span>
                        </div>
                        <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-full text-[10px] font-black uppercase text-white shadow-xl shadow-indigo-600/20 active:scale-95 transition-all tracking-widest">
                            Deploy Engine
                        </button>
                    </div>
                </header>

                {/* 3. MAIN WORKSPACE AREA: Visualizing Decision */}
                <main className="h-[calc(100vh-64px)] w-full overflow-hidden p-6 lg:p-8">
                    <div className="h-full w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-6">

                        {/* COMPILER PANEL (50%) */}
                        <div className="h-full w-full lg:w-1/2 flex flex-col rounded-[2.5rem] border border-white/10 bg-[#070708] overflow-hidden shadow-2xl shadow-black/80">
                            {/* Monaco Editor (60%) */}
                            <div className="h-[60%] w-full overflow-hidden border-b border-white/5 relative">
                                <CodeEditor
                                    code={code}
                                    setCode={setCode}
                                    onStateChange={setVisualState}
                                />
                            </div>

                            {/* Output Console (40%) */}
                            <div className="h-[40%] w-full bg-black/40 flex flex-col overflow-hidden">
                                <div className="h-10 flex items-center px-6 border-b border-white/5 bg-slate-950/30">
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <Terminal size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Neural Stream Output</span>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 font-mono overflow-y-auto custom-scrollbar">
                                    <AnimatePresence mode="popLayout">
                                        <motion.div
                                            key={visualState}
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-slate-600 font-bold mt-0.5">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                                <p className="text-xs text-blue-400 leading-relaxed font-semibold tracking-wide">
                                                    <span className="opacity-40">{'>'}</span> System Status: <span className="text-emerald-400 uppercase">Synchronized</span>
                                                </p>
                                            </div>

                                            {visualState === 'idle' && (
                                                <div className="flex items-start gap-3 animate-in fade-in duration-500">
                                                    <span className="text-slate-600 font-bold mt-0.5">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                                    <p className="text-xs text-slate-400 italic">
                                                        <span className="opacity-40">{'>'}</span> Runtime standby. Detecting logical structures...
                                                    </p>
                                                </div>
                                            )}

                                            {visualState === 'if' && (
                                                <div className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2">
                                                    <span className="text-slate-600 font-bold mt-0.5">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                                    <p className="text-xs text-indigo-400 font-black">
                                                        <span className="opacity-40">{'>'}</span> branch_detected: <span className="text-white">if_logic</span> active. Rendering decision node.
                                                    </p>
                                                </div>
                                            )}

                                            {visualState === 'else' && (
                                                <div className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2">
                                                    <span className="text-slate-600 font-bold mt-0.5">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                                    <p className="text-xs text-red-400 font-black">
                                                        <span className="opacity-40">{'>'}</span> fallback_detect: <span className="text-white">else_node</span> active. Rerouting logic flow.
                                                    </p>
                                                </div>
                                            )}

                                            {visualState === 'loop' && (
                                                <div className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2">
                                                    <span className="text-slate-600 font-bold mt-0.5">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                                    <p className="text-xs text-emerald-400 font-black">
                                                        <span className="opacity-40">{'>'}</span> iterative_sync: <span className="text-white">recursive_cycle</span> active. Accelerating visual nodes.
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* VISUAL PANEL (50%) */}
                        <div className="h-full w-full lg:w-1/2 relative bg-[#070708] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl shadow-black/80">
                            {/* HUD Overlays */}
                            <div className="absolute inset-0 pointer-events-none z-10 p-8 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                                            Logic Visualizer
                                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded">v4.2</span>
                                        </h2>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] italic font-bold">Neural state projection Active</p>
                                    </div>
                                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">12ms Latency</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex gap-4">
                                        <StatBox label="Complexity" value="O(log n)" color="text-indigo-400" />
                                        <StatBox label="Core Mode" value={visualState.toUpperCase()} color={visualState === 'idle' ? 'text-slate-500' : 'text-emerald-400'} />
                                    </div>
                                    <div className="w-24 h-24 opacity-10 grayscale invert pointer-events-none">
                                        <BrainCircuit size={96} />
                                    </div>
                                </div>
                            </div>

                            {/* Three.js Canvas */}
                            <LogicVisualizer3D state={visualState} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
    <div className={cn(
        "flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer group",
        active ? "bg-indigo-600/10 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
    )}>
        <div className={cn("transition-colors", active ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-400")}>
            {icon}
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />}
    </div>
);

const StatBox = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="bg-black/40 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/5 min-w-[110px]">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-xs font-black tracking-tight ${color}`}>{value}</p>
    </div>
);

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default PracticeLayout;
