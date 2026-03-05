/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Clock, BookOpen, CheckCircle2, Copy, Check } from 'lucide-react';

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
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const codeBlockCounter = useRef(0);
    // Reset counter each render so code block indices are stable
    codeBlockCounter.current = 0;

    // Reset on lesson change
    useEffect(() => {
        setScrollProgress(0);
        setSecondsSpent(0);
        setIsCompleted(false);
    }, [lessonId]);

    // Time tracking
    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsSpent(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [lessonId, courseId]);

    // Scroll tracking
    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        const totalScrollable = scrollHeight - clientHeight;
        const currentPercent = totalScrollable > 0 ? (scrollTop / totalScrollable) : 1;
        const percent = Math.min(100, Math.max(0, currentPercent * 100));
        setScrollProgress(percent);

        if (percent > 90 && !isCompleted) {
            setIsCompleted(true);
            if (onComplete) onComplete();
        }
    };

    const handleCopy = (code: string, idx: number) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopiedIndex(idx);
            setTimeout(() => setCopiedIndex(null), 2000);
        });
    };

    const minutes = Math.floor(secondsSpent / 60);
    const seconds = secondsSpent % 60;

    return (
        <div className="flex flex-col w-full h-full bg-[#020203] overflow-hidden">
            {/* Progress Bar */}
            <div className="h-0.5 w-full bg-white/5 shrink-0">
                <div
                    className="h-full bg-indigo-500 shadow-[0_0_8px_#6366f1] transition-all duration-300 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Reading Meta Header */}
            <div className="flex items-center justify-between px-6 lg:px-10 py-3 border-b border-white/5 shrink-0 bg-slate-950/60 backdrop-blur-xl">
                <div className="flex items-center gap-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        Reading Mode
                    </span>
                    <span className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                        {minutes}m {seconds.toString().padStart(2, '0')}s
                    </span>
                    <span className="text-slate-700">|</span>
                    <span className="text-slate-600">{Math.round(scrollProgress)}% read</span>
                </div>
                {isCompleted && (
                    <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-right duration-500">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                    </div>
                )}
            </div>

            {/* Scrollable Content Area */}
            <div
                className="flex-1 overflow-y-auto custom-scrollbar"
                onScroll={handleScroll}
                style={{ overscrollBehavior: 'contain' }}
            >
                <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 py-10 pb-32">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            // Code blocks
                            code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                const codeString = String(children).replace(/\n$/, '');
                                // Give each block a stable index
                                const blockIdx = codeBlockCounter.current++;
                                return !inline && match ? (
                                    <div className="not-prose rounded-2xl overflow-hidden my-6 shadow-2xl border border-white/5 bg-[#0d0d0e]">
                                        <div className="flex items-center justify-between bg-slate-900/80 px-5 py-2.5 border-b border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">{match[1]}</span>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(codeString, blockIdx)}
                                                className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors px-3 py-1 rounded-lg hover:bg-white/5"
                                            >
                                                {copiedIndex === blockIdx
                                                    ? <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
                                                    : <><Copy className="w-3 h-3" />Copy</>
                                                }
                                            </button>
                                        </div>
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            customStyle={{
                                                margin: 0,
                                                borderRadius: 0,
                                                background: '#0d0d0e',
                                                padding: '1.25rem 1.5rem',
                                                fontSize: '0.825rem',
                                                lineHeight: '1.7',
                                            }}
                                            {...props}
                                        >
                                            {codeString}
                                        </SyntaxHighlighter>
                                    </div>
                                ) : (
                                    <code
                                        className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 rounded-md font-mono text-[0.82em] before:content-[''] after:content-['']"
                                        {...props}
                                    >
                                        {children}
                                    </code>
                                );
                            },

                            // Headings
                            h1: ({ node, ...props }) => (
                                <h1
                                    className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-8 mt-2 leading-tight"
                                    {...props}
                                />
                            ),
                            h2: ({ node, ...props }) => (
                                <h2
                                    className="text-xl lg:text-2xl font-black tracking-tight text-slate-100 mt-12 mb-5 pb-3 border-b border-white/5 flex items-center gap-3"
                                    {...props}
                                />
                            ),
                            h3: ({ node, ...props }) => (
                                <h3
                                    className="text-base font-black uppercase tracking-widest text-indigo-400 mt-8 mb-4"
                                    {...props}
                                />
                            ),

                            // Paragraphs
                            p: ({ node, ...props }) => (
                                <p
                                    className="text-slate-300 leading-8 mb-5 font-medium text-[15px]"
                                    {...props}
                                />
                            ),

                            // Blockquote
                            blockquote: ({ node, ...props }) => (
                                <blockquote
                                    className="border-l-4 border-indigo-500 pl-6 py-3 my-6 bg-indigo-500/5 rounded-r-2xl italic text-slate-300 font-medium"
                                    {...props}
                                />
                            ),

                            // Lists
                            ul: ({ node, ...props }) => (
                                <ul
                                    className="list-none ml-0 space-y-2.5 text-slate-300 mb-6"
                                    {...props}
                                />
                            ),
                            li: ({ node, children, ...props }) => (
                                <li
                                    className="flex items-start gap-3 font-medium text-[15px] leading-7"
                                    {...props}
                                >
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                    <span>{children}</span>
                                </li>
                            ),
                            ol: ({ node, ...props }) => (
                                <ol
                                    className="list-decimal list-inside ml-0 space-y-2.5 text-slate-300 mb-6 font-medium text-[15px]"
                                    {...props}
                                />
                            ),

                            // Table
                            table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-8 rounded-2xl border border-white/5">
                                    <table
                                        className="w-full border-collapse text-sm"
                                        {...props}
                                    />
                                </div>
                            ),
                            thead: ({ node, ...props }) => (
                                <thead className="bg-slate-900/80" {...props} />
                            ),
                            th: ({ node, ...props }) => (
                                <th
                                    className="text-left px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/5"
                                    {...props}
                                />
                            ),
                            td: ({ node, ...props }) => (
                                <td
                                    className="px-5 py-3 text-slate-300 font-medium border-b border-white/[0.03] text-[13px]"
                                    {...props}
                                />
                            ),
                            tr: ({ node, ...props }) => (
                                <tr
                                    className="hover:bg-white/[0.02] transition-colors"
                                    {...props}
                                />
                            ),

                            // Strong / Em
                            strong: ({ node, ...props }) => (
                                <strong className="text-white font-black" {...props} />
                            ),
                            em: ({ node, ...props }) => (
                                <em className="text-indigo-300 not-italic font-bold" {...props} />
                            ),

                            // Horizontal rule
                            hr: () => (
                                <hr className="my-10 border-white/5" />
                            ),

                            // Links
                            a: ({ node, ...props }) => (
                                <a
                                    className="text-indigo-400 font-bold hover:text-indigo-300 underline underline-offset-2 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    {...props}
                                />
                            ),

                            // Images
                            img: ({ node, ...props }) => (
                                <img
                                    className="rounded-2xl shadow-2xl my-8 w-full border border-white/5"
                                    {...props}
                                />
                            ),
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
