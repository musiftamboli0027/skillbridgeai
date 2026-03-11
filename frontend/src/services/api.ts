import axios, { type AxiosRequestConfig } from "axios";

/*
  SkillBridge Frontend API Service
  Production-ready Axios wrapper that always returns response.data
*/

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* -------------------------------------------------- */
/* Axios Client */
/* -------------------------------------------------- */

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* -------------------------------------------------- */
/* Request Interceptor (Attach JWT Token) */
/* -------------------------------------------------- */

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("skillbridge_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* -------------------------------------------------- */
/* Response Interceptor */
/* -------------------------------------------------- */

client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data;
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("skillbridge_token");
      localStorage.removeItem("skillbridge_user");

      if (!window.location.hash.includes("/login")) {
        window.location.href = "/#/login?error=session_expired";
      }
    }

    return Promise.reject(data || { message: "Something went wrong" });
  }
);

/* -------------------------------------------------- */
/* Generic API Wrapper */
/* -------------------------------------------------- */

const request = {
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    client.get(url, config) as unknown as Promise<T>,

  post: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => client.post(url, data, config) as unknown as Promise<T>,

  put: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => client.put(url, data, config) as unknown as Promise<T>,

  patch: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => client.patch(url, data, config) as unknown as Promise<T>,

  delete: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => client.delete(url, config) as unknown as Promise<T>,
};

/* -------------------------------------------------- */
/* SkillBridge API Endpoints */
/* -------------------------------------------------- */

