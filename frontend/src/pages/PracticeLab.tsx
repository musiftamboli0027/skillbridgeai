import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';
import {
  Code2, Play, RotateCcw, CheckCircle2, Clock,
  Lightbulb, ChevronRight, Sparkles, Terminal, Copy, Check
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  starterCode: string;
  testCases: { input: string; expected: string }[];
  hint: string;
  solved?: boolean;
}

const CHALLENGES: Challenge[] = [
  {
    id: '1', title: 'Hello World', difficulty: 'Easy', category: 'Basics',
    description: 'Write a program that prints "Hello, World!" to the console.',
    starterCode: '# Your code here\nprint("Hello, World!")',
    testCases: [{ input: '', expected: 'Hello, World!' }],
    hint: 'Use the print() function to display text.'
  },
  {
    id: '2', title: 'Sum of Two Numbers', difficulty: 'Easy', category: 'Basics',
    description: 'Write a function that takes two numbers as parameters and returns their sum.\n\nExample:\n  add(3, 5) → 8\n  add(-1, 7) → 6',
    starterCode: 'def add(a, b):\n    # Write your code here\n    pass\n\n# Test\nprint(add(3, 5))\nprint(add(-1, 7))',
    testCases: [{ input: '3, 5', expected: '8' }, { input: '-1, 7', expected: '6' }],
    hint: 'Use the + operator to add two numbers and return the result.'
  },
  {
    id: '3', title: 'Even or Odd', difficulty: 'Easy', category: 'Conditionals',
    description: 'Write a function that checks if a number is even or odd.\n\nReturn "Even" if the number is even, "Odd" if it\'s odd.\n\nExample:\n  check(4) → "Even"\n  check(7) → "Odd"',
    starterCode: 'def check(n):\n    # Write your code here\n    pass\n\nprint(check(4))\nprint(check(7))',
    testCases: [{ input: '4', expected: 'Even' }, { input: '7', expected: 'Odd' }],
    hint: 'Use the modulus operator (%) to check divisibility by 2.'
  },
  {
    id: '4', title: 'FizzBuzz', difficulty: 'Medium', category: 'Loops',
    description: 'Print numbers from 1 to n. For multiples of 3, print "Fizz". For multiples of 5, print "Buzz". For multiples of both, print "FizzBuzz".\n\nExample for n=5:\n1\n2\nFizz\n4\nBuzz',
    starterCode: 'def fizzbuzz(n):\n    # Write your code here\n    pass\n\nfizzbuzz(15)',
    testCases: [{ input: '3', expected: 'Fizz' }, { input: '5', expected: 'Buzz' }, { input: '15', expected: 'FizzBuzz' }],
    hint: 'Check divisibility by 15 first, then by 3, then by 5.'
  },
  {
    id: '5', title: 'Reverse a String', difficulty: 'Easy', category: 'Strings',
    description: 'Write a function that reverses a given string.\n\nExample:\n  reverse("hello") → "olleh"\n  reverse("Python") → "nohtyP"',
    starterCode: 'def reverse(s):\n    # Write your code here\n    pass\n\nprint(reverse("hello"))\nprint(reverse("Python"))',
    testCases: [{ input: 'hello', expected: 'olleh' }, { input: 'Python', expected: 'nohtyP' }],
    hint: 'You can use string slicing with [::-1] or a loop.'
  },
  {
    id: '6', title: 'Find Maximum', difficulty: 'Easy', category: 'Functions',
    description: 'Write a function that finds the maximum number in a list.\n\nExample:\n  find_max([3, 1, 7, 2]) → 7',
    starterCode: 'def find_max(numbers):\n    # Write your code here\n    pass\n\nprint(find_max([3, 1, 7, 2]))',
    testCases: [{ input: '[3, 1, 7, 2]', expected: '7' }],
    hint: 'Use a variable to track the largest value as you loop through the list.'
  },
  {
    id: '7', title: 'Factorial', difficulty: 'Medium', category: 'Functions',
    description: 'Write a function to calculate the factorial of a number.\n\nFactorial of n = n × (n-1) × (n-2) × ... × 1\n\nExample:\n  factorial(5) → 120\n  factorial(0) → 1',
    starterCode: 'def factorial(n):\n    # Write your code here\n    pass\n\nprint(factorial(5))\nprint(factorial(0))',
    testCases: [{ input: '5', expected: '120' }, { input: '0', expected: '1' }],
    hint: 'Use a loop or recursion. Remember: 0! = 1.'
  },
  {
    id: '8', title: 'Palindrome Check', difficulty: 'Medium', category: 'Strings',
    description: 'Write a function that checks if a string is a palindrome (reads the same backward).\n\nExample:\n  is_palindrome("racecar") → True\n  is_palindrome("hello") → False',
    starterCode: 'def is_palindrome(s):\n    # Write your code here\n    pass\n\nprint(is_palindrome("racecar"))\nprint(is_palindrome("hello"))',
    testCases: [{ input: 'racecar', expected: 'True' }, { input: 'hello', expected: 'False' }],
    hint: 'Compare the string with its reverse.'
  },
  {
    id: '9', title: 'Count Vowels', difficulty: 'Easy', category: 'Strings',
    description: 'Write a function that counts the number of vowels in a string.\n\nExample:\n  count_vowels("hello world") → 3',
    starterCode: 'def count_vowels(s):\n    # Write your code here\n    pass\n\nprint(count_vowels("hello world"))',
    testCases: [{ input: 'hello world', expected: '3' }],
    hint: 'Loop through each character and check if it\'s in "aeiouAEIOU".'
  },
  {
    id: '10', title: 'Fibonacci Sequence', difficulty: 'Hard', category: 'Functions',
    description: 'Write a function that returns the first n numbers of the Fibonacci sequence.\n\nFibonacci: 0, 1, 1, 2, 3, 5, 8, 13...\n\nExample:\n  fibonacci(6) → [0, 1, 1, 2, 3, 5]',
    starterCode: 'def fibonacci(n):\n    # Write your code here\n    pass\n\nprint(fibonacci(6))',
    testCases: [{ input: '6', expected: '[0, 1, 1, 2, 3, 5]' }],
    hint: 'Start with [0, 1] and keep adding the sum of the last two numbers.'
  },
];

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Easy': { bg: '#10B981/15', text: '#10B981', border: '#10B981/25' },
  'Medium': { bg: '#F59E0B/15', text: '#F59E0B', border: '#F59E0B/25' },
  'Hard': { bg: '#EF4444/15', text: '#EF4444', border: '#EF4444/25' },
};

