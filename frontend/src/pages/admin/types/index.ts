// Role Types
export type UserRole = 'student' | 'university_admin' | 'super_admin';

// User Types
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    universityId?: string;
    githubConnected?: boolean;
    githubUsername?: string;
}

// University Types
export interface University {
    id: string;
    name: string;
    slug: string;
    domain: string;
    logo?: string;
    plan: 'starter' | 'university' | 'enterprise';
    status: 'active' | 'suspended' | 'pending';
    studentCount: number;
    courseCount: number;
    createdAt: string;
}

// Course Types
export interface Course {
    id: string;
    universityId: string;
    title: string;
    description: string;
    thumbnail?: string;
    instructor: string;
    modules: Module[];
    totalLessons: number;
    totalAssignments: number;
    duration: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    status: 'draft' | 'published' | 'archived';
    enrolledCount: number;
    aiEnabled: boolean;
    createdAt: string;
}

export interface Module {
    id: string;
    title: string;
    description?: string;
    order: number;
    lessons: Lesson[];
    completed?: boolean;
}

export interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'text' | 'code' | 'quiz' | 'assignment';
    duration: string;
    content?: string;
    code?: string;
    language?: string;
    completed?: boolean;
    locked?: boolean;
}

// Assignment Types
export interface Assignment {
    id: string;
    courseId: string;
    moduleId: string;
    lessonId: string;
    title: string;
    description: string;
    instructions: string;
    dueDate: string;
    maxPoints: number;
    githubRepo?: string;
    submissions: Submission[];
}

export interface Submission {
    id: string;
    assignmentId: string;
    studentId: string;
    studentName: string;
    content: string;
    githubCommit?: string;
    githubBranch?: string;
    aiFeedback?: string;
    grade?: number;
    feedback?: string;
    status: 'submitted' | 'graded' | 'resubmit';
    submittedAt: string;
    gradedAt?: string;
}

// AI Tutor Types
export interface AIContext {
    courseId?: string;
    courseName?: string;
    moduleId?: string;
    moduleTitle?: string;
    lessonId?: string;
    lessonTitle?: string;
    studentLevel?: 'beginner' | 'intermediate' | 'advanced';
    currentCode?: string;
    assignmentInstructions?: string;
}

export interface AIMessage {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: string;
    actions?: AIAction[];
}

export interface AIAction {
    label: string;
    action: string;
}

// Analytics Types
export interface AnalyticsData {
    activeStudents: number;
    totalStudents: number;
    completionRate: number;
    avgSessionTime: number;
    aiInteractions: number;
    submissionsToday: number;
    courseProgress: CourseProgress[];
    weeklyActivity: ActivityPoint[];
}

export interface CourseProgress {
    courseId: string;
    courseName: string;
    enrolled: number;
    completed: number;
    inProgress: number;
    avgProgress: number;
}

export interface ActivityPoint {
    date: string;
    students: number;
    assignments: number;
    aiChats: number;
}

// GitHub Types
export interface GitHubRepo {
    id: string;
    name: string;
    fullName: string;
    url: string;
    defaultBranch: string;
}

export interface GitHubCommit {
    sha: string;
    message: string;
    author: string;
    date: string;
    additions: number;
    deletions: number;
}

// Dashboard Widget Types
export interface DashboardWidget {
    id: string;
    type: 'stat' | 'chart' | 'list' | 'progress';
    title: string;
    data: unknown;
}

// Navigation Types
export interface NavItem {
    label: string;
    icon: string;
    href: string;
    badge?: number;
    active?: boolean;
}