export const api = {
  /* ---------- Universities ---------- */

  getUniversities: () => request.get("/api/universities"),
  getColleges: (universityId: string) =>
    request.get(`/api/colleges/${universityId}`),

  /* ---------- Auth ---------- */

  login: (credentials: any) => request.post("/api/auth/login", credentials),
  register: (data: any) => request.post("/api/auth/register", data),
  getMe: () => request.get("/api/auth/me"),
  verifyEmail: (token: string, email: string) =>
    request.get(`/api/auth/verify-email?token=${token}&email=${email}`),

  resendVerification: (email: string) =>
    request.post("/api/auth/resend-verification", { email }),

  forgotPassword: (email: string) =>
    request.post("/api/auth/forgot-password", { email }),

  resetPassword: (data: any) =>
    request.post("/api/auth/reset-password", data),

  /* ---------- Courses ---------- */

  getCourses: (params = "") => request.get(`/api/courses${params}`),
  getCourse: (id: string) => request.get(`/api/courses/${id}`),
  getFeaturedCourses: () => request.get("/api/courses/featured/list"),

  approveCourse: (id: string) => request.patch(`/api/courses/${id}/approve`),
  rejectCourse: (id: string, reason: string) => 
    request.patch(`/api/courses/${id}/reject`, { reason }),

  createCourse: (courseData: any) => request.post("/api/courses", courseData),
  updateCourse: (id: string, courseData: any) => request.put(`/api/courses/${id}`, courseData),
  deleteCourse: (id: string) => request.delete(`/api/courses/${id}`),

  /* ---------- Enrollments ---------- */

  enroll: (courseId: string) =>
    request.post("/api/enrollments", { courseId }),

  getMyEnrollments: () => request.get("/api/enrollments/my"),
  
  getAllEnrollments: () => request.get("/api/enrollments"),

  updateLessonProgress: (enrollmentId: string, progressData: any) =>
    request.put(`/api/enrollments/${enrollmentId}/progress`, progressData),

  /* ---------- Progress ---------- */

  completeLesson: (courseId: string, lessonId: string, moduleId: string) =>
    request.post("/api/progress/complete", { courseId, lessonId, moduleId }),

  getCourseProgress: (courseId: string) => request.get(`/api/progress/${courseId}`),

  /* ---------- Assignments ---------- */

  getAssignment: (id: string) => request.get(`/api/assignments/${id}`),
  
  submitCodingAssignment: (lessonId: string, submission: any) =>
    request.post(`/api/assignments/${lessonId}/submit/coding`, submission),

  submitQuizAssignment: (lessonId: string, submission: any) =>
    request.post(`/api/assignments/${lessonId}/submit/quiz`, submission),

  /* ---------- Payments ---------- */

  createPaymentOrder: (courseId: string) =>
    request.post("/api/payments/create-order", { courseId }),

  verifyPayment: (paymentData: any) =>
    request.post("/api/payments/verify", paymentData),
    
  getAllPayments: () => request.get("/api/payments"),

  /* ---------- Users & Stats ---------- */

  getStudents: () => request.get("/api/users/students"),
  
  getAdminStats: async () => {
    const [enrollmentStats, paymentAnalytics]: [any, any] = await Promise.all([
      request.get("/api/enrollments/stats"),
      request.get("/api/payments/analytics")
    ]);
    return {
      enrollment: enrollmentStats.stats,
      payment: paymentAnalytics.data
    };
  },

  getDashboardStats: () => request.get("/api/users/dashboard"),
  
  updateProfile: (profileData: any) => request.put("/api/users/profile", profileData),
  
  changePassword: (data: any) => request.put("/api/users/change-password", data),
  
  toggleTwoFactor: () => request.put("/api/users/two-factor"),
  
  updateNotificationSettings: (data: any) => request.put("/api/users/notification-settings", data),

  /* ---------- Notifications ---------- */

  getNotifications: () => request.get("/api/notifications"),
  
  markNotificationRead: (id: string) => request.put(`/api/notifications/${id}/read`),
  
  markAllNotificationsRead: () => request.put("/api/notifications/read-all"),
  
  deleteNotification: (id: string) => request.delete(`/api/notifications/${id}`),

  /* ---------- GitHub ---------- */

  getGitHubProfile: () => request.get("/api/github/profile"),
  
  getGitHubAuthUrl: () => request.get("/api/github/auth-url"),
  
  saveCodeToGitHub: (data: any) => request.post("/api/github/save-code", data),
  
  disconnectGitHub: () => request.post("/api/github/disconnect"),
  
  getGitHubCommitHistory: () => request.get("/api/github/commit-history"),
  
  getGitHubRepos: () => request.get("/api/github/repos"),
  
  getGitHubActivity: () => request.get("/api/github/activity"),

  /* ---------- AI ---------- */

  getAIDebugFeedback: (data: any) =>
    request.post("/api/ai/debug", data),

  getAITutorChat: (data: any) =>
    request.post("/api/ai/chat", data),

  getAITutorChatLyzr: (data: any) =>
    request.post("/api/ai/tutor", data),

  generateRoadmap: (data: any) =>
    request.post("/api/ai/roadmap/generate", data),

  getSavedRoadmap: () =>
    request.get("/api/ai/roadmap"),

  /* ---------- Career & Skills ---------- */

  getCareerPaths: () => request.get("/api/career/paths"),
  
  getSkillTracker: () => request.get("/api/career/tracker"),
  
  selectCareerPath: (careerPathId: string) =>
    request.post("/api/career/select", { careerPathId }),
    
  updateCareerProgress: (progressData: any) =>
    request.put("/api/career/progress", progressData),
    
  getSkillAnalytics: () => request.get("/api/career/analytics"),
  
  updateUserSkills: (data: any) => request.put("/api/career/skills", data),

  /* ---------- Communication ---------- */

  getCommunicationSessions: () => request.get("/api/communication/sessions"),
  
  getResumeTips: () => request.get("/api/communication/resume-tips"),

  /* ---------- Hub & Internships ---------- */

  getInternships: () => request.get("/api/hub/internships"),
  
  applyForInternship: (id: string) => request.post(`/api/hub/internships/${id}/apply`),
  
  getGroups: () => request.get("/api/hub/groups"),
  
  createGroup: (data: any) => request.post("/api/hub/groups", data),
  
  getHubProjects: () => request.get("/api/hub/projects"),
  
  createHubProject: (data: any) => request.post("/api/hub/projects", data),

  /* ---------- Placement ---------- */

  getPlacementStats: () => request.get("/api/placement/dashboard"),
  
  getAptitudeTests: () => request.get("/api/placement/tests"),
  
  submitAptitudeResult: (testId: string, data: any) =>
    request.post(`/api/placement/tests/${testId}/submit`, data),
    
  submitInterviewSession: (data: any) =>
    request.post("/api/placement/interviews", data),

  /* ---------- Collaboration ---------- */

  getCollabDashboard: () => request.get("/api/collaboration/dashboard"),
  
  getCollabProjects: (params = "") => request.get(`/api/collaboration/projects${params}`),
  
  getCollabProject: (id: string) => request.get(`/api/collaboration/projects/${id}`),
  
  createCollabProject: (data: any) => request.post("/api/collaboration/projects", data),
  
  updateProjectStatus: (id: string, data: any) =>
    request.patch(`/api/collaboration/projects/${id}/status`, data),
    
  addMentorFeedback: (id: string, data: any) =>
    request.post(`/api/collaboration/projects/${id}/feedback`, data),
    
  calculateProjectScore: (id: string) => request.post(`/api/collaboration/projects/${id}/score`),
  
  createTeam: (data: any) => request.post("/api/collaboration/teams", data),
  
  getMyTeam: () => request.get("/api/collaboration/teams/my"),
  
  getCollabTeam: (id: string) => request.get(`/api/collaboration/teams/${id}`),
  
  requestJoinTeam: (teamId: string, data: any) =>
    request.post(`/api/collaboration/teams/${teamId}/join`, data),
    
  approveMember: (teamId: string, data: any) =>
    request.patch(`/api/collaboration/teams/${teamId}/approve-member`, data),
    
  activateTeam: (teamId: string) => request.patch(`/api/collaboration/teams/${teamId}/activate`),
  
  createSprint: (data: any) => request.post("/api/collaboration/sprints", data),
  
  getSprints: (teamId: string) => request.get(`/api/collaboration/sprints/${teamId}`),
  
  addSprintTask: (sprintId: string, data: any) =>
    request.post(`/api/collaboration/sprints/${sprintId}/tasks`, data),
    
  updateSprintTask: (sprintId: string, taskId: string, data: any) =>
    request.patch(`/api/collaboration/sprints/${sprintId}/tasks/${taskId}`, data),
    
  completeSprint: (sprintId: string) => request.patch(`/api/collaboration/sprints/${sprintId}/complete`),
  
  getContributions: (teamId: string) => request.get(`/api/collaboration/contributions/${teamId}`),
  
  getMyCollabAnalytics: () => request.get("/api/collaboration/analytics/my"),
  
  getCollabLeaderboard: () => request.get("/api/collaboration/leaderboard"),

  /* ---------- Community ---------- */

  getCommunityPublicFeed: (params = "") => request.get(`/api/community/public${params}`),
  
  getCommunityLeaderboard: (domain?: string) =>
    request.get(`/api/community/leaderboard${domain ? `?domain=${domain}` : ""}`),
    
  getCommunityFeed: (params = "") => request.get(`/api/community/feed${params}`),
  
  getCommunityStats: () => request.get("/api/community/stats"),
  
  getMyPosts: () => request.get("/api/community/my-posts"),
  
  createCommunityPost: (data: any) => request.post("/api/community/create", data),
  
  togglePostLike: (postId: string) => request.post(`/api/community/like/${postId}`),
  
  togglePostSave: (postId: string) => request.post(`/api/community/save/${postId}`),
  
  addPostComment: (postId: string, content: string) =>
    request.post(`/api/community/comment/${postId}`, { content }),
    
  getPostComments: (postId: string) => request.get(`/api/community/comments/${postId}`),
  
  upvoteComment: (commentId: string) => request.post(`/api/community/comment/${commentId}/upvote`),
  
  acceptAnswer: (commentId: string) => request.patch(`/api/community/accept-answer/${commentId}`),
  
  reportPost: (postId: string, reason: string) =>
    request.post("/api/community/report", { postId, reason }),
    
  deleteCommunityPost: (postId: string) => request.delete(`/api/community/${postId}`),

  /* ---------- Jobs & Hiring ---------- */

  getPublicJobs: (params?: any) => {
    const q = new URLSearchParams();
    if (params?.domain) q.set("domain", params.domain);
    if (params?.type) q.set("type", params.type);
    if (params?.level) q.set("level", params.level);
    if (params?.page) q.set("page", String(params.page));
    return request.get(`/api/jobs/public?${q.toString()}`);
  },

  getJobDetail: (id: string) => request.get(`/api/jobs/detail/${id}`),
  
  browseJobs: (params?: any) => {
    const q = new URLSearchParams();
    if (params?.domain) q.set("domain", params.domain);
    if (params?.type) q.set("type", params.type);
    if (params?.level) q.set("level", params.level);
    if (params?.search) q.set("search", params.search);
    if (params?.page) q.set("page", String(params.page));
    return request.get(`/api/jobs/browse?${q.toString()}`);
  },

  applyToJob: (jobId: string, data: any) =>
    request.post(`/api/jobs/apply/${jobId}`, data),
    
  getMyApplications: () => request.get("/api/jobs/my-applications"),
  
  createJob: (data: any) => request.post("/api/jobs/create", data),
  
  getRecruiterJobs: () => request.get("/api/jobs/recruiter"),
  
  getJobApplicants: (jobId: string, sort?: string) =>
    request.get(`/api/jobs/applicants/${jobId}?sort=${sort || "newest"}`),
    
  updateApplicationStatus: (applicationId: string, data: any) =>
    request.patch(`/api/jobs/application-status/${applicationId}`, data),
    
  updateJobStatus: (jobId: string, status: string) =>
    request.patch(`/api/jobs/status/${jobId}`, { status }),

  /* ---------- Admin Recruiter Mgt ---------- */

  getAdminRecruiters: () => request.get("/api/jobs/admin/recruiters"),
  
  verifyRecruiter: (userId: string, action: string) =>
    request.patch(`/api/jobs/verify-recruiter/${userId}`, { action }),
};

export default api;
