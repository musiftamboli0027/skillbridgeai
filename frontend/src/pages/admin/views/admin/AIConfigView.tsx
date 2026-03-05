import { useState } from 'react';
import { Bot, MessageSquare, Code, Lightbulb, Save, RefreshCw } from 'lucide-react';

export function AIConfigView() {
    const [config, setConfig] = useState({
        responseStyle: 'socratic',
        maxHints: 3,
        codeReviewEnabled: true,
        explanationDepth: 'detailed',
        allowedActions: ['explain', 'hint', 'review', 'debug'],
    });

    const [systemPrompt, setSystemPrompt] = useState(`You are an expert programming tutor helping university students learn to code. Your approach should be:

1. Socratic Method: Ask guiding questions rather than giving direct answers
2. Encourage Exploration: Help students discover solutions themselves
3. Context-Aware: Consider the student's current lesson and skill level
4. Code Review: Provide constructive feedback on code submissions
5. Academic Integrity: Never complete assignments for students

Always maintain a supportive, encouraging tone while promoting independent thinking.`);

    return (
        <div className="space-y-6 animate-slide-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">AI Tutor Configuration</h1>
                    <p className="text-[#94A3B8] mt-1 text-sm font-medium">Customize AI behavior for your university</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button className="btn-secondary flex-1 sm:flex-none">
                        <RefreshCw size={16} />
                        Reset
                    </button>
                    <button className="btn-primary flex-1 sm:flex-none">
                        <Save size={16} />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="glass-card p-5">
                        <h3 className="text-white font-bold mb-4">Response Style</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors border border-transparent has-[:checked]:border-[#00D4FF]/30 has-[:checked]:bg-[#00D4FF]/5">
                                <input
                                    type="radio"
                                    name="style"
                                    checked={config.responseStyle === 'socratic'}
                                    onChange={() => setConfig({ ...config, responseStyle: 'socratic' })}
                                    className="hidden"
                                />
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${config.responseStyle === 'socratic' ? 'border-[#00D4FF]' : 'border-white/20'}`}>
                                    {config.responseStyle === 'socratic' && <div className="w-2 h-2 rounded-full bg-[#00D4FF]" />}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Socratic Method</p>
                                    <p className="text-xs text-[#94A3B8] font-medium">Ask guiding questions to help students discover answers</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors border border-transparent has-[:checked]:border-[#00D4FF]/30 has-[:checked]:bg-[#00D4FF]/5">
                                <input
                                    type="radio"
                                    name="style"
                                    checked={config.responseStyle === 'balanced'}
                                    onChange={() => setConfig({ ...config, responseStyle: 'balanced' })}
                                    className="hidden"
                                />
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${config.responseStyle === 'balanced' ? 'border-[#00D4FF]' : 'border-white/20'}`}>
                                    {config.responseStyle === 'balanced' && <div className="w-2 h-2 rounded-full bg-[#00D4FF]" />}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Balanced</p>
                                    <p className="text-xs text-[#94A3B8] font-medium">Mix of guidance and direct explanations</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors border border-transparent has-[:checked]:border-[#00D4FF]/30 has-[:checked]:bg-[#00D4FF]/5">
                                <input
                                    type="radio"
                                    name="style"
                                    checked={config.responseStyle === 'direct'}
                                    onChange={() => setConfig({ ...config, responseStyle: 'direct' })}
                                    className="hidden"
                                />
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${config.responseStyle === 'direct' ? 'border-[#00D4FF]' : 'border-white/20'}`}>
                                    {config.responseStyle === 'direct' && <div className="w-2 h-2 rounded-full bg-[#00D4FF]" />}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Direct</p>
                                    <p className="text-xs text-[#94A3B8] font-medium">Provide clear, straightforward answers</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="glass-card p-5">
                        <h3 className="text-white font-bold mb-4">Allowed Actions</h3>
                        <div className="space-y-3">
                            {[
                                { id: 'explain', label: 'Explain Concept', icon: MessageSquare, desc: 'Break down complex topics' },
                                { id: 'hint', label: 'Give Hint', icon: Lightbulb, desc: 'Provide subtle guidance' },
                                { id: 'review', label: 'Review Code', icon: Bot, desc: 'Analyze and provide feedback' },
                                { id: 'debug', label: 'Debug Help', icon: Code, desc: 'Assist with error resolution' },
                            ].map((action) => {
                                const Icon = action.icon;
                                const isEnabled = config.allowedActions.includes(action.id);
                                return (
                                    <div key={action.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isEnabled ? 'bg-[#00D4FF]/20' : 'bg-white/5'}`}>
                                                <Icon size={18} className={isEnabled ? 'text-[#00D4FF]' : 'text-[#64748B]'} />
                                            </div>
                                            <div>
                                                <p className={`font-bold text-sm ${isEnabled ? 'text-white' : 'text-[#64748B]'}`}>{action.label}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">{action.desc}</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isEnabled}
                                                onChange={() => {
                                                    if (isEnabled) {
                                                        setConfig({ ...config, allowedActions: config.allowedActions.filter(a => a !== action.id) });
                                                    } else {
                                                        setConfig({ ...config, allowedActions: [...config.allowedActions, action.id] });
                                                    }
                                                }}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#03040A] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D4FF] peer-checked:after:bg-[#03040A]"></div>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="glass-card p-5">
                        <h3 className="text-white font-bold mb-4">System Prompt</h3>
                        <p className="text-xs text-[#94A3B8] mb-3 font-medium">
                            This prompt guides the AI tutor's behavior. Customize it to match your teaching philosophy.
                        </p>
                        <textarea
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            rows={12}
                            className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl p-4 text-xs text-[#94A3B8] font-mono resize-none focus:outline-none focus:border-[#00D4FF]/50"
                        />
                    </div>

                    <div className="glass-card p-5">
                        <h3 className="text-white font-bold mb-4">Advanced Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-2">Max Hints per Question</label>
                                <input
                                    type="number"
                                    value={config.maxHints}
                                    onChange={(e) => setConfig({ ...config, maxHints: parseInt(e.target.value) })}
                                    className="input-field w-32"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-2">Explanation Depth</label>
                                <select
                                    value={config.explanationDepth}
                                    onChange={(e) => setConfig({ ...config, explanationDepth: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="brief">Brief</option>
                                    <option value="detailed">Detailed</option>
                                    <option value="comprehensive">Comprehensive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
