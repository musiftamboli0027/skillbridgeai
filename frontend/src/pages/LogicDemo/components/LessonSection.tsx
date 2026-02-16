import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import { lessons } from '../data/lessonContent';
import { ArrowRight, Lightbulb } from 'lucide-react';

const LessonSection: React.FC = () => {
    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <div className="space-y-12 pb-12">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-extrabold mb-4 leading-tight text-white">Understanding Conditions & Decisions</h2>
                    <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                        In this module, you'll master how to make your code "think" using the power of JavaScript logic.
                        From simple checks to complex decision trees.
                    </p>
                    <div className="flex gap-4">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            Level: Beginner
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-300"></span>
                            Time: 45 Mins
                        </div>
                    </div>
                </div>
                {/* Background blobs */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-6">
                            <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                {idx + 1}
                            </div>
                            <div className="space-y-4 flex-1">
                                <h3 className="text-2xl font-bold text-slate-800">{lesson.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-lg italic border-l-4 border-blue-500 pl-4 py-1">
                                    {lesson.content}
                                </p>

                                <div className="mt-6 rounded-xl overflow-hidden bg-slate-900 shadow-lg group relative">
                                    <div className="px-4 py-2 bg-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
                                        <span>Example Code</span>
                                        <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Editable Script</span>
                                    </div>
                                    <pre className="p-6 m-0 overflow-x-auto text-left">
                                        <code className="language-javascript">
                                            {lesson.codeExample}
                                        </code>
                                    </pre>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-blue-600 font-bold group cursor-pointer hover:text-blue-700">
                                    Try this logic in Playground <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 flex gap-6 items-start">
                <div className="bg-amber-100 p-3 rounded-xl text-amber-600 shadow-inner">
                    <Lightbulb size={24} />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-amber-900 mb-1">Pro Tip: Comparison Operators</h4>
                    <p className="text-amber-800/80 leading-relaxed">
                        Always use <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-bold font-mono text-sm">===</code> (strict equality)
                        instead of <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-bold font-mono text-sm">==</code> in JavaScript
                        to avoid unexpected type coercion bugs!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LessonSection;
