/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    X,
    Lightbulb,
    Code2,
    Bug,
    BookOpen,
    Send,
    Sparkles,
    RefreshCw,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../lib/utils';
import { api } from '../services/api';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    type?: 'text' | 'feedback';
    feedback?: {
        errorType: string;
        lineNumber: number;
        explanation: string;
        hint: string;
        improvementTip: string;
    };
    timestamp: Date;
}

interface AITutorChatProps {
    code: string;
    language: string;
    lessonTitle: string;
    problemStatement: string;
    courseTitle?: string;
    moduleTitle?: string;
    weekTitle?: string;
    isOpen: boolean;
    onClose: () => void;
}

// ─────────────────────────────────────────────
// Quick-action buttons config
// ─────────────────────────────────────────────
const QUICK_ACTIONS = [
    { id: 'explain', label: 'Explain Concept', icon: BookOpen, prompt: 'Can you explain the main concept of this lesson in simple terms?' },
    { id: 'hint', label: 'Give Me a Hint', icon: Lightbulb, prompt: 'I\'m stuck. Can you give me a small hint to point me in the right direction, without spoiling the full answer?' },
    { id: 'review', label: 'Review My Code', icon: Code2, prompt: 'Can you review my code for best practices and potential improvements?' },
    { id: 'debug', label: 'Debug', icon: Bug, prompt: '__DEBUG__' },
];

