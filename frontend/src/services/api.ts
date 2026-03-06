/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
    private async request(endpoint: string, options: RequestInit = {}) {
        const token = localStorage.getItem('skillbridge_token');

        const headers: Record<string, string> = {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...((options.headers as Record<string, string>) || {}),
        };

        // Don't set Content-Type for FormData (browser does it automatically with boundary)
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (response.status === 401) {
            // Check if this is a "not verified" response - don't clear tokens for this
            if (data.notVerified) {
                throw new Error(data.message || 'Account not verified');
            }

            localStorage.removeItem('skillbridge_token');
            localStorage.removeItem('skillbridge_user');

            // Only redirect if we're not already trying to login
            const isLoginPath = window.location.hash.includes('/login');
            if (!isLoginPath) {
                window.location.href = '/#/login?error=Session expired';
                // Force a reload to clear all React state if needed
                window.location.reload();
            }
        }

        if (!response.ok) {
            throw new Error(data.detail || data.message || 'Something went wrong');
        }

        return data;
    }

    // Auth - Updated for Node.js backend
    async login(credentials: { email: string; password: string }) {
        // Node.js backend expects JSON body
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password
            }),
        });

        // Node.js returns {success, token, user}
        return {
            success: data.success,
            token: data.token,
            user: data.user
        };
    }

    async register(userData: any) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getMe() {
        return this.request('/auth/me');
    }

    async verifyEmail(token: string, email: string) {
        // Node.js backend uses GET with query params
        return this.request(`/auth/verify-email?token=${token}&email=${email}`);
    }

    async resendVerification(email: string) {
        return this.request('/auth/resend-verification', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async forgotPassword(email: string) {
        return this.request('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(data: { token: string; email: string; password: string }) {
        return this.request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Courses
    async getCourses(params: string = '') {
        return this.request(`/courses${params}`);
    }

    async getCourse(id: string) {
        return this.request(`/courses/${id}`);
    }

    async getFeaturedCourses() {
        return this.request('/courses/featured/list');
    }

    // Enrollments
    async enroll(courseId: string) {
        return this.request('/enrollments', {
            method: 'POST',
            body: JSON.stringify({ courseId }),
        });
    }

    async getMyEnrollments() {
        return this.request('/enrollments/my');
    }

    async updateLessonProgress(enrollmentId: string, progressData: { moduleId: string, lessonId: string, duration?: number }) {
        return this.request(`/enrollments/${enrollmentId}/progress`, {
            method: 'PUT',
            body: JSON.stringify(progressData),
        });
    }


    async completeLesson(courseId: string, lessonId: string, moduleId: string) {
        return this.request('/progress/complete', {
            method: 'POST',
            body: JSON.stringify({ courseId, lessonId, moduleId }),
        });
    }

    async getCourseProgress(courseId: string) {
        return this.request(`/progress/${courseId}`);
    }

    // Assignments
    async getAssignment(id: string) {
        return this.request(`/assignments/${id}`);
    }

    async submitCodingAssignment(lessonId: string, submission: { code: string, language: string, courseId: string, moduleId: string }) {
        return this.request(`/assignments/${lessonId}/submit/coding`, {
            method: 'POST',
            body: JSON.stringify(submission),
        });
    }

    async submitQuizAssignment(lessonId: string, submission: { answers: Record<number, number>, courseId: string, moduleId: string }) {
        return this.request(`/assignments/${lessonId}/submit/quiz`, {
            method: 'POST',
            body: JSON.stringify(submission),
        });
    }

    // Payments
    async createPaymentOrder(courseId: string) {
        return this.request('/payments/create-order', {
            method: 'POST',
            body: JSON.stringify({ courseId }),
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async verifyPayment(paymentData: any) {
        return this.request('/payments/verify', {
            method: 'POST',
            body: JSON.stringify(paymentData),
        });
    }

    // Admin - Courses
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async createCourse(courseData: any) {
        return this.request('/courses', {
            method: 'POST',
            body: JSON.stringify(courseData),
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async updateCourse(id: string, courseData: any) {
        return this.request(`/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(courseData),
        });
    }

    async deleteCourse(id: string) {
        return this.request(`/courses/${id}`, {
            method: 'DELETE',
        });
    }

    // Admin - Students
    async getStudents() {
        return this.request('/users/students');
    }

    // Admin - Stats & Analytics
    async getAdminStats() {
        const [enrollmentStats, paymentAnalytics] = await Promise.all([
            this.request('/enrollments/stats'),
            this.request('/payments/analytics')
        ]);
        return {
            enrollment: enrollmentStats.stats,
            payment: paymentAnalytics.data
        };
    }

    async getAllEnrollments() {
        return this.request('/enrollments');
    }

    async getAllPayments() {
        return this.request('/payments');
    }

    // User Profile & Stats
    async getDashboardStats() {
        return this.request('/users/dashboard');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async updateProfile(profileData: any) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    async changePassword(data: any) {
        return this.request('/users/change-password', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async toggleTwoFactor() {
        return this.request('/users/two-factor', {
            method: 'PUT',
        });
    }

    async updateNotificationSettings(data: any) {
        return this.request('/users/notification-settings', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async getNotifications() {
        return this.request('/notifications');
    }

    async markNotificationRead(id: string) {
        return this.request(`/notifications/${id}/read`, {
            method: 'PUT',
        });
    }

    async markAllNotificationsRead() {
        return this.request('/notifications/read-all', {
            method: 'PUT',
        });
    }

    async deleteNotification(id: string) {
        return this.request(`/notifications/${id}`, {
            method: 'DELETE',
        });
    }

    // ── GitHub Integration ──────────────────────────────────────────
    /** GET /api/github/profile — check if GitHub is connected */
    async getGitHubProfile() {
        return this.request('/github/profile');
    }

    /** GET /api/github/auth-url — get OAuth URL to redirect user to GitHub */
    async getGitHubAuthUrl() {
        return this.request('/github/auth-url');
    }

    /** POST /api/github/save-code — push code file to skillbridge-portfolio */
    async saveCodeToGitHub(data: {
        filename: string;
        folder: string;
        code: string;
        commitMessage?: string;
        language?: string;
    }) {
        return this.request('/github/save-code', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /** POST /api/github/disconnect — unlink GitHub */
    async disconnectGitHub() {
        return this.request('/github/disconnect', { method: 'POST' });
    }

    /** GET /api/github/commit-history */
    async getGitHubCommitHistory() {
        return this.request('/github/commit-history');
    }

    /** GET /api/github/repos */
    async getGitHubRepos() {
        return this.request('/github/repos');
    }

    /** GET /api/github/activity */
    async getGitHubActivity() {
        return this.request('/github/activity');
    }

    async getAIDebugFeedback(data: { code: string, language: string, problemStatement: string, lessonTitle: string }) {
        return this.request('/ai/debug', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getAITutorChat(data: {
        message: string;
        conversationHistory?: { role: string; content: string }[];
        lessonTitle?: string;
        moduleTitle?: string;
        weekTitle?: string;
        courseTitle?: string;
        code?: string;
    }) {
        return this.request('/ai/chat', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * POST /api/ai/tutor — Lyzr Agent-powered AI Tutor
     * The API key is stored server-side only; never exposed to the browser.
     */
    async getAITutorLyzr(data: {
        message: string;
        sessionId?: string;
    }): Promise<{ success: boolean; reply?: string; source?: string; message?: string }> {
        return this.request('/ai/tutor', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async approveCourse(id: string) {
        return this.request(`/courses/${id}/approve`, {
            method: 'PATCH'
        });
    }

    async rejectCourse(id: string, reason: string) {
        return this.request(`/courses/${id}/reject`, {
            method: 'PATCH',
            body: JSON.stringify({ reason })
        });
    }

    // SaaS
    async getUniversities() {
        return this.request('/saas/universities');
    }

    async getColleges(universityId: string) {
        return this.request(`/saas/colleges/${universityId}`);
    }


    // Career & Skill Tracker
    async getCareerPaths() {
        return this.request('/career/paths');
    }

    async getSkillTracker() {
        return this.request('/career/tracker');
    }

    async selectCareerPath(careerPathId: string) {
        return this.request('/career/select', {
            method: 'POST',
            body: JSON.stringify({ careerPathId })
        });
    }

    async updateCareerProgress(progressData: any) {
        return this.request('/career/progress', {
            method: 'PUT',
            body: JSON.stringify(progressData)
        });
    }
    // Communication Skill Builder
    async getCommunicationSessions() {
        return this.request('/communication/sessions');
    }

    async getResumeTips() {
        return this.request('/communication/resume-tips');
    }

    // Internship & Community Hub
    async getInternships() {
        return this.request('/hub/internships');
    }

    async applyForInternship(id: string) {
        return this.request(`/hub/internships/${id}/apply`, { method: 'POST' });
    }

    async getGroups() {
        return this.request('/hub/groups');
    }

    async createGroup(data: any) {
        return this.request('/hub/groups', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async getHubProjects() {
        return this.request('/hub/projects');
    }

    async createHubProject(data: any) {
        return this.request('/hub/projects', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Placement System (4th Year)
    async getPlacementStats() {
        return this.request('/placement/dashboard');
    }

    async getAptitudeTests() {
        return this.request('/placement/tests');
    }

    async submitAptitudeResult(testId: string, data: any) {
        return this.request(`/placement/tests/${testId}/submit`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async submitInterviewSession(data: any) {
        return this.request('/placement/interviews', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // ── Collaboration Module ─────────────────────────────────────────
    async getCollabDashboard() {
        return this.request('/collaboration/dashboard');
    }

    async getCollabProjects(params: string = '') {
        return this.request(`/collaboration/projects${params}`);
    }

    async getCollabProject(id: string) {
        return this.request(`/collaboration/projects/${id}`);
    }

    async createCollabProject(data: any) {
        return this.request('/collaboration/projects', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateProjectStatus(id: string, data: { status: string; rejectionReason?: string }) {
        return this.request(`/collaboration/projects/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    async addMentorFeedback(id: string, data: { comment: string; score: number }) {
        return this.request(`/collaboration/projects/${id}/feedback`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async calculateProjectScore(id: string) {
        return this.request(`/collaboration/projects/${id}/score`, { method: 'POST' });
    }

    async createTeam(data: { name: string; projectId: string }) {
        return this.request('/collaboration/teams', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async getMyTeam() {
        return this.request('/collaboration/teams/my');
    }

    async getCollabTeam(id: string) {
        return this.request(`/collaboration/teams/${id}`);
    }

    async requestJoinTeam(teamId: string, data: { domain: string; role: string; message: string }) {
        return this.request(`/collaboration/teams/${teamId}/join`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async approveMember(teamId: string, data: { requestId: string; approved: boolean }) {
        return this.request(`/collaboration/teams/${teamId}/approve-member`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    async activateTeam(teamId: string) {
        return this.request(`/collaboration/teams/${teamId}/activate`, { method: 'PATCH' });
    }

    async createSprint(data: any) {
        return this.request('/collaboration/sprints', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async getSprints(teamId: string) {
        return this.request(`/collaboration/sprints/${teamId}`);
    }

    async addSprintTask(sprintId: string, data: any) {
        return this.request(`/collaboration/sprints/${sprintId}/tasks`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateSprintTask(sprintId: string, taskId: string, data: { status: string }) {
        return this.request(`/collaboration/sprints/${sprintId}/tasks/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    async completeSprint(sprintId: string) {
        return this.request(`/collaboration/sprints/${sprintId}/complete`, { method: 'PATCH' });
    }

    async getContributions(teamId: string) {
        return this.request(`/collaboration/contributions/${teamId}`);
    }

    async getMyCollabAnalytics() {
        return this.request('/collaboration/analytics/my');
    }

    async getCollabLeaderboard() {
        return this.request('/collaboration/leaderboard');
    }

    // ── Community Module ─────────────────────────────────────────────
    async getCommunityPublicFeed(params: string = '') {
        return this.request(`/community/public${params}`);
    }

    async getCommunityLeaderboard(domain?: string) {
        return this.request(`/community/leaderboard${domain ? `?domain=${domain}` : ''}`);
    }

    async getCommunityFeed(params: string = '') {
        return this.request(`/community/feed${params}`);
    }

    async getCommunityStats() {
        return this.request('/community/stats');
    }

    async getMyPosts() {
        return this.request('/community/my-posts');
    }

    async createCommunityPost(data: any) {
        return this.request('/community/create', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async togglePostLike(postId: string) {
        return this.request(`/community/like/${postId}`, { method: 'POST' });
    }

    async togglePostSave(postId: string) {
        return this.request(`/community/save/${postId}`, { method: 'POST' });
    }

    async addPostComment(postId: string, content: string) {
        return this.request(`/community/comment/${postId}`, {
            method: 'POST',
            body: JSON.stringify({ content })
        });
    }

    async getPostComments(postId: string) {
        return this.request(`/community/comments/${postId}`);
    }

    async upvoteComment(commentId: string) {
        return this.request(`/community/comment/${commentId}/upvote`, { method: 'POST' });
    }

    async acceptAnswer(commentId: string) {
        return this.request(`/community/accept-answer/${commentId}`, { method: 'PATCH' });
    }

    async reportPost(postId: string, reason: string) {
        return this.request('/community/report', {
            method: 'POST',
            body: JSON.stringify({ postId, reason })
        });
    }

    async deleteCommunityPost(postId: string) {
        return this.request(`/community/${postId}`, { method: 'DELETE' });
    }

    // ── AI Career Roadmap ────────────────────────────────────────────
    async generateRoadmap(data: { career: string; level: string; skills: string[]; hours: string; budget: string; goal: string }) {
        return this.request('/ai/roadmap/generate', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async getSavedRoadmap() {
        return this.request('/ai/roadmap');
    }

    // ── Skill Tracker ────────────────────────────────────────────────
    async getSkillAnalytics() {
        return this.request('/career/analytics');
    }

    async updateUserSkills(data: { primaryDomain?: string; secondarySkills?: string[]; domainLevel?: string }) {
        return this.request('/career/skills', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    // ── Jobs & Hiring ────────────────────────────────────────────────
    async getPublicJobs(params?: { domain?: string; type?: string; level?: string; page?: number }) {
        const q = new URLSearchParams();
        if (params?.domain) q.set('domain', params.domain);
        if (params?.type) q.set('type', params.type);
        if (params?.level) q.set('level', params.level);
        if (params?.page) q.set('page', String(params.page));
        return this.request(`/jobs/public?${q.toString()}`);
    }

    async getJobDetail(id: string) {
        return this.request(`/jobs/detail/${id}`);
    }

    async browseJobs(params?: { domain?: string; type?: string; level?: string; search?: string; page?: number }) {
        const q = new URLSearchParams();
        if (params?.domain) q.set('domain', params.domain);
        if (params?.type) q.set('type', params.type);
        if (params?.level) q.set('level', params.level);
        if (params?.search) q.set('search', params.search);
        if (params?.page) q.set('page', String(params.page));
        return this.request(`/jobs/browse?${q.toString()}`);
    }

    async applyToJob(jobId: string, data: { resumeLink?: string; portfolioLink?: string; githubLink?: string; coverLetter?: string }) {
        return this.request(`/jobs/apply/${jobId}`, { method: 'POST', body: JSON.stringify(data) });
    }

    async getMyApplications() {
        return this.request('/jobs/my-applications');
    }

    async createJob(data: Record<string, unknown>) {
        return this.request('/jobs/create', { method: 'POST', body: JSON.stringify(data) });
    }

    async getRecruiterJobs() {
        return this.request('/jobs/recruiter');
    }

    async getJobApplicants(jobId: string, sort?: string) {
        return this.request(`/jobs/applicants/${jobId}?sort=${sort || 'newest'}`);
    }

    async updateApplicationStatus(applicationId: string, data: { status: string; feedback?: string }) {
        return this.request(`/jobs/application-status/${applicationId}`, { method: 'PATCH', body: JSON.stringify(data) });
    }

    async updateJobStatus(jobId: string, status: string) {
        return this.request(`/jobs/status/${jobId}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    }

    // ── Admin Recruiter Management ──────────────────────────────────
    async getAdminRecruiters() {
        return this.request('/jobs/admin/recruiters');
    }

    async verifyRecruiter(userId: string, action: 'approve' | 'reject') {
        return this.request(`/jobs/verify-recruiter/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({ action })
        });
    }
}

export const api = new ApiService();
