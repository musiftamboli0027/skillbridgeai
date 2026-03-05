/**
 * githubService.js
 * ─────────────────────────────────────────────────────────────────────
 * Pure service layer that wraps GitHub REST API (v3).
 * Uses axios so we stay consistent with the rest of the codebase.
 * ─────────────────────────────────────────────────────────────────────
 */
const axios = require('axios');

const GH_API = 'https://api.github.com';
const PORTFOLIO_REPO = 'skillbridge-portfolio';

// Preset folder structure created on first push
const DEFAULT_FOLDERS = ['python', 'dsa', 'projects', 'ai-labs'];

/**
 * Authenticated GitHub API client for a given access token.
 */
function ghClient(accessToken) {
    return axios.create({
        baseURL: GH_API,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'SkillBridge-App'
        }
    });
}

/**
 * Fetch the authenticated user's GitHub profile.
 */
async function getAuthenticatedUser(accessToken) {
    const client = ghClient(accessToken);
    const { data } = await client.get('/user');
    return data;
}

/**
 * Ensure the skillbridge-portfolio repo exists.
 * Creates it with the default folder structure if it doesn't.
 * Returns the repo object.
 */
async function ensurePortfolioRepo(accessToken) {
    const client = ghClient(accessToken);
    const user = await getAuthenticatedUser(accessToken);
    const owner = user.login;

    // ── Try to get the repo ──
    try {
        const { data: repo } = await client.get(`/repos/${owner}/${PORTFOLIO_REPO}`);
        return { repo, owner, created: false };
    } catch (err) {
        if (err.response?.status !== 404) throw err;
    }

    // ── Create the repo ──
    const { data: newRepo } = await client.post('/user/repos', {
        name: PORTFOLIO_REPO,
        description: '📚 My SkillBridge learning portfolio — code saved directly from the IDE.',
        private: false,
        auto_init: true,      // creates initial commit with README
        has_issues: true,
        has_projects: false,
        has_wiki: false
    });

    // Give GitHub a moment to initialise the repo
    await new Promise(r => setTimeout(r, 1500));

    // ── Create default folder structure via .gitkeep files ──
    for (const folder of DEFAULT_FOLDERS) {
        try {
            await upsertFile({
                accessToken,
                owner,
                repo: PORTFOLIO_REPO,
                filePath: `${folder}/.gitkeep`,
                content: '',
                commitMessage: `chore: initialise ${folder}/ folder`
            });
        } catch (_) {
            // Non-fatal — folder may already exist if repo was re-created
        }
    }

    return { repo: newRepo, owner, created: true };
}

/**
 * Create or update a single file in a GitHub repo.
 *
 * @param {object} opts
 * @param {string} opts.accessToken
 * @param {string} opts.owner          - GitHub username
 * @param {string} opts.repo           - Repo name
 * @param {string} opts.filePath       - e.g. "python/hello.py"
 * @param {string} opts.content        - Raw file content (will be Base64-encoded)
 * @param {string} opts.commitMessage
 * @returns GitHub API response data
 */
async function upsertFile({ accessToken, owner, repo, filePath, content, commitMessage }) {
    const client = ghClient(accessToken);
    const encodedContent = Buffer.from(content, 'utf-8').toString('base64');
    const apiPath = `/repos/${owner}/${repo}/contents/${filePath}`;

    // ── Check if file already exists (need its SHA to update) ──
    let existingSha = null;
    try {
        const { data: existing } = await client.get(apiPath);
        existingSha = existing.sha;
    } catch (err) {
        if (err.response?.status !== 404) throw err;
        // 404 → new file, no SHA needed
    }

    const payload = {
        message: commitMessage,
        content: encodedContent,
        ...(existingSha ? { sha: existingSha } : {})
    };

    const { data } = await client.put(apiPath, payload);
    return data;
}

/**
 * Fetch recent commits from the portfolio repo (for history tracking).
 */
async function getCommitHistory(accessToken, owner, limit = 20) {
    const client = ghClient(accessToken);
    try {
        const { data } = await client.get(`/repos/${owner}/${PORTFOLIO_REPO}/commits`, {
            params: { per_page: limit }
        });
        return data.map(c => ({
            sha: c.sha.slice(0, 7),
            message: c.commit.message,
            date: c.commit.committer.date,
            url: c.html_url
        }));
    } catch (_) {
        return [];
    }
}

/**
 * Handle GitHub API rate-limit errors gracefully.
 */
function parseGitHubError(err) {
    const status = err.response?.status;
    const msg = err.response?.data?.message || err.message;

    if (status === 401) return { code: 'TOKEN_INVALID', message: 'GitHub token is invalid or expired. Please reconnect.' };
    if (status === 403 && msg.includes('rate limit')) return { code: 'RATE_LIMITED', message: 'GitHub API rate limit reached. Please try again in an hour.' };
    if (status === 403) return { code: 'FORBIDDEN', message: 'Permission denied. Ensure the token has "repo" scope.' };
    if (status === 404) return { code: 'NOT_FOUND', message: msg };
    if (status === 422) return { code: 'VALIDATION', message: msg };

    return { code: 'UNKNOWN', message: msg || 'Unknown GitHub API error' };
}

module.exports = {
    getAuthenticatedUser,
    ensurePortfolioRepo,
    upsertFile,
    getCommitHistory,
    parseGitHubError,
    PORTFOLIO_REPO
};
