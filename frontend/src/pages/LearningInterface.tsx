/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactPlayer from 'react-player';
import {
    Play,
    ChevronLeft,
    Loader2,
    Terminal,
    Layout,
    Menu,
    Award,
    Zap,
    ChevronRight,
    Info,
    CheckCircle2,
    FlaskConical,
    RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { TextLessonViewer } from '../components/TextLessonViewer';
import CodePlayground from './LogicDemo/components/CodePlayground';
import CodeEditor from './LogicPractice/CodeEditor';
import LogicVisualizer3D from './LogicPractice/LogicVisualizer3D';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../components/ui/resizable';

// Fix for generic ReactPlayer type issues
const PlayerComponent = ReactPlayer as any;

const LearningInterface: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Course ID
    const navigate = useNavigate();
    useAuth();

    // Data State
    const [course, setCourse] = useState<any>(null);
    const [progress, setProgress] = useState<any>(null);
    const [currentModule, setCurrentModule] = useState<any>(null);
    const [currentLesson, setCurrentLesson] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Coding State
    const [code, setCode] = useState<string>('');
    const [isRunning, setIsRunning] = useState(false);
    const [codingResult, setCodingResult] = useState<any>(null);
    const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
    const [videoProgress, setVideoProgress] = useState(0);
    const playerRef = useRef<any>(null);

    // Sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);
    const [visualizerState, setVisualizerState] = useState<'idle' | 'if' | 'else' | 'loop'>('idle');
    const [visualizerCode, setVisualizerCode] = useState<string>(`// Visualizing Decision Logic
if (status === 'success') {
    for (let i = 0; i < 5; i++) {
        process(i);
    }
} else {
    retry();
}`);

    // Reset state on lesson change
    useEffect(() => {
        if (currentLesson) {
            if (currentLesson.type === 'coding') {
                setCode(currentLesson.codingChallenge?.starterCode || '');
                setCodingResult(null);
            }
            if (currentLesson.type === 'quiz') {
                setQuizAnswers({});
            }
            setVideoProgress(0);
        }
    }, [currentLesson]);

    useEffect(() => {
        const init = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const courseRes = await api.getCourse(id);
                const courseData = courseRes.course || courseRes;
                setCourse(courseData);

                try {
                    const progressRes = await api.getCourseProgress(id);
                    if (progressRes.success) {
                        setProgress(progressRes.data);
                        const savedLessonId = progressRes.data.currentLesson;
                        const savedModuleId = progressRes.data.currentModule;

                        if (savedLessonId && savedModuleId) {
                            const module = courseData.weeks?.flatMap((w: any) => w.modules).find((m: any) => m._id === savedModuleId);
                            const lesson = module?.lessons?.find((l: any) => l._id === savedLessonId);
                            if (lesson && module) {
                                setCurrentModule(module);
                                setCurrentLesson(lesson);
                            } else {
                                loadFirstLesson(courseData);
                            }
                        } else {
                            loadFirstLesson(courseData);
                        }
                    }
                } catch (err) {
                    loadFirstLesson(courseData);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load content');
            } finally {
                setIsLoading(false);
            }
        };

        const loadFirstLesson = (c: any) => {
            if (c.weeks?.[0]?.modules?.[0]?.lessons?.[0]) {
                setCurrentModule(c.weeks[0].modules[0]);
                setCurrentLesson(c.weeks[0].modules[0].lessons[0]);
            }
        };

        init();
    }, [id]);

    const handleLessonComplete = async () => {
        if (!currentLesson || !currentModule || !id) return;
        setIsCompleting(true);
        try {
            const res = await api.completeLesson(id, currentLesson._id, currentModule._id);
            if (res.success) {
                const progressRes = await api.getCourseProgress(id);
                if (progressRes.success) setProgress(progressRes.data);

                if (res.certificateIssued || res.unlockResult?.certificateIssued) {
                    toast.success('Course Completed!');
                    setTimeout(() => {
                        navigate(`/certificate/${id}`);
                    }, 1500);
                } else {
                    toast.success('Mission Accomplished!');
                    handleNextLesson();
                }
            }
        } catch (err: any) {
            toast.error('Sync failed');
        } finally {
            setIsCompleting(false);
        }
    };

    const getNextLesson = () => {
        if (!course || !currentLesson) return { nextL: null, nextM: null };
        let found = false;
        let nextL = null, nextM = null;

        for (const week of (course.weeks || [])) {
            for (const mod of (week.modules || [])) {
                for (const less of (mod.lessons || [])) {
                    if (found) { nextL = less; nextM = mod; break; }
                    if (less._id.toString() === currentLesson._id.toString()) found = true;
                }
                if (nextL) break;
            }
            if (nextL) break;
        }
        return { nextL, nextM };
    };

    const handleNextLesson = () => {
        const { nextL, nextM } = getNextLesson();
        if (nextL && nextM) {
            setCurrentLesson(nextL);
            setCurrentModule(nextM);
            setVideoProgress(0);
        } else {
            if (progress?.certificateIssued) {
                navigate(`/certificate/${id}`);
            } else {
                toast.info('Course curriculum completed!');
            }
        }
    };

    const isModuleAvailable = (moduleId: string) => {
        if (!progress) return false;
        return progress.unlockedModules?.some((u: any) => u.moduleId.toString() === moduleId.toString()) || false;
    };

    const isLessonDone = (lessonId: string) => {
        return progress?.completedLessons?.some((l: any) => l.lessonId.toString() === lessonId.toString());
    };

    const handleCodeSubmit = async () => {
        if (!currentLesson?.codingChallenge) return;
        setIsRunning(true);
        try {
            const res = await api.submitCodingAssignment(currentLesson._id, {
                code,
                language: currentLesson.codingChallenge.language,
                courseId: id!,
                moduleId: currentModule._id
            });
            setCodingResult(res);
            if (res.passed) {
                toast.success('All Test Cases Passed!');
                handleLessonComplete();
            } else {
                toast.error('Some test cases failed. Try again.');
            }
        } catch (err) {
            toast.error('Runtime Error: Check your logic');
        } finally {
            setIsRunning(false);
        }
    };

    const handleQuizSubmit = async () => {
        try {
            const res = await api.completeLesson(id!, currentLesson._id, currentModule._id);
            if (res.success) {
                toast.success('Quiz Submitted Successfully!');
                handleNextLesson();
            }
        } catch (err) {
            toast.error('Evaluation failed');
        }
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>;
    if (error) return <div className="h-screen flex items-center justify-center p-8 text-red-500 font-mono tracking-tighter">ERR: {error}</div>;

    return (
        <div className="h-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden font-sans">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur-xl z-40 shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full hidden lg:flex">
                        <Layout className="w-5 h-5 text-indigo-400" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-full lg:hidden">
                        <Menu className="w-5 h-5" />
                    </Button>
                    <div className="border-l border-white/10 pl-4">
                        <h1 className="text-sm font-black truncate max-w-[200px] text-white tracking-tight italic uppercase">{course?.title}</h1>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest truncate font-bold">{currentLesson?.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress?.overallProgress || 0}%` }}
                                className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                            />
                        </div>
                        <span className="text-[10px] font-black text-indigo-400 tabular-nums">{progress?.overallProgress || 0}%</span>
                    </div>
                    <Button
                        onClick={() => {
                            if (!getNextLesson().nextL && isLessonDone(currentLesson?._id)) {
                                navigate(`/certificate/${id}`);
                            } else {
                                handleLessonComplete();
                            }
                        }}
                        disabled={isCompleting || (currentLesson?.type === 'video' && videoProgress < 0.8)}
                        className={cn(
                            "rounded-full px-6 h-10 text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-2",
                            isLessonDone(currentLesson?._id)
                                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20"
                                : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20"
                        )}
                    >
                        {isCompleting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            isLessonDone(currentLesson?._id)
                                ? (getNextLesson().nextL ? 'Next Lesson' : 'Claim Certificate')
                                : 'Complete Mission'
                        )}
                        <ChevronRight size={14} />
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Sidebar */}
                <aside className={cn(
                    "absolute lg:static inset-y-0 left-0 z-50 w-80 bg-slate-900 border-r border-white/5 flex flex-col transition-all duration-300",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:w-0 lg:border-none"
                )}>
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Curriculum</span>
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400"><ChevronLeft size={16} /></Button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
                        {course?.weeks?.map((week: any) => (
                            <div key={week._id} className="space-y-1">
                                <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-3 py-2">{week.title}</div>
                                {week.modules?.map((module: any) => (
                                    <div key={module._id} className={cn(
                                        "rounded-2xl border transition-all duration-300",
                                        isModuleAvailable(module._id) ? "bg-white/5 border-white/5" : "opacity-30 border-transparent grayscale select-none"
                                    )}>
                                        {module.lessons?.map((lesson: any) => (
                                            <button
                                                key={lesson._id}
                                                disabled={!isModuleAvailable(module._id)}
                                                onClick={() => setCurrentLesson(lesson)}
                                                className={cn(
                                                    "w-full text-left px-4 py-3 text-[11px] flex items-center justify-between rounded-xl transition-all group",
                                                    currentLesson?._id === lesson._id
                                                        ? "bg-indigo-500/10 text-white font-black"
                                                        : "text-slate-400 hover:text-slate-200"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {isLessonDone(lesson._id) ? <CheckCircle2 size={12} className="text-emerald-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" />}
                                                    <span className="truncate max-w-[150px]">{lesson.title}</span>
                                                </div>
                                                <span className="text-[8px] font-black uppercase opacity-20 group-hover:opacity-100 transition-opacity tracking-tighter">{lesson.type}</span>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 flex flex-col bg-[#020203] overflow-hidden relative">
                    {currentLesson?.type === 'coding' ? (
                        <ResizablePanelGroup direction="horizontal" className="flex-1">
                            {/* Problem Panel */}
                            <ResizablePanel defaultSize={40} minSize={30} className="flex flex-col border-r border-white/5">
                                <div className="h-12 bg-slate-900/50 border-b border-white/5 flex items-center px-6 gap-2 shrink-0">
                                    <Info size={14} className="text-indigo-400" />
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Logic Specs</span>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                                    <div className="space-y-6">
                                        <Badge className="bg-indigo-600/10 text-indigo-400 border-indigo-500/20 uppercase tracking-[0.3em] text-[10px] font-black px-4 py-1.5 rounded-full">
                                            Architecture Challenge
                                        </Badge>
                                        <h2 className="text-4xl font-black tracking-tighter text-white leading-tight">
                                            {currentLesson?.title}
                                        </h2>
                                        <div className="text-slate-400 leading-relaxed text-lg font-medium border-l-2 border-white/5 pl-6 italic">
                                            {currentLesson.codingChallenge?.problemStatement || currentLesson.content}
                                        </div>
                                    </div>

                                    {currentLesson.codingChallenge?.testCases && (
                                        <div className="space-y-6 pt-10 border-t border-white/5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FlaskConical size={14} className="text-indigo-400" />
                                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Validated States</h4>
                                                </div>
                                                <Badge variant="outline" className="text-[10px] px-3 py-1 uppercase font-black border-white/10 text-slate-400 bg-white/5">
                                                    {currentLesson.codingChallenge.testCases.filter((t: any) => !t.isHidden).length} Cases
                                                </Badge>
                                            </div>
                                            <div className="grid gap-3">
                                                {currentLesson.codingChallenge.testCases.map((tc: any, i: number) => (
                                                    !tc.isHidden && (
                                                        <div key={i} className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 flex items-center justify-between group">
                                                            <div className="space-y-1">
                                                                <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest uppercase">Input</div>
                                                                <code className="text-[11px] font-bold text-slate-300 bg-black/40 px-2 py-0.5 rounded border border-white/5 group-hover:border-indigo-500/30 transition-colors italic lowercase">{tc.input || 'void'}</code>
                                                            </div>
                                                            <div className="text-right space-y-1">
                                                                <div className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Goal</div>
                                                                <code className="text-[11px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase italic">{tc.output}</code>
                                                            </div>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ResizablePanel>

                            <ResizableHandle className="w-[2px] bg-white/5 hover:bg-indigo-500/50 transition-colors cursor-col-resize" />

                            {/* Editor Panel */}
                            <ResizablePanel defaultSize={60} minSize={40} className="flex flex-col bg-[#0d0d0e]">
                                <div className="h-12 bg-slate-950 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <Terminal size={14} className="text-indigo-400" />
                                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                            {currentLesson.codingChallenge?.language} Runtime
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                                            <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest italic">Neural Sync Active</span>
                                        </div>
                                        <Button
                                            className="bg-indigo-600 hover:bg-indigo-500 text-[10px] font-black uppercase h-8 px-6 rounded-full shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                                            onClick={handleCodeSubmit}
                                            disabled={isRunning}
                                        >
                                            {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="white" />}
                                            Run Engine
                                        </Button>
                                    </div>
                                </div>
                                <ResizablePanelGroup direction="vertical" className="flex-1">
                                    <ResizablePanel defaultSize={75} minSize={30} className="flex flex-col relative">
                                        <Editor
                                            height="100%"
                                            language={currentLesson.codingChallenge?.language || 'javascript'}
                                            theme="vs-dark"
                                            value={code}
                                            onChange={(v) => setCode(v || '')}
                                            options={{
                                                fontSize: 14,
                                                minimap: { enabled: false },
                                                padding: { top: 20 },
                                                fontFamily: "'Fira Code', monospace",
                                                fontLigatures: true,
                                                lineHeight: 1.6,
                                                smoothScrolling: true,
                                                cursorBlinking: "expand",
                                                scrollBeyondLastLine: false,
                                                renderLineHighlight: "all"
                                            }}
                                        />
                                    </ResizablePanel>
                                    <ResizableHandle className="h-[2px] bg-white/5 hover:bg-indigo-500/50 transition-colors cursor-row-resize" />
                                    <ResizablePanel defaultSize={25} minSize={10} className="flex flex-col bg-[#050506]">
                                        <div className="px-6 py-2 border-b border-white/5 flex items-center justify-between bg-black/40">
                                            <div className="flex items-center gap-2 font-mono text-[9px] font-black uppercase text-slate-500 tracking-widest">
                                                <Terminal size={10} /> Output Stream
                                            </div>
                                            {codingResult && <button onClick={() => setCodingResult(null)} className="text-[9px] text-slate-600 uppercase font-black hover:text-white transition-colors tracking-widest items-center flex gap-1"><RotateCcw size={10} /> Clear</button>}
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 font-mono relative">
                                            {codingResult ? (
                                                <div className="space-y-6">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm",
                                                        codingResult.passed ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                                                    )}>
                                                        {codingResult.passed ? <CheckCircle2 size={10} /> : <FlaskConical size={10} />}
                                                        {codingResult.passed ? '✓ SUCCESS' : '✗ FAILED'} • {codingResult.score}% Rank
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {codingResult.results?.map((r: any, i: number) => (
                                                            <div key={i} className={cn("p-4 rounded-2xl border flex items-center justify-between transition-all duration-300", r.passed ? "border-emerald-500/10 bg-emerald-500/[0.02]" : "border-red-500/10 bg-red-500/[0.02]")}>
                                                                <div className="flex items-center gap-4">
                                                                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black", r.passed ? "bg-emerald-500 text-black shadow-[0_0_10px_#10b98150]" : "bg-red-500 text-white shadow-[0_0_10px_#ef444450]")}>
                                                                        {i + 1}
                                                                    </div>
                                                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Assertion</div>
                                                                </div>
                                                                {!r.passed && <div className="text-red-300 text-[11px] italic font-bold">ERR: exp({r.expected}) {'≠'} got({r.actual})</div>}
                                                                {r.passed && <div className="text-emerald-400 text-[11px] font-bold">STABLE</div>}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {codingResult.passed && (progress?.overallProgress === 100 || codingResult.unlockResult?.certificateIssued) && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="p-8 bg-indigo-600 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group"
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 -z-10" />
                                                            <div className="relative z-10 space-y-6">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center">
                                                                        <Award size={28} className="text-white" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Professional Rank</p>
                                                                        <h4 className="text-xl font-black tracking-tight leading-none">Certificate Authorized</h4>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    onClick={() => navigate(`/certificate/${id}`)}
                                                                    className="w-full bg-white text-indigo-600 hover:bg-slate-50 font-black rounded-2xl h-14 uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
                                                                >
                                                                    Claim Professional Badge
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center gap-4 opacity-20">
                                                    <Terminal size={32} />
                                                    <span className="text-[10px] uppercase font-black tracking-[0.4em]">system node idle</span>
                                                </div>
                                            )}
                                        </div>
                                    </ResizablePanel>
                                </ResizablePanelGroup>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    ) : (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 relative z-10">
                            <div className="max-w-5xl mx-auto space-y-12 pb-24">
                                {currentLesson?.type === 'video' && (
                                    <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
                                        <PlayerComponent
                                            ref={playerRef}
                                            url={currentLesson.videoUrl}
                                            width="100%"
                                            height="100%"
                                            controls
                                            onProgress={(s: any) => setVideoProgress(s.played)}
                                        />
                                    </div>
                                )}

                                {currentLesson?.type === 'reading' && (
                                    <TextLessonViewer
                                        content={currentLesson.content || ''}
                                        lessonId={currentLesson._id}
                                        courseId={id!}
                                        onComplete={() => !isLessonDone(currentLesson._id) && handleLessonComplete()}
                                    />
                                )}

                                {currentLesson?.type !== 'reading' &&
                                    currentLesson?.type !== 'coding' &&
                                    currentLesson?.type !== 'visualizer' &&
                                    currentLesson?.type !== 'playground' && (
                                        <div className="space-y-6">
                                            <Badge className="bg-indigo-600/10 text-indigo-400 border-indigo-500/20 uppercase tracking-[0.3em] text-[10px] font-black px-4 py-1.5 rounded-full backdrop-blur-sm">
                                                {currentLesson?.type} module
                                            </Badge>
                                            <h2 className="text-5xl font-black tracking-tighter text-white leading-tight">{currentLesson?.title}</h2>
                                            <div className="text-slate-400 leading-relaxed whitespace-pre-wrap text-lg font-medium max-w-3xl border-l-2 border-white/5 pl-8 italic">{currentLesson?.content}</div>
                                        </div>
                                    )}

                                {currentLesson?.type === 'quiz' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                                        {currentLesson.quizQuestions?.map((q: any, idx: number) => (
                                            <div key={idx} className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 space-y-6 hover:bg-white/[0.05] transition-all duration-500 group">
                                                <p className="font-bold text-xl text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                                                    <span className="text-slate-600 mr-4 font-black">0{idx + 1}.</span> {q.question}
                                                </p>
                                                <div className="grid gap-3">
                                                    {q.options.map((opt: string, optIdx: number) => (
                                                        <button
                                                            key={optIdx}
                                                            onClick={() => setQuizAnswers({ ...quizAnswers, [idx]: optIdx })}
                                                            className={cn(
                                                                "text-left p-5 rounded-2xl border text-sm font-semibold transition-all duration-300",
                                                                quizAnswers[idx] === optIdx
                                                                    ? "border-indigo-600 bg-indigo-600/10 text-white shadow-[0_0_30px_rgba(79,70,229,0.1)] scale-[1.02]"
                                                                    : "bg-black/20 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
                                                            )}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <Button onClick={handleQuizSubmit} className="w-full h-16 bg-white text-black hover:bg-slate-200 font-black rounded-2xl transition-all shadow-xl active:scale-[0.98] text-lg uppercase tracking-widest">Submit Evaluation</Button>
                                    </div>
                                )}

                                {currentLesson?.type === 'visualizer' && (
                                    <ResizablePanelGroup direction="horizontal" className="absolute inset-0">
                                        {/* Editor Panel */}
                                        <ResizablePanel defaultSize={50} minSize={30} className="flex flex-col border-r border-white/5 bg-[#0d0d0e]">
                                            <div className="h-12 bg-slate-950 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
                                                <div className="flex items-center gap-2">
                                                    <Zap size={14} className="text-blue-400" />
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">
                                                        Visualizing Decision
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Live Sync Alpha</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 overflow-hidden relative">
                                                <CodeEditor
                                                    code={visualizerCode}
                                                    setCode={setVisualizerCode}
                                                    onStateChange={setVisualizerState}
                                                />
                                            </div>
                                            <div className="h-10 bg-slate-900/50 flex items-center px-6 border-t border-white/5">
                                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic leading-none">Interact with code to morph 3D flow</p>
                                            </div>
                                        </ResizablePanel>

                                        <ResizableHandle className="w-[2px] bg-white/5 hover:bg-blue-500/50 transition-colors" />

                                        {/* Visualizer Panel */}
                                        <ResizablePanel defaultSize={50} minSize={30} className="flex flex-col bg-[#050506]">
                                            <div className="flex-1 relative overflow-hidden">
                                                <LogicVisualizer3D state={visualizerState} />

                                                {/* HUD Overlays */}
                                                <div className="absolute top-6 left-6 pointer-events-none space-y-1">
                                                    <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Logic State</h2>
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn(
                                                            "w-2 h-2 rounded-full",
                                                            visualizerState === 'idle' ? "bg-slate-500" :
                                                                visualizerState === 'loop' ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" :
                                                                    "bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                                                        )} />
                                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{visualizerState}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dedicated Neural Stream */}
                                            <div className="h-32 bg-black/60 border-t border-white/5 p-4 font-mono shrink-0 overflow-hidden relative">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Neural Stream</span>
                                                    <div className="flex gap-1">
                                                        <div className="w-1 h-1 rounded-full bg-white/20" />
                                                        <div className="w-1 h-1 rounded-full bg-white/10" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-[10px] text-blue-300 leading-tight">
                                                        <span className="opacity-40">{'>'}</span> System initializing...
                                                    </div>
                                                    {visualizerState === 'idle' && <div className="text-[10px] text-slate-500 italic lowercase tracking-tight"><span className="opacity-40">{'>'}</span> engine orbiting in standby mode...</div>}
                                                    {visualizerState === 'if' && <div className="text-[10px] text-blue-400 font-bold tracking-tight animate-in fade-in"><span className="opacity-40">{'>'}</span> decision node active: validating primary branch...</div>}
                                                    {visualizerState === 'else' && <div className="text-[10px] text-red-500 font-bold tracking-tight animate-in fade-in"><span className="opacity-40">{'>'}</span> fallback sequence initiated...</div>}
                                                    {visualizerState === 'loop' && <div className="text-[10px] text-emerald-400 font-bold tracking-tight animate-in fade-in"><span className="opacity-40">{'>'}</span> recursive cycle detected: optimizing flow...</div>}
                                                </div>
                                                <div className="absolute bottom-4 right-4 text-[8px] font-black text-white/5 uppercase tracking-[0.5em]">RT_SYNC_ACTIVE</div>
                                            </div>
                                        </ResizablePanel>
                                    </ResizablePanelGroup>
                                )}

                                {currentLesson?.type === 'playground' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-[600px]">
                                        <CodePlayground />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default LearningInterface;
