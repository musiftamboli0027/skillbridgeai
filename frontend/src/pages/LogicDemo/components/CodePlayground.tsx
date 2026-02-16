import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Terminal, Sparkles, GraduationCap, Search, Lightbulb, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';

interface TutorFeedback {
    id: string;
    check: string[];
    hint: string;
    think: string;
}

const CodePlayground: React.FC = () => {
    // ... existing defaultCode ...
    const defaultCode = `// AI Tutor Training: Grading Logic
let marks = 75;

if (marks >= 40) {
    console.log("Student Passed");

    if (marks >= 60) {
        console.log("First Class");
    } else if (marks >= 50) {
        console.log("Second Class");
    } else {
        console.log("Just Passed");
    }

} else {
    console.log("Student Failed");
}`;

    const [code, setCode] = useState(defaultCode);
    const [output, setOutput] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [feedback, setFeedback] = useState<TutorFeedback | null>(null);

    const handleAnalyze = (runtimeError?: string) => {
        setIsAnalyzing(true);
        setTimeout(() => {
            const lowerCode = code.toLowerCase();
            let newFeedback: TutorFeedback = {
                id: Date.now().toString(),
                check: [],
                hint: "",
                think: ""
            };

            // CASE: Handling Runtime Errors (Debugging Mode)
            if (runtimeError) {
                newFeedback.check.push(`I detected a runtime error: "${runtimeError}"`);

                if (runtimeError.includes('is not defined')) {
                    const variableName = runtimeError.split(' ')[0];
                    newFeedback.hint = `The computer is looking for something called "${variableName}", but it hasn't been introduced yet. Did you forget to 'let' it into the program or check your spelling?`;
                    newFeedback.think = `In engineering, every tool must be registered before use. Where in your code should "${variableName}" be defined?`;
                }
                else if (runtimeError.includes('unexpected token') || runtimeError.includes('syntax error')) {
                    newFeedback.hint = "There's a 'grammar mistake' in your code. Look for missing curly braces { }, parentheses ( ), or semicolons ;.";
                    newFeedback.think = "Programs are very strict about their structure. Can you trace if every opening { has a matching closing }?";
                }
                else {
                    newFeedback.hint = "Something went wrong during execution. This usually happens when the logic tries to do something impossible.";
                    newFeedback.think = "Read the error message carefully. What specific line is it pointing to?";
                }
            }
            // CASE: Standard Logic Analysis
            else {
                // 1. Training on Nested Hierarchical Logic (Grading Pattern)
                const isGradingPattern = lowerCode.includes('marks') && lowerCode.includes('class');
                const hasNestedIf = code.match(/if\s*\(.*\{[^}]*if\s*\(/s);

                if (isGradingPattern && hasNestedIf) {
                    newFeedback.check.push("Excellent use of Hierarchical Logic!");
                    newFeedback.hint = "Your outer 'if' (marks >= 40) acts as a gateway. Only students who pass can reach the 'class' categorization logic inside. This is very efficient!";
                    newFeedback.think = "What would happen if you moved the 'First Class' check (>= 60) to the very top, before checking if they passed? Would the logic still work?";
                }
                // 2. Training on If-Else Logic
                else if (lowerCode.includes('if') && lowerCode.includes('else')) {
                    const hasElseIf = lowerCode.includes('else if');
                    newFeedback.check.push("I see you're using a complete If-Else structure!");
                    newFeedback.hint = hasElseIf
                        ? "Using 'else if' is like having multiple filters. It helps your program decide exactly which path to take among many."
                        : "Your 'if-else' creates a clean fork in the road. It ensures the program always has a direction, even if the first condition fails.";
                    newFeedback.think = "If both conditions were false, what would be the 'safety net' for your data?";
                }
                // 3. Training on Nested Logic (General)
                else if (hasNestedIf) {
                    newFeedback.check.push("Detected nested decision making (an 'if' inside another 'if').");
                    newFeedback.hint = "Nesting allows for very specific logic, but be careful! Too many layers can make the 'logic tree' hard to climb.";
                    newFeedback.think = "Could you achieve the same result using a logical operator like '&&' to keep the code flatter?";
                }
                // 4. Training on missing fallbacks
                else if (lowerCode.includes('if') && !lowerCode.includes('else')) {
                    newFeedback.check.push("The decision path is currently a 'one-way' street.");
                    newFeedback.hint = "In real-world engineering, we almost always need a fallback. What happens if your 'if' condition is never met?";
                    newFeedback.think = "Imagine this code is running a traffic light. If the 'if' for green fails, and there is no 'else', what happens to the cars?";
                }
                // 5. Training on Variable Naming
                else if (/\b(let|var|const)\s+[a-z]\b/.test(code) && !lowerCode.includes('for')) {
                    newFeedback.check.push("Naming check: Using generic labels like 'x' or 'a'.");
                    newFeedback.hint = "In NEP 2026 standards, we emphasize 'Self-Documenting Code'. A name like 'student_score' tells a story; 's' is just a mystery.";
                    newFeedback.think = "If you came back to this code in 6 months, which name would help you understand your logic faster?";
                }
                else {
                    newFeedback.check.push("Clean logic detected!");
                    newFeedback.hint = "You've mastered the basics of control flow. Why not try adding a loop to see how the logic repeats?";
                    newFeedback.think = "How would you change this logic to handle 100 different inputs instead of just one?";
                }
            }

            setFeedback(newFeedback);
            setIsAnalyzing(false);
        }, 1200);
    };

    useEffect(() => {
        Prism.highlightAll();
    }, [code]);

    const runCode = () => {
        // 1. Clear previous state explicitly
        setOutput([]);
        setError(null);
        setFeedback(null);

        const logs: string[] = [];
        const customConsole = {
            log: (...args: any[]) => {
                logs.push(args.map(arg =>
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' '));
            }
        };

        try {
            // 2. Execute fresh
            const run = new Function('console', code);
            run(customConsole);

            // 3. Update output once
            setOutput([...logs]);
        } catch (err: any) {
            setError(err.message);
            handleAnalyze(err.message);
        }
    };

    const resetCode = () => {
        setCode(defaultCode);
        setOutput([]);
        setError(null);
        setFeedback(null);
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="ml-4 text-xs font-mono text-slate-400">playground.js</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={resetCode}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                    >
                        <RotateCcw size={14} />
                        Reset
                    </button>
                    <button
                        onClick={() => handleAnalyze()}
                        disabled={isAnalyzing}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-400 hover:text-white hover:bg-indigo-600/20 rounded-md border border-indigo-500/30 transition-all disabled:opacity-50"
                    >
                        <Sparkles size={14} className={isAnalyzing ? "animate-spin" : ""} />
                        {isAnalyzing ? "Analyzing..." : "Ask Mentor"}
                    </button>
                    <button
                        onClick={runCode}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-all shadow-lg active:scale-95"
                    >
                        <Play size={14} fill="currentColor" />
                        Run Code
                    </button>
                </div>
            </div>

            <div className="flex flex-1 min-h-[400px]">
                {/* Editor */}
                <div className="w-1/2 relative border-r border-slate-700">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="absolute inset-0 w-full h-full p-6 bg-transparent text-transparent font-mono text-sm resize-none focus:outline-none z-10 caret-blue-500"
                        spellCheck="false"
                    />
                    <pre className="absolute inset-0 p-6 m-0 pointer-events-none overflow-hidden">
                        <code className="language-javascript">
                            {code}
                        </code>
                    </pre>
                </div>

                {/* Output & Mentor */}
                <div className="w-1/2 bg-slate-950 flex flex-col overflow-hidden">
                    {/* Tabs-like Header */}
                    <div className="flex bg-slate-900/50 border-b border-slate-800">
                        <button className="px-6 py-3 border-b-2 border-blue-500 flex items-center gap-2">
                            <Terminal size={14} className="text-blue-400" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Console</span>
                        </button>
                        <div className="ml-auto px-4 flex items-center">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Terminal Section */}
                        <div className="flex-1 p-6 font-mono text-sm overflow-auto border-b border-slate-800/50">
                            {error ? (
                                <div className="text-red-400 whitespace-pre-wrap">Error: {error}</div>
                            ) : output.length > 0 ? (
                                output.map((line: string, i: number) => (
                                    <div key={i} className="text-blue-300 mb-1 leading-relaxed">
                                        <span className="text-slate-600 mr-2">›</span>
                                        {line}
                                    </div>
                                ))
                            ) : (
                                <div className="text-slate-600 italic">Click "Run Code" to see the output...</div>
                            )}
                        </div>

                        {/* AI Mentor Feedback Panel */}
                        <div className="h-2/5 bg-indigo-950/20 flex flex-col overflow-hidden">
                            <div className="px-6 py-2 bg-indigo-900/10 border-b border-indigo-500/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <GraduationCap size={14} className="text-indigo-400" />
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Mentor Insights</span>
                                </div>
                            </div>

                            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {!feedback && !isAnalyzing ? (
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="h-full flex flex-col items-center justify-center text-center opacity-30"
                                        >
                                            <BrainCircuit size={24} className="mb-2" />
                                            <p className="text-[9px] font-bold uppercase tracking-widest">Awaiting Analysis...</p>
                                        </motion.div>
                                    ) : isAnalyzing ? (
                                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                                            <div className="h-2 w-1/2 bg-white/5 rounded animate-pulse" />
                                            <div className="h-2 w-1/3 bg-white/5 rounded animate-pulse" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key={feedback?.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-blue-400">
                                                    <Search size={10} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">What to Check</span>
                                                </div>
                                                <ul className="text-[11px] text-slate-400 ml-1 space-y-1">
                                                    {feedback?.check.map((c: string, i: number) => <li key={i}>• {c}</li>)}
                                                </ul>
                                            </div>

                                            <div className="space-y-1.5 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                                                <div className="flex items-center gap-2 text-indigo-400">
                                                    <Lightbulb size={10} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Hint</span>
                                                </div>
                                                <p className="text-[11px] text-slate-300 italic">"{feedback?.hint}"</p>
                                            </div>

                                            <div className="space-y-1 border-l-2 border-emerald-500/20 pl-3">
                                                <div className="flex items-center gap-2 text-emerald-400">
                                                    <BrainCircuit size={10} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Think About</span>
                                                </div>
                                                <p className="text-[11px] text-slate-400">{feedback?.think}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodePlayground;
