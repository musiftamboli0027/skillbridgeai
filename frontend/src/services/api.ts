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

    async register(userData: { email: string; password: string; name: string; role?: string }) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: userData.email,
                password: userData.password,
                name: userData.name,
                role: userData.role || 'student'
            }),
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

    async updateLessonProgress(enrollmentId: string, progressData: { moduleId: string, lessonId: string, watchTime?: number, duration?: number }) {
        return this.request(`/enrollments/${enrollmentId}/progress`, {
            method: 'PUT',
            body: JSON.stringify(progressData),
        });
    }

    // New Progress Sync
    async syncVideoProgress(courseId: string, lessonId: string, secondsWatched: number) {
        return this.request('/progress/video', {
            method: 'POST',
            body: JSON.stringify({ courseId, lessonId, secondsWatched }),
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

    // GitHub Integration
    getGithubAuthUrl(token: string) {
        // Returns the full URL to redirect to for GitHub OAuth
        return `${API_URL}/auth/github?action=link&token=${token}`;
    }

    async unlinkGithub() {
        return this.request('/users/profile/github', {
            method: 'DELETE'
        });
    }


}

export const api = new ApiService();
