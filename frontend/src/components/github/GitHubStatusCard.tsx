/**
 * GitHubStatusCard.tsx
 * ─────────────────────────────────────────────────────────────────────
 * Displays the full GitHub integration status card for the
 * Settings / Profile page. Shows:
 *   - Connected or disconnected state
 *   - GitHub avatar + username
 *   - Total commits, last commit, portfolio link
 *   - Connect / Disconnect button
 * ─────────────────────────────────────────────────────────────────────
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Github, GitCommit, ExternalLink, Link2Off, Loader2, RefreshCw } from 'lucide-react';
import { useGitHub } from '../../hooks/useGitHub';
import { Button } from '../ui/button';

export const GitHubStatusCard: React.FC = () => {
    const { profile, isLoading, isConnecting, connect, disconnect, refresh } = useGitHub();

    if (isLoading) {
        return (
            <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5" />
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-white/5 rounded" />
                        <div className="h-3 w-20 bg-white/5 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden"
        >
            {/* Header */}
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center">
                        <Github size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white tracking-tight">GitHub Integration</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Portfolio Sync</p>
                    </div>
                </div>
                <button
                    onClick={refresh}
                    className="text-slate-600 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                    title="Refresh status"
                >
                    <RefreshCw size={14} />
                </button>
            </div>

            {/* Body */}
            <div className="px-8 py-6 space-y-6">
                {profile?.isConnected ? (
                    <>
                        {/* Connected state */}
                        <div className="flex items-center gap-4">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.username}
                                    className="w-14 h-14 rounded-2xl border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center">
                                    <Github size={28} className="text-white" />
                                </div>
                            )}
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Connected</span>
                                </div>
                                <p className="text-xl font-black text-white tracking-tight">@{profile.username}</p>
                                {profile.connectedAt && (
                                    <p className="text-[10px] text-slate-500 font-bold">
                                        Since {new Date(profile.connectedAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <GitCommit size={12} className="text-indigo-400" />
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Commits</span>
                                </div>
                                <p className="text-2xl font-black text-white tabular-nums">{profile.totalCommits ?? 0}</p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Last Saved</span>
                                </div>
                                <p className="text-sm font-black text-white">
                                    {profile.lastCommitAt
                                        ? new Date(profile.lastCommitAt).toLocaleDateString()
                                        : '—'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Portfolio link */}
                        {profile.repoUrl && (
                            <a
                                href={profile.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-[#161b22] border border-[#30363d] rounded-2xl hover:border-[#388bfd]/50 transition-colors group"
                            >
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Portfolio Repo</p>
                                    <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                                        skillbridge-portfolio
                                    </p>
                                </div>
                                <ExternalLink size={14} className="text-slate-600 group-hover:text-[#388bfd] transition-colors" />
                            </a>
                        )}

                        {/* Disconnect */}
                        <Button
                            variant="ghost"
                            onClick={disconnect}
                            className="w-full h-11 rounded-2xl border border-red-900/30 bg-red-900/5 text-red-400 hover:bg-red-900/20 hover:text-red-300 text-[10px] font-black uppercase tracking-widest gap-2"
                        >
                            <Link2Off size={12} />
                            Disconnect GitHub
                        </Button>
                    </>
                ) : (
                    <>
                        {/* Disconnected state */}
                        <div className="text-center py-4 space-y-4">
                            <div className="w-16 h-16 rounded-3xl bg-[#161b22] border border-[#30363d] flex items-center justify-center mx-auto">
                                <Github size={32} className="text-slate-500" />
                            </div>
                            <div>
                                <p className="text-white font-black text-lg">Connect GitHub</p>
                                <p className="text-slate-400 text-sm leading-relaxed mt-1 max-w-xs mx-auto">
                                    Save your code directly to <strong>skillbridge-portfolio</strong> — your living coding resume on GitHub.
                                </p>
                            </div>

                            {/* Feature bullets */}
                            <div className="text-left space-y-2 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                                {[
                                    'Auto-creates skillbridge-portfolio repo',
                                    'Organises code in /python, /dsa, /projects, /ai-labs',
                                    'One-click save from the code editor',
                                    'Full commit history tracking'
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                        <span className="text-[11px] text-slate-400 font-medium">{f}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Connect button */}
                            <Button
                                onClick={connect}
                                disabled={isConnecting}
                                className="w-full h-12 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#388bfd]/60 hover:bg-[#21262d] text-white font-black uppercase tracking-widest text-[11px] gap-2 transition-all"
                            >
                                {isConnecting
                                    ? <Loader2 size={14} className="animate-spin" />
                                    : <Github size={14} />
                                }
                                {isConnecting ? 'Redirecting to GitHub…' : 'Connect GitHub Account'}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default GitHubStatusCard;
