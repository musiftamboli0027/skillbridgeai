const { Octokit } = require('@octokit/rest');

/**
 * Pushes assignment submission to a GitHub repository
 * @param {string} accessToken - GitHub Access Token
 * @param {string} username - GitHub Username
 * @param {string} repoName - Repository Name
 * @param {string} filePath - Path in repo (e.g. assignments/week1/submission.md)
 * @param {string} content - Content to push
 * @param {string} commitMessage - Commit message
 */
exports.pushToGitHub = async (accessToken, username, repoName, filePath, content, commitMessage) => {
    const octokit = new Octokit({ auth: accessToken });

    try {
        // 1. Ensure repo exists, or create it
        try {
            await octokit.rest.repos.get({
                owner: username,
                repo: repoName
            });
        } catch (error) {
            if (error.status === 404) {
                // Create private repo if it doesn't exist
                await octokit.rest.repos.createForAuthenticatedUser({
                    name: repoName,
                    private: true,
                    auto_init: true,
                    description: 'SkillBridge AI Course Assignments'
                });
                // Wait a bit for GitHub to initialize the repo
                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                throw error;
            }
        }

        // 2. Get file SHA if it exists (to update instead of create)
        let sha;
        try {
            const { data } = await octokit.rest.repos.getContent({
                owner: username,
                repo: repoName,
                path: filePath
            });
            sha = data.sha;
        } catch (error) {
            // File doesn't exist, which is fine for first commit
        }

        // 3. Create or update file
        const result = await octokit.rest.repos.createOrUpdateFileContents({
            owner: username,
            repo: repoName,
            path: filePath,
            message: commitMessage,
            content: Buffer.from(content).toString('base64'),
            sha: sha
        });

        return result.data;
    } catch (error) {
        console.error('GitHub Push Error:', error.message);
        throw new Error('Failed to push to GitHub: ' + error.message);
    }
};
