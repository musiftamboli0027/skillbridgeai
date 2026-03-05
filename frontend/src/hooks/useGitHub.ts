/**
 * useGitHub.ts
 * ─────────────────────────────────────────────────────────────────────
 * Custom hook that manages the full GitHub integration lifecycle:
 *  - Fetching connection status
 *  - Initiating OAuth flow
 *  - Saving code to GitHub
 *  - Disconnecting
 * ─────────────────────────────────────────────────────────────────────
 */
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { toast } from 'sonner';

interface GitHubProfile {
    isConnected: boolean;
    username?: string;
    avatarUrl?: string;
    connectedAt?: string;
    totalCommits?: number;
    lastCommitAt?: string;
    repoUrl?: string;
}

interface SaveCodeOptions {
    filename: string;
    folder?: string;
    code: string;
    commitMessage?: string;
    language?: string;
}

interface SaveCodeResult {
    success: boolean;
    message: string;
    data?: {
        filePath: string;
        repoUrl: string;
        fileUrl: string;
        commitSha: string;
        commitUrl: string;
    };
}

export function useGitHub() {
    const [profile, setProfile] = useState<GitHubProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    // ── Fetch current connection status ──
    const fetchProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await api.getGitHubProfile();
            setProfile(data);
        } catch (_) {
            setProfile({ isConnected: false });
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ── On mount: check profile + handle OAuth callback query param ──
    useEffect(() => {
        fetchProfile();

        // Handle redirect back from GitHub OAuth
        const hash = window.location.hash;
        if (hash.includes('github=connected')) {
            toast.success('✅ GitHub connected successfully!');
            // Clean up URL
            window.history.replaceState(
                null,
                '',
                window.location.pathname + window.location.search +
                '#' + hash.split('?')[0].replace('#', '')
            );
            fetchProfile();
        } else if (hash.includes('github=error')) {
            const reason = new URLSearchParams(hash.split('?')[1] || '').get('reason');
            const messages: Record<string, string> = {
                email_mismatch: 'GitHub email does not match your SkillBridge account email.',
                expired_state: 'OAuth session expired. Please try connecting again.',
                token_exchange: 'Failed to obtain access token from GitHub.',
                missing_params: 'Invalid OAuth response.',
                user_not_found: 'User session not found. Please log in again.',
            };
            toast.error(messages[reason || ''] || 'GitHub connection failed. Please try again.');
        }
    }, [fetchProfile]);

    // ── Initiate OAuth flow ──
    const connect = useCallback(async () => {
        try {
            setIsConnecting(true);
            const { url } = await api.getGitHubAuthUrl();
            // Full-page redirect to GitHub
            window.location.href = url;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to start GitHub OAuth.';
            toast.error(msg);
            setIsConnecting(false);
        }
    }, []);

    // ── Disconnect ──
    const disconnect = useCallback(async () => {
        try {
            await api.disconnectGitHub();
            setProfile({ isConnected: false });
            toast.success('GitHub disconnected.');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to disconnect GitHub.';
            toast.error(msg);
        }
    }, []);

    // ── Save code to GitHub ──
    const saveCode = useCallback(async (opts: SaveCodeOptions): Promise<SaveCodeResult> => {
        if (!profile?.isConnected) {
            toast.error('Connect your GitHub account first.');
            return { success: false, message: 'GitHub not connected.' };
        }

        try {
            setIsSaving(true);
            const result = await api.saveCodeToGitHub({
                filename: opts.filename,
                folder: opts.folder || 'python',
                code: opts.code,
                commitMessage: opts.commitMessage,
                language: opts.language
            });

            if (result.success) {
                toast.success(result.message || '✅ Saved to GitHub!', {
                    description: result.data?.fileUrl
                        ? `View: ${result.data.fileUrl}`
                        : undefined,
                    action: result.data?.fileUrl
                        ? {
                            label: 'Open',
                            onClick: () => window.open(result.data!.fileUrl, '_blank')
                        }
                        : undefined
                });
                // Refresh commit count
                fetchProfile();
            }

            return result;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save to GitHub.';

            if (msg.includes('not connected') || msg.includes('TOKEN_INVALID')) {
                toast.error('GitHub token expired. Please reconnect.', {
                    action: { label: 'Reconnect', onClick: connect }
                });
                setProfile({ isConnected: false });
            } else if (msg.includes('RATE_LIMITED')) {
                toast.error('GitHub API rate limit reached. Try again in an hour.');
            } else {
                toast.error(msg);
            }

            return { success: false, message: msg };
        } finally {
            setIsSaving(false);
        }
    }, [profile, connect, fetchProfile]);

    return {
        profile,
        isLoading,
        isSaving,
        isConnecting,
        connect,
        disconnect,
        saveCode,
        refresh: fetchProfile
    };
}
