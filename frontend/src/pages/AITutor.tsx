/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { api } from '../services/api';
import {
  Send, Bot, User, Sparkles, MessageSquare, Copy, Check,
  Trash2, BookOpen, Code2, Lightbulb, HelpCircle, RefreshCw
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  { text: 'Explain variables in Python', icon: BookOpen },
  { text: 'Debug my code', icon: Code2 },
  { text: 'What are loops?', icon: HelpCircle },
  { text: 'Give me a practice problem', icon: Lightbulb },
  { text: 'Explain functions with examples', icon: Sparkles },
  { text: 'What are data types?', icon: BookOpen },
];

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Auto-size textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Build conversation history for context
      const history = [...messages, userMsg].slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await api.getAITutorChat({
        message: text.trim(),
        conversationHistory: history,
        courseTitle: 'Python Basics'
      });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.reply || res.message || "I'm having trouble processing that. Could you try rephrasing?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm temporarily unavailable. Please try again in a moment! 🔄",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping]);

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatMessage = (content: string) => {
    // Parse code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.slice(3, -3);
        const firstLineEnd = codeContent.indexOf('\n');
        const lang = firstLineEnd > 0 ? codeContent.slice(0, firstLineEnd).trim() : '';
        const code = firstLineEnd > 0 ? codeContent.slice(firstLineEnd + 1) : codeContent;
        return (
          <div key={i} className="my-3 rounded-xl overflow-hidden border border-white/10">
            <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 text-[10px] text-[#94A3B8] font-bold uppercase">
              <span>{lang || 'code'}</span>
              <button onClick={() => copyToClipboard(code, `code-${i}`)}
                className="hover:text-white transition-colors flex items-center gap-1">
                {copiedId === `code-${i}` ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
              </button>
            </div>
            <pre className="p-3 bg-[#0D1117] text-[#E6EDF3] text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">{code}</pre>
          </div>
        );
      }
      // Parse bullet points and bold
      return (
        <span key={i} className="whitespace-pre-wrap">
          {part.split('\n').map((line, j) => {
            // Bold markers
            let formatted: any = line;
            if (line.includes('**')) {
              const boldParts = line.split(/\*\*(.*?)\*\*/g);
              formatted = boldParts.map((bp: string, k: number) =>
                k % 2 === 1 ? <strong key={k} className="text-white font-bold">{bp}</strong> : bp
              );
            }
            // Bullet points
            if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
              return <div key={j} className="pl-3 py-0.5 flex gap-2"><span className="text-[#10B981] shrink-0">•</span><span>{formatted}</span></div>;
            }
            return <span key={j}>{formatted}{j < part.split('\n').length - 1 ? '\n' : ''}</span>;
          })}
        </span>
      );
    });
  };

  // ── Empty State ──
  if (messages.length === 0 && !isTyping) {
    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-140px)] flex flex-col">
          {/* Welcome */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#7C3AED] to-[#00D4FF] flex items-center justify-center mb-6 shadow-2xl shadow-[#7C3AED]/20">
              <Bot size={36} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Study Companion</h1>
            <p className="text-[#94A3B8] max-w-md leading-relaxed">
              I'm trained on your course syllabus. Ask me anything about Python, get help debugging code, or practice with guided exercises.
            </p>

            {/* Suggestion Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-8 max-w-xl">
              {SUGGESTIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button key={i} onClick={() => sendMessage(s.text)}
                    className="glass-card p-3 text-left hover:border-[#7C3AED]/30 transition-all group">
                    <Icon size={14} className="text-[#7C3AED] mb-1.5 group-hover:text-[#00D4FF] transition-colors" />
                    <p className="text-xs text-[#94A3B8] group-hover:text-white transition-colors">{s.text}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 max-w-3xl mx-auto w-full">
            <div className="relative glass-card p-2 flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Python..."
                className="flex-1 bg-transparent text-white text-sm outline-none resize-none px-3 py-2.5 placeholder-[#64748B] max-h-[120px]"
              />
              <button onClick={handleSend} disabled={!input.trim()}
                className="shrink-0 w-10 h-10 bg-gradient-to-r from-[#7C3AED] to-[#00D4FF] rounded-xl flex items-center justify-center text-white disabled:opacity-30 hover:shadow-lg hover:shadow-[#7C3AED]/20 transition-all">
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-[#475569] text-center mt-2">Powered by SkillBridge AI · Trained on your course syllabus</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Chat View ──
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-140px)] flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#00D4FF] flex items-center justify-center shadow-lg shadow-[#7C3AED]/20">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold flex items-center gap-2">
                AI Study Companion
                <span className="flex items-center gap-1 text-[10px] text-[#10B981] font-medium">
                  <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" /> Online
                </span>
              </h2>
              <p className="text-[10px] text-[#64748B]">Powered by Gemini · Python Basics Course</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={clearChat}
              className="px-3 py-1.5 bg-white/5 hover:bg-[#EF4444]/10 border border-white/5 rounded-lg text-[10px] text-[#94A3B8] hover:text-[#EF4444] font-bold transition-all flex items-center gap-1">
              <Trash2 size={10} /> Clear
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar pb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#00D4FF] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#7C3AED] text-white rounded-tr-sm'
                    : 'glass-card text-[#CBD5E1] rounded-tl-sm'
                }`}>
                  {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                </div>
                <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  <span className="text-[9px] text-[#475569]">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.role === 'assistant' && (
                    <button onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="text-[9px] text-[#475569] hover:text-white flex items-center gap-0.5 transition-colors">
                      {copiedId === msg.id ? <><Check size={9} /> Copied</> : <><Copy size={9} /> Copy</>}
                    </button>
                  )}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <User size={16} className="text-[#94A3B8]" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#00D4FF] flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                <RefreshCw size={12} className="text-[#7C3AED] animate-spin" />
                <span className="text-xs text-[#64748B]">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="pt-4 border-t border-white/5 shrink-0">
          {/* Quick Suggestions */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 custom-scrollbar">
            {['Explain this concept', 'Give me an example', 'Quiz me', 'Next topic'].map((tag) => (
              <button key={tag} onClick={() => sendMessage(tag)}
                className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-[#64748B] hover:text-white hover:border-[#7C3AED]/30 transition-all whitespace-nowrap shrink-0">
                {tag}
              </button>
            ))}
          </div>
          <div className="relative glass-card p-2 flex items-end gap-2">
            <MessageSquare size={16} className="text-[#475569] shrink-0 ml-2 mb-3" />
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question, paste code, or request a practice problem..."
              className="flex-1 bg-transparent text-white text-sm outline-none resize-none py-2.5 placeholder-[#64748B] max-h-[120px]"
            />
            <button onClick={handleSend} disabled={!input.trim() || isTyping}
              className="shrink-0 w-10 h-10 bg-gradient-to-r from-[#7C3AED] to-[#00D4FF] rounded-xl flex items-center justify-center text-white disabled:opacity-30 hover:shadow-lg hover:shadow-[#7C3AED]/20 transition-all">
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-[#475569] text-center mt-2">Shift+Enter for new line · Trained on SkillBridge Python Basics syllabus</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