export default function PracticeLab() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [code, setCode] = useState(CHALLENGES[0].starterCode);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [aiHelp, setAiHelp] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [showChallengeList, setShowChallengeList] = useState(true);
  const outputRef = useRef<HTMLDivElement>(null);

  const categories = ['All', ...Array.from(new Set(CHALLENGES.map(c => c.category)))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filtered = CHALLENGES.filter(c => {
    if (filterCategory !== 'All' && c.category !== filterCategory) return false;
    if (filterDifficulty !== 'All' && c.difficulty !== filterDifficulty) return false;
    return true;
  });

  const selectChallenge = (ch: Challenge) => {
    setSelectedChallenge(ch);
    setCode(ch.starterCode);
    setOutput('');
    setShowHint(false);
    setAiHelp('');
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput('');

    // Simulate code execution (since we can't run Python in browser)
    setTimeout(() => {
      try {
        // Simple simulation for demo — detects print statements
        const printMatches = code.match(/print\((.*?)\)/g);
        if (printMatches) {
          const results = printMatches.map(p => {
            const content = p.match(/print\((.*)\)/)?.[1] || '';
            // Simple evaluation for basic expressions
            try {
              // Handle string literals
              if (content.startsWith('"') || content.startsWith("'")) {
                return content.replace(/['"]/g, '');
              }
              // Try basic math
              const result = Function('"use strict"; return (' + content + ')')();
              return String(result);
            } catch {
              return `[Output] ${content}`;
            }
          });
          setOutput(results.join('\n'));
        } else {
          setOutput('✓ Code executed (no output detected)');
        }
      } catch {
        setOutput('❌ Error executing code');
      }
      setIsRunning(false);
    }, 800);
  };

  const resetCode = () => {
    setCode(selectedChallenge.starterCode);
    setOutput('');
    setAiHelp('');
    setShowHint(false);
  };

  const getAIHelp = async () => {
    setAiLoading(true);
    setAiHelp('');
    try {
      const res = await api.getAITutorChat({
        message: `I'm working on this challenge: "${selectedChallenge.title}". ${selectedChallenge.description}\n\nHere's my current code:\n\`\`\`python\n${code}\n\`\`\`\n\nPlease give me a hint or help me debug this without giving the full answer.`,
        courseTitle: 'Python Practice Lab'
      });
      setAiHelp(res.reply || 'AI is temporarily unavailable.');
    } catch {
      setAiHelp('AI Tutor is busy right now. Try again shortly!');
    } finally {
      setAiLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const markSolved = () => {
    if (!solvedIds.includes(selectedChallenge.id)) {
      setSolvedIds([...solvedIds, selectedChallenge.id]);
      toast.success(`"${selectedChallenge.title}" marked as solved! 🎉`);
    }
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-140px)] flex flex-col gap-4 overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Code2 size={24} className="text-[#7C3AED]" /> Practice Lab
            </h1>
            <p className="text-[#94A3B8] text-sm mt-0.5">Solve coding challenges and level up your Python skills</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
              <CheckCircle2 size={14} className="text-[#10B981]" />
              <span className="text-xs text-white font-bold">{solvedIds.length}/{CHALLENGES.length}</span>
              <span className="text-[10px] text-[#64748B]">Solved</span>
            </div>
            <button onClick={() => setShowChallengeList(!showChallengeList)}
              className="lg:hidden px-3 py-1.5 bg-white/5 rounded-xl text-xs text-[#94A3B8] font-bold border border-white/5">
              {showChallengeList ? 'Editor' : 'Challenges'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">

          {/* Challenge List (Left) */}
          <div className={`w-72 shrink-0 flex flex-col gap-3 overflow-hidden ${showChallengeList ? '' : 'hidden lg:flex'}`}>
            {/* Filters */}
            <div className="flex gap-2">
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-[#94A3B8] outline-none">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-[#94A3B8] outline-none">
                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {filtered.map((ch) => {
                const isSolved = solvedIds.includes(ch.id);
                const isActive = selectedChallenge.id === ch.id;
                const dc = DIFFICULTY_COLORS[ch.difficulty];
                return (
                  <button key={ch.id} onClick={() => selectChallenge(ch)}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      isActive ? 'bg-[#7C3AED]/10 border-[#7C3AED]/30' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                    }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white font-bold truncate flex items-center gap-1.5">
                        {isSolved ? <CheckCircle2 size={12} className="text-[#10B981] shrink-0" /> : <span className="w-3 h-3 rounded-full border border-[#475569] shrink-0" />}
                        {ch.title}
                      </span>
                      <ChevronRight size={12} className={`shrink-0 ${isActive ? 'text-[#7C3AED]' : 'text-[#475569]'}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                        style={{ backgroundColor: `${dc.text}15`, color: dc.text }}>
                        {ch.difficulty}
                      </span>
                      <span className="text-[9px] text-[#64748B]">{ch.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor + Output (Right) */}
          <div className={`flex-1 flex flex-col gap-3 min-w-0 ${showChallengeList ? 'hidden lg:flex' : ''}`}>
            {/* Problem Description */}
            <div className="glass-card p-4 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold">{selectedChallenge.title}</h3>
                  <span className="text-[9px] px-2 py-0.5 rounded font-bold"
                    style={{
                      backgroundColor: `${DIFFICULTY_COLORS[selectedChallenge.difficulty].text}15`,
                      color: DIFFICULTY_COLORS[selectedChallenge.difficulty].text
                    }}>
                    {selectedChallenge.difficulty}
                  </span>
                  <span className="text-[9px] text-[#64748B] px-2 py-0.5 bg-white/5 rounded">{selectedChallenge.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowHint(!showHint)}
                    className="text-[10px] text-[#F59E0B] hover:text-white flex items-center gap-1 transition-colors">
                    <Lightbulb size={12} /> Hint
                  </button>
                  <button onClick={markSolved}
                    className="text-[10px] text-[#10B981] hover:text-white flex items-center gap-1 transition-colors">
                    <CheckCircle2 size={12} /> Solved
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#94A3B8] whitespace-pre-line leading-relaxed">{selectedChallenge.description}</p>
              {showHint && (
                <div className="mt-2 p-2 bg-[#F59E0B]/5 border border-[#F59E0B]/10 rounded-lg">
                  <p className="text-[10px] text-[#F59E0B]">💡 {selectedChallenge.hint}</p>
                </div>
              )}
            </div>

            {/* Editor + Output Split */}
            <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-0">
              {/* Code Editor */}
              <div className="flex-1 flex flex-col rounded-xl border border-white/10 overflow-hidden min-h-[300px]">
                <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/5 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/60" />
                    </div>
                    <span className="text-[10px] text-[#64748B] font-bold">solution.py</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={copyCode}
                      className="text-[10px] text-[#64748B] hover:text-white flex items-center gap-1 px-2 py-1 hover:bg-white/5 rounded transition-all">
                      {copied ? <><Check size={10} className="text-[#10B981]" /> Copied</> : <><Copy size={10} /> Copy</>}
                    </button>
                    <button onClick={resetCode}
                      className="text-[10px] text-[#64748B] hover:text-white flex items-center gap-1 px-2 py-1 hover:bg-white/5 rounded transition-all">
                      <RotateCcw size={10} /> Reset
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <Editor
                    height="100%"
                    defaultLanguage="python"
                    theme="vs-dark"
                    value={code}
                    onChange={(v) => setCode(v || '')}
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                      padding: { top: 16, bottom: 16 },
                      automaticLayout: true,
                      lineHeight: 1.6,
                    }}
                  />
                </div>
              </div>

              {/* Output Panel */}
              <div className="w-full lg:w-[320px] flex flex-col gap-3 shrink-0 min-h-[200px]">
                {/* Run + Output */}
                <div className="flex-1 flex flex-col rounded-xl border border-white/10 overflow-hidden bg-[#0D1117]">
                  <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/5 shrink-0">
                    <div className="flex items-center gap-2 text-[#94A3B8]">
                      <Terminal size={12} />
                      <span className="text-[10px] font-bold">Output</span>
                    </div>
                    <button onClick={runCode} disabled={isRunning}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981] hover:bg-[#10B981]/80 text-white text-[10px] font-bold rounded-lg transition-all disabled:opacity-50">
                      {isRunning ? <Clock size={10} className="animate-spin" /> : <Play size={10} />}
                      {isRunning ? 'Running...' : 'Run Code'}
                    </button>
                  </div>
                  <div ref={outputRef} className="flex-1 p-3 overflow-y-auto font-mono text-xs custom-scrollbar">
                    {output ? (
                      <pre className="text-[#E6EDF3] whitespace-pre-wrap leading-relaxed">{output}</pre>
                    ) : (
                      <p className="text-[#475569] text-xs italic">Click "Run Code" to see output...</p>
                    )}
                  </div>
                </div>

                {/* AI Help */}
                <div className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.02] shrink-0">
                  <button onClick={getAIHelp} disabled={aiLoading}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-2">
                      <Sparkles size={12} className="text-[#7C3AED]" />
                      <span className="text-[10px] text-white font-bold">Ask AI Tutor for Help</span>
                    </div>
                    {aiLoading && <Clock size={10} className="text-[#7C3AED] animate-spin" />}
                  </button>
                  {aiHelp && (
                    <div className="px-3 pb-3 border-t border-white/5 relative">
                      <button onClick={() => setAiHelp('')}
                        className="absolute top-2 right-3 text-[#64748B] hover:text-white transition-colors text-xs font-bold">
                        ✕
                      </button>
                      <p className="text-[11px] text-[#94A3B8] leading-relaxed mt-2 pr-5 whitespace-pre-wrap">{aiHelp}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
