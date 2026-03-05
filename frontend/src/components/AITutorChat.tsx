/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    X,
    ChevronDown,
    Loader2,
    Lightbulb,
    Code2,
    Bug,
    BookOpen,
    Send,
    Sparkles,
} from 'lucide-react';
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
        <div className="space-y-3 mt-1">
            <div className="flex items-center gap-2">
                <span className={cn(
                    "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                    feedback.errorType === 'Syntax' ? "bg-red-500/20 text-red-300 border border-red-500/30" :
                        feedback.errorType === 'Logic' ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                            "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                )}>
                    {feedback.errorType}
                </span>
                <span className="text-[10px] text-slate-500 font-bold">Line {feedback.lineNumber}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{feedback.explanation}</p>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1">💡 Hint</p>
                <p className="text-sm text-indigo-200 font-medium">{feedback.hint}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-1">✨ Tip</p>
                <p className="text-sm text-emerald-200 font-medium">{feedback.improvementTip}</p>
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
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            className={cn("flex gap-3 items-end", isUser ? "flex-row-reverse" : "flex-row")}
        >
            {/* Avatar */}
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/30">
                    <Bot className="w-4 h-4 text-white" />
                </div>
            )}

            {/* Bubble */}
            <div className={cn(
                "max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                isUser
                    ? "bg-teal-500 text-white rounded-br-sm font-medium"
                    : "bg-slate-800 text-slate-200 rounded-bl-sm border border-white/5"
            )}>
                {message.type === 'feedback' && message.feedback ? (
                    <FeedbackCard feedback={message.feedback} />
                ) : (
                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                )}
                <p className={cn("text-[9px] mt-2 font-bold", isUser ? "text-teal-100/60 text-right" : "text-slate-600")}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            {/* User label */}
            {isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-slate-300 uppercase">
                    You
                </div>
            )}
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
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            type: 'text',
            content: `Hey there! 👋 I'm your SkillBridge AI Tutor, trained on the full Python Basics course syllabus.\n\nI know everything covered in all 4 weeks — from variables and loops to file handling and automation. Ask me anything! I'm here to guide you, not just give answers. 🧠`,
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
            // Build conversation history for context (exclude welcome message)
            const chatHistory = messages
                .filter(m => m.id !== 'welcome')
                .map(m => ({
                    role: m.role, content: m.type === 'feedback' && m.feedback
                        ? `${m.feedback.explanation} | Hint: ${m.feedback.hint}`
                        : m.content
                }));

            const res = await api.getAITutorChat({
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
                    initial={{ opacity: 0, x: 40, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed bottom-6 right-6 z-[100] w-[380px] flex flex-col"
                    style={{ height: '580px' }}
                >
                    {/* ── Chat Card ── */}
                    <div className="flex flex-col h-full bg-[#12151E] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-[#0D0F18] border-b border-white/5 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white tracking-tight">AI Tutor</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[10px] font-bold text-emerald-400">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={onClose}
                                    className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Context Breadcrumb */}
                        {(courseTitle || moduleTitle) && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/40 border-b border-white/5 flex-shrink-0">
                                <Sparkles className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Context:</span>
                                {courseTitle && (
                                    <span className="text-[11px] font-bold text-slate-300 truncate max-w-[120px]">{courseTitle}</span>
                                )}
                                {moduleTitle && <>
                                    <span className="text-slate-600 text-xs">/</span>
                                    <span className="text-[11px] font-bold text-slate-400 truncate max-w-[100px]">{moduleTitle}</span>
                                </>}
                            </div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                            {messages.map(msg => (
                                <ChatBubble key={msg.id} message={msg} />
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 items-end"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-slate-800 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                                            <span className="text-xs text-slate-400 font-medium">Thinking…</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-1.5 px-3 py-2 border-t border-white/5 bg-[#0D0F18] overflow-x-auto flex-shrink-0">
                            {QUICK_ACTIONS.map(action => {
                                const Icon = action.icon;
                                return (
                                    <button
                                        key={action.id}
                                        onClick={() => handleQuickAction(action)}
                                        disabled={isLoading}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border flex-shrink-0 disabled:opacity-40",
                                            action.id === 'debug'
                                                ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-600/30"
                                                : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white"
                                        )}
                                    >
                                        <Icon className="w-3 h-3" />
                                        {action.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Input */}
                        <div className="px-3 pb-3 pt-2 bg-[#0D0F18] flex-shrink-0">
                            <div className="flex items-center gap-2 bg-slate-800/80 border border-white/5 rounded-xl px-3 py-2 focus-within:border-indigo-500/50 transition-colors">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask anything about Python or this lesson…"
                                    disabled={isLoading}
                                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none font-medium"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 disabled:opacity-30 hover:bg-indigo-500 transition-all active:scale-90"
                                >
                                    <Send className="w-3.5 h-3.5 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
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
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={onClick}
                className="fixed bottom-6 right-6 z-[99] w-14 h-14 rounded-2xl bg-indigo-600 shadow-2xl shadow-indigo-600/40 flex items-center justify-center hover:bg-indigo-500 active:scale-90 transition-all"
            >
                <Bot className="w-6 h-6 text-white" />
                {hasActivity && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0D0F18] animate-pulse" />
                )}
            </motion.button>
        )}
    </AnimatePresence>
);