// ─────────────────────────────────────────────
// Feedback Card (structured AI debug response)
// ─────────────────────────────────────────────
const FeedbackCard: React.FC<{ feedback: Message['feedback'] }> = ({ feedback }) => {
    if (!feedback) return null;
    return (
        <div className="space-y-4 mt-2">
            <div className="flex items-center gap-3">
                <span className={cn(
                    "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border shadow-sm",
                    feedback.errorType === 'Syntax' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        feedback.errorType === 'Logic' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                )}>
                    {feedback.errorType}
                </span>
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Line {feedback.lineNumber}</span>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed font-medium">{feedback.explanation}</p>
            
            <div className="grid gap-3">
                <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-2xl p-3.5 group hover:border-indigo-500/40 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                            <Lightbulb className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Hint</p>
                    </div>
                    <p className="text-sm text-indigo-100/90 font-medium leading-relaxed">{feedback.hint}</p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-3.5 group hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Pro Tip</p>
                    </div>
                    <p className="text-sm text-emerald-100/90 font-medium leading-relaxed">{feedback.improvementTip}</p>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Chat Bubble
// ─────────────────────────────────────────────
const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.role === 'user';
    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 400 }}
            className={cn("flex gap-3.5", isUser ? "flex-row-reverse" : "flex-row")}
        >
            {/* Avatar */}
            {!isUser && (
                <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Bot className="w-4.5 h-4.5 text-white" />
                    </div>
                </div>
            )}

            {/* Bubble */}
            <div className={cn(
                "max-w-[85%] relative flex flex-col",
                isUser ? "items-end" : "items-start"
            )}>
                <div className={cn(
                    "rounded-2xl px-4 py-3 text-sm transition-all",
                    isUser
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20 border border-indigo-500/50"
                        : "bg-[#1A1D29]/80 backdrop-blur-md text-slate-200 rounded-tl-none border border-white/5 shadow-xl shadow-black/20"
                )}>
                    {message.type === 'feedback' && message.feedback ? (
                        <FeedbackCard feedback={message.feedback} />
                    ) : (
                        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/5 prose-code:text-indigo-400">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
                <span className={cn(
                    "text-[10px] mt-1.5 font-bold tracking-tight opacity-40",
                    isUser ? "text-indigo-200 mr-1" : "text-slate-500 ml-1"
                )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────
// Main AITutorChat Component
// ─────────────────────────────────────────────
export const AITutorChat: React.FC<AITutorChatProps> = ({
    code,
    language,
    lessonTitle,
    problemStatement,
    courseTitle,
    moduleTitle,
    weekTitle,
    isOpen,
    onClose,
}) => {
    const defaultWelcome = () => ({
        id: 'welcome',
        role: 'assistant',
        type: 'text',
        content: `Hey there! 👋 I'm your **SkillBridge AI Tutor**, empowered by Lyzr. AI.\n\nI know everything covered in the **${lessonTitle}** lesson and beyond! Ask me anything—I'm here to guide your journey, not just provide answers. 🚀`,
        timestamp: new Date(),
    } as Message);

    const [messages, setMessages] = useState<Message[]>([defaultWelcome()]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const addMessage = (msg: Omit<Message, 'id' | 'timestamp'>) => {
        setMessages(prev => [...prev, {
            ...msg,
            id: Math.random().toString(36).slice(2),
            timestamp: new Date()
        }]);
    };

    const handleNewChat = () => {
        setMessages([defaultWelcome()]);
    };

    const handleDebug = async () => {
        if (!code) {
            addMessage({ role: 'assistant', type: 'text', content: "I don't see any code in the editor yet. Write some code and then ask me to debug it!" });
            return;
        }
        setIsLoading(true);
        try {
            const res = await api.getAIDebugFeedback({ code, language, problemStatement, lessonTitle });
            if (res.success && res.aiAvailable) {
                addMessage({ role: 'assistant', type: 'feedback', content: '', feedback: res.data });
            } else {
                addMessage({ role: 'assistant', type: 'text', content: res.message || "I'm temporarily busy. Try again in a moment!" });
            }
        } catch (err: any) {
            addMessage({ role: 'assistant', type: 'text', content: "I hit a snag connecting to my neural network. Give me a moment and try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = async (action: typeof QUICK_ACTIONS[0]) => {
        if (action.id === 'debug') {
            addMessage({ role: 'user', type: 'text', content: '🐛 Debug my code' });
            await handleDebug();
            return;
        }
        const userPrompt = action.prompt;
        addMessage({ role: 'user', type: 'text', content: userPrompt });
        await sendToAI(userPrompt);
    };

    const sendToAI = async (userMessage: string) => {
        setIsLoading(true);
        try {
            const chatHistory = messages
                .filter(m => m.id !== 'welcome')
                .map(m => ({
                    role: m.role, 
                    content: m.type === 'feedback' && m.feedback
                        ? `${m.feedback.explanation} | Hint: ${m.feedback.hint}`
                        : m.content
                }));

            // Using Lyzr Integration
            const res = await api.getAITutorChatLyzr({
                message: userMessage,
                conversationHistory: chatHistory,
                lessonTitle,
                moduleTitle,
                weekTitle,
                courseTitle,
                code: code || undefined,
            });

            if (res.success && res.reply) {
                addMessage({ role: 'assistant', type: 'text', content: res.reply });
            } else {
                addMessage({ role: 'assistant', type: 'text', content: res.message || "I'm a bit busy right now. Try in a moment!" });
            }
        } catch (err: any) {
            addMessage({ role: 'assistant', type: 'text', content: "Connection issue. Please retry in a moment." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        const msg = inputValue.trim();
        if (!msg || isLoading) return;
        setInputValue('');
        addMessage({ role: 'user', type: 'text', content: msg });
        await sendToAI(msg);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 50, y: 50, scale: 0.9, rotateX: 5 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, x: 50, y: 50, scale: 0.9, rotateX: 5 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                    className="fixed bottom-6 right-6 z-[100] w-[420px] max-w-[calc(100vw-48px)] flex flex-col perspective-1000"
                    style={{ height: '620px', maxHeight: 'calc(100vh - 48px)' }}
                >
                    {/* ── Chat Card ── */}
                    <div className="flex flex-col h-full bg-[#0F111A]/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.8)] overflow-hidden">

                        {/* Animated Header Background */}
                        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent pointer-events-none" />

                        {/* Header */}
                        <div className="relative flex items-center justify-between px-6 py-5 bg-white/[0.02] border-b border-white/5 flex-shrink-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                                    <div className="relative w-11 h-11 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-lg">
                                        <Bot className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-[#0F111A] shadow-lg shadow-emerald-500/20" />
                                </div>
                                <div>
                                    <p className="text-base font-black text-white tracking-tight">SkillBridge <span className="text-indigo-400 uppercase text-[10px] ml-1 tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">AI</span></p>
                                    <p className="text-[11px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider">Assistant Tutor</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleNewChat}
                                    className="w-9 h-9 rounded-xl glass-effect flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                                    title="New Chat"
                                >
                                    <RefreshCw className="w-4.5 h-4.5" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-9 h-9 rounded-xl glass-effect flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                                >
                                    <X className="w-4.5 h-4.5" />
                                </button>
                            </div>
                        </div>

                        {/* Context Tracker */}
                        {(courseTitle || moduleTitle) && (
                            <div className="relative flex items-center gap-3 px-6 py-2.5 bg-indigo-500/[0.03] border-b border-white/5 flex-shrink-0 z-10">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 animate-pulse" />
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Studying:</span>
                                    <div className="flex items-center gap-1.5 overflow-hidden">
                                        {courseTitle && (
                                            <span className="text-[11px] font-bold text-slate-300 truncate whitespace-nowrap">{courseTitle}</span>
                                        )}
                                        {moduleTitle && <>
                                            <span className="text-slate-700 text-xs">/</span>
                                            <span className="text-[11px] font-bold text-slate-400 truncate whitespace-nowrap">{moduleTitle}</span>
                                        </>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Messages Area */}
                        <div className="relative flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-premium scroll-smooth z-10">
                            {messages.map(msg => (
                                <ChatBubble key={msg.id} message={msg} />
                            ))}
                            
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-4 items-start"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/20">
                                        <Bot className="w-4.5 h-4.5 text-white" />
                                    </div>
                                    <div className="bg-[#1A1D29]/60 backdrop-blur-md border border-white/5 rounded-2xl rounded-tl-none px-5 py-3.5 shadow-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1">
                                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                            </div>
                                            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Thinking…</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions Container */}
                        <div className="relative border-t border-white/5 bg-[#0D0F18]/50 overflow-hidden flex-shrink-0">
                            <div className="flex items-center gap-2.5 px-5 py-3.5 overflow-x-auto scrollbar-none snap-x mask-fade-edges">
                                {QUICK_ACTIONS.map(action => {
                                    const Icon = action.icon;
                                    const isDebug = action.id === 'debug';
                                    return (
                                        <button
                                            key={action.id}
                                            onClick={() => handleQuickAction(action)}
                                            disabled={isLoading}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-black whitespace-nowrap transition-all border shadow-lg snap-start disabled:opacity-40",
                                                isDebug
                                                    ? "bg-indigo-600/15 text-indigo-300 border-indigo-500/20 hover:bg-indigo-600/25 hover:border-indigo-500/40"
                                                    : "bg-white/[0.03] text-slate-400 border-white/5 hover:bg-white/10 hover:text-white"
                                            )}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            <span className="uppercase tracking-wide">{action.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Input */}
                        <div className="p-6 bg-[#0B0D14] border-t border-white/5 flex-shrink-0 z-20">
                            <div className="group relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[2rem] blur opacity-0 group-focus-within:opacity-20 transition duration-500" />
                                <div className="relative flex items-center gap-3 bg-slate-900 border border-white/10 rounded-[1.75rem] pl-5 pr-2.5 py-2.5 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputValue}
                                        onChange={e => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type your message…"
                                        disabled={isLoading}
                                        className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none font-medium h-6"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!inputValue.trim() || isLoading}
                                        className={cn(
                                            "w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 active:scale-95 shadow-lg shadow-indigo-600/20",
                                            !inputValue.trim() || isLoading
                                                ? "bg-slate-800 text-slate-600"
                                                : "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white hover:from-indigo-400 hover:to-indigo-500"
                                        )}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-center text-[10px] text-slate-600 mt-4 font-bold uppercase tracking-widest pointer-events-none opacity-50">Powered by Lyzr AI Engine</p>
                        </div>
                    </div>

                    {/* CSS for custom scrollbar and effects */}
                    <style dangerouslySetInnerHTML={{ __html: `
                        .scrollbar-premium::-webkit-scrollbar {
                            width: 6px;
                        }
                        .scrollbar-premium::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        .scrollbar-premium::-webkit-scrollbar-thumb {
                            background: rgba(255, 255, 255, 0.05);
                            border-radius: 100px;
                        }
                        .scrollbar-premium::-webkit-scrollbar-thumb:hover {
                            background: rgba(255, 255, 255, 0.1);
                        }
                        .perspective-1000 {
                            perspective: 1000px;
                        }
                        .glass-effect {
                            background: rgba(255, 255, 255, 0.03);
                            backdrop-filter: blur(12px);
                            border: 1px border rgba(255, 255, 255, 0.05);
                        }
                        .mask-fade-edges {
                            mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                        }
                    `}} />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ─────────────────────────────────────────────
// Floating trigger button
// ─────────────────────────────────────────────
interface AITutorTriggerProps {
    onClick: () => void;
    isOpen: boolean;
    hasActivity: boolean;
}

export const AITutorTrigger: React.FC<AITutorTriggerProps> = ({ onClick, isOpen, hasActivity }) => (
    <AnimatePresence mode="wait">
        {!isOpen && (
            <motion.button
                initial={{ opacity: 0, scale: 0.5, rotate: -20, y: 20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 20, y: 20 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
                className="fixed bottom-8 right-8 z-[99] group"
            >
                <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 rounded-[1.75rem] blur-lg opacity-40 group-hover:opacity-70 animate-pulse transition duration-500" />
                <div className="relative w-16 h-16 rounded-[1.5rem] bg-[#0F111A] border border-white/10 flex items-center justify-center shadow-2xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent rounded-[1.5rem]" />
                    <Bot className="w-8 h-8 text-indigo-400 group-hover:text-white transition-colors relative z-10" />
                    
                    {hasActivity && (
                        <div className="absolute -top-1 -right-1 flex h-5 w-5 overflow-hidden">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-[#0F111A]"></span>
                        </div>
                    )}
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-slate-900 border border-white/10 rounded-2xl text-xs font-black text-white whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all uppercase tracking-widest shadow-2xl shadow-black">
                    Ask AI Tutor
                </div>
            </motion.button>
        )}
    </AnimatePresence>
);
