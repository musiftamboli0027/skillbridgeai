/**
 * GitHubSaveButton.tsx
 * ─────────────────────────────────────────────────────────────────────
 * A glowing "Save to GitHub" button for the code editor toolbar.
 * Shows connection status, handles OAuth redirect, and fires the save.
 * ─────────────────────────────────────────────────────────────────────
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Check, Loader2, GitCommit, Link2, ExternalLink } from 'lucide-react';
import { useGitHub } from '../../hooks/useGitHub';
import { cn } from '../../lib/utils';

interface GitHubSaveButtonProps {
    code: string;
    filename?: string;
    folder?: string;
    language?: string;
    lessonTitle?: string;
    /** Compact mode — just the icon + text, no extra chrome */
    compact?: boolean;
    className?: string;
}

const FOLDER_MAP: Record<string, string> = {
    python: 'python',
    javascript: 'projects',
    typescript: 'projects',
    java: 'dsa',
    c: 'dsa',
    cpp: 'dsa',
    sql: 'projects',
};

export const GitHubSaveButton: React.FC<GitHubSaveButtonProps> = ({
    code,
    filename,
    folder,
    language = 'python',
    lessonTitle,
    compact = false,
    className
}) => {
    const { profile, isLoading, isSaving, isConnecting, connect, saveCode } = useGitHub();
    const [lastSaveUrl, setLastSaveUrl] = useState<string | null>(null);
    const [justSaved, setJustSaved] = useState(false);

    // Auto-derive filename from lesson title if not provided
    const derivedFilename = filename ||
        (lessonTitle
            ? lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40) + getExt(language)
            : `code${getExt(language)}`);

    const derivedFolder = folder || FOLDER_MAP[language] || 'projects';

    const handleSave = async () => {
        if (!profile?.isConnected) {
            connect();
            return;
        }

        const result = await saveCode({
            filename: derivedFilename,
            folder: derivedFolder,
            code,
            language,
            commitMessage: lessonTitle
                ? `feat: complete "${lessonTitle}" — saved via SkillBridge IDE`
                : undefined
        });

        if (result.success && result.data?.fileUrl) {
            setLastSaveUrl(result.data.fileUrl);
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 4000);
        }
    };

    // ── Loading skeleton ──
    if (isLoading) {
        return (
            <div className={cn('h-8 w-36 rounded-full bg-white/5 animate-pulse', className)} />
        );
    }

    // ── Not connected state ──
    if (!profile?.isConnected) {
        if (compact) {
            return (
                <button
                    onClick={connect}
                    disabled={isConnecting}
                    className={cn(
                        'h-8 px-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest',
                        'rounded-full border border-white/10 text-slate-400 hover:border-slate-500 hover:text-white',
                        'transition-all duration-200 active:scale-95',
                        className
                    )}
                    title="Connect GitHub"
                >
                    {isConnecting ? <Loader2 size={12} className="animate-spin" /> : <Github size={12} />}
                    Connect GitHub
                </button>
            );
        }

        return (
            <motion.button
                onClick={connect}
                disabled={isConnecting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                    'group relative flex items-center gap-2 px-4 h-9 rounded-full text-[10px] font-black uppercase tracking-widest',
                    'bg-[#161b22] border border-white/10 text-slate-300',
                    'hover:border-[#30363d] hover:bg-[#21262d] hover:text-white',
                    'transition-all duration-200 active:scale-95 overflow-hidden',
                    className
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {isConnecting
                    ? <Loader2 size={13} className="animate-spin text-slate-400" />
                    : <Github size={13} className="text-slate-400 group-hover:text-white transition-colors" />
                }
                {isConnecting ? 'Redirecting…' : 'Connect GitHub'}
                <Link2 size={9} className="opacity-40" />
            </motion.button>
        );
    }

    // ── Connected — Save Button ──
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <AnimatePresence mode="wait">
                {justSaved ? (
                    <motion.a
                        key="saved"
                        href={lastSaveUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-1.5 h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20 transition-all"
                    >
                        <Check size={12} />
                        Saved · View
                        <ExternalLink size={9} />
                    </motion.a>
                ) : (
                    <motion.button
                        key="save"
                        onClick={handleSave}
                        disabled={isSaving || !code?.trim()}
                        whileHover={!isSaving ? { scale: 1.03 } : {}}
                        whileTap={!isSaving ? { scale: 0.97 } : {}}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                            'relative flex items-center gap-2 h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-widest',
                            'bg-[#161b22] border border-[#30363d] text-slate-300',
                            'hover:border-[#388bfd]/60 hover:bg-[#1f2937] hover:text-white',
                            'disabled:opacity-40 disabled:cursor-not-allowed',
                            'transition-all duration-200 overflow-hidden group'
                        )}
                        title={`Save to GitHub as ${derivedFolder}/${derivedFilename}`}
                    >
                        {/* Subtle glow on hover */}
                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-[#388bfd]/5" />

                        {isSaving
                            ? <Loader2 size={13} className="animate-spin text-[#388bfd]" />
                            : <Github size={13} className="text-slate-400 group-hover:text-white transition-colors" />
                        }
                        {isSaving ? 'Saving…' : 'Save to GitHub'}
                        {!isSaving && <GitCommit size={9} className="opacity-30 group-hover:opacity-70" />}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Connected status badge */}
            {!compact && (
                <div className="flex items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity" title={`Connected as @${profile.username}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest hidden lg:block">
                        @{profile.username}
                    </span>
                </div>
            )}
        </div>
    );
};

// ── File extension helper ──
function getExt(language: string): string {
    const map: Record<string, string> = {
        python: '.py',
        javascript: '.js',
        typescript: '.ts',
        java: '.java',
        c: '.c',
        cpp: '.cpp',
        sql: '.sql',
        html: '.html',
        css: '.css',
    };
    return map[language?.toLowerCase()] || '.txt';
}

export default GitHubSaveButton;
