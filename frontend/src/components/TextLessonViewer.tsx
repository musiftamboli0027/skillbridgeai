/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Clock, BookOpen, CheckCircle } from 'lucide-react';
import { api } from '@/services/api'; // Adjust path if needed

interface TextLessonViewerProps {
    content: string;
    lessonId: string;
    courseId: string;
    onComplete?: () => void;
}

export const TextLessonViewer: React.FC<TextLessonViewerProps> = ({
    content,
    lessonId,
    courseId,
    onComplete,
}) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [secondsSpent, setSecondsSpent] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const scrollAreaRef = useRef<HTMLDivElement>(null); // Ref to the scrollable container

    // 1. Time Tracking
    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsSpent(prev => {
                const newValue = prev + 1;
                // Sync every 30s
                if (newValue % 30 === 0) {
                    api.syncVideoProgress(courseId, lessonId, newValue).catch(console.warn);
                }
                return newValue;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [lessonId, courseId]);

    // 2. Scroll Tracking
    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        const totalScrollable = scrollHeight - clientHeight;
        const currentPercent = totalScrollable > 0 ? (scrollTop / totalScrollable) : 1;

        // Update valid progress (0 to 100)
        const percent = Math.min(100, Math.max(0, currentPercent * 100));
        setScrollProgress(percent);

        // Check completion criteria (e.g., >80% scroll AND > 30s time - time check done in completion handler usually)
        if (percent > 90 && !isCompleted) {
            setIsCompleted(true);
            if (onComplete) onComplete();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Reading Progress Bar (Fixed Top) */}
            <div className="h-1 w-full bg-slate-100 shrink-0">
                <div
                    className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Reading Meta Header */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-slate-50 shrink-0 bg-white/80 backdrop-blur z-10">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Reading Mode
                    </span>
                    <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {Math.floor(secondsSpent / 60)}m {secondsSpent % 60}s
                    </span>
                </div>
                {isCompleted && (
                    <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-right">
                        <CheckCircle className="w-4 h-4" /> Read
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div
                className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-24 py-8 custom-scrollbar scroll-smooth"
                onScroll={handleScroll}
                ref={scrollAreaRef}
            >
                <article className="prose prose-slate prose-lg max-w-3xl mx-auto pb-32">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <div className="not-prose rounded-xl overflow-hidden my-6 shadow-2xl border border-slate-700">
                                        <div className="bg-[#1e1e1e] px-4 py-2 text-xs font-mono text-slate-400 border-b border-slate-700 flex justify-between">
                                            <span>{match[1]}</span>
                                            <span>Copy</span>
                                        </div>
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            customStyle={{ margin: 0, borderRadius: 0 }}
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    </div>
                                ) : (
                                    <code className={className ? className : "bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-sm before:content-[''] after:content-['']"} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            h1: ({ node, ...props }) => <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-8 mt-4" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-12 mb-6 border-b border-slate-100 pb-2" {...props} />,
                            p: ({ node, ...props }) => <p className="text-slate-600 leading-7 mb-6" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-indigo-500 pl-6 py-2 my-8 bg-indigo-50/50 rounded-r-lg italic text-slate-700" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 space-y-2 text-slate-600 mb-6" {...props} />,
                            img: ({ node, ...props }) => <img className="rounded-xl shadow-lg my-8 w-full" {...props} />,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </article>
            </div>
        </div>
    );
};
