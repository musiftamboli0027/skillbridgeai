import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    Send,
    Bot,
    User,
    Code,
    Sparkles,
    Mic,
    Settings,
    MessageSquare,
    Copy,
    Check,
    RotateCcw
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    type?: 'text' | 'code';
}

export default function AITutor() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello Alex! I'm your AI Study Companion. How can I help you today? Whether it's debugging React patterns, explaining system design concepts, or reviewing your prototype, I'm here 24/7.",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [code, setCode] = useState(`// Welcome to AI Workspace
// Write or paste your code here to debug with the tutor

function calculateProgress(xp, total) {
  return (xp / total) * 100;
}
`);
    const [isTyping, setIsTyping] = useState(false);
    const [copied, setCopied] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "That's a great question! Based on your current progress in 'Advanced React Patterns', the Context API refactor should prioritize performance by memoizing providers. Would you like me to generate a template for you?",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-140px)] flex gap-6 overflow-hidden">

                {/* Main Chat Workspace */}
                <div className="flex-1 flex flex-col gap-6 lg:flex-row">

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">AI Professor</h2>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 font-black uppercase text-[10px] tracking-wider px-3 py-1">Advanced Model</Badge>
                                <Button variant="ghost" size="icon" className="rounded-xl text-slate-400">
                                    <Settings className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/50 dark:bg-slate-950/20"
                        >
                            {messages.map((msg) => (
                                <div key={msg.id} className={cn(
                                    "flex gap-4 max-w-[85%]",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}>
                                    <div className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border-2",
                                        msg.role === 'user' ? "bg-white dark:bg-slate-900 border-indigo-100 text-indigo-600" : "bg-indigo-600 border-white text-white"
                                    )}>
                                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                    </div>
                                    <div className={cn(
                                        "p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed",
                                        msg.role === 'user'
                                            ? "bg-slate-900 text-white rounded-tr-none"
                                            : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-4">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                            <div className="relative group">
                                <Input
                                    placeholder="Explain the Observer Pattern..."
                                    value={input}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
                                    className="w-full h-14 pl-12 pr-28 bg-slate-100 dark:bg-slate-800/50 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-600/10 rounded-2xl font-bold transition-all"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500">
                                        <Mic className="w-4 h-4" />
                                    </Button>
                                    <Button onClick={handleSend} className="h-9 px-4 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl gap-2 shadow-lg shadow-indigo-200 dark:shadow-none">
                                        <span>Send</span>
                                        <Send className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Suggestions:</p>
                                {['Debug my code', 'Mock Interview', 'Simplify Concept', 'Career Advice'].map((tag) => (
                                    <button key={tag} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-indigo-600 hover:text-indigo-600 transition-all shrink-0">
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Editor Area (Desktop Only) */}
                    <div className="flex-1 bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden flex flex-col shadow-2xl hidden lg:flex min-w-[45%]">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5 px-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                </div>
                                <div className="h-6 w-[1px] bg-white/10 mx-1" />
                                <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                                    <Code className="w-3.5 h-3.5" />
                                    <span>workspace.js</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={copyToClipboard}
                                    variant="ghost"
                                    className="h-8 px-3 text-white/60 hover:text-white hover:bg-white/10 rounded-lg text-xs font-black gap-2"
                                >
                                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </Button>
                                <Button variant="ghost" className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 rounded-lg">
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1">
                            <Editor
                                height="100%"
                                defaultLanguage="javascript"
                                theme="vs-dark"
                                value={code}
                                onChange={(value) => setCode(value || '')}
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    smoothScrolling: true,
                                    cursorBlinking: "expand",
                                    fontFamily: "JetBrains Mono, Menlo, monospace",
                                    padding: { top: 20, bottom: 20 },
                                }}
                            />
                        </div>
                        <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black text-[9px]">LINT PASSING</Badge>
                                <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest">UTF-8 | Javascript</span>
                            </div>
                            <Button className="h-8 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-xs gap-2 px-4">
                                <Sparkles className="w-3 h-3" />
                                Analyze Code
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
