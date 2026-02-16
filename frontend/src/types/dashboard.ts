export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'student' | 'instructor' | 'admin';
    level: number;
    xp: number;
    nextLevelXp: number;
    streak: number;
    rank: string;
    badges: Badge[];
}

export interface Badge {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    dateEarned: string;
}

export interface Course {
    id: string;
    title: string;
    instructor: string;
    thumbnail: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    category: string;
    lastAccessed: string;
    nextLesson: string;
}

export interface Assignment {
    id: string;
    title: string;
    course: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded' | 'late';
    priority: 'high' | 'medium' | 'low';
}

export interface LiveSession {
    id: string;
    topic: string;
    course: string;
    instructor: string;
    startTime: string;
    duration: string;
    joinUrl: string;
}

export interface StudyActivity {
    day: string;
    hours: number;
    tasksCompleted: number;
}

export interface PerformanceStat {
    subject: string;
    score: number;
    fullMark: number;
}

export interface Certificate {
    id: string;
    courseTitle: string;
    issueDate: string;
    credentialId: string;
    downloadUrl: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'assignment' | 'class' | 'system' | 'badge';
    timestamp: string;
    read: boolean;
}

export interface DashboardData {
    user: User;
    activeCourses: Course[];
    upcomingAssignments: Assignment[];
    liveSessions: LiveSession[];
    weeklyActivity: StudyActivity[];
    performance: PerformanceStat[];
    certificates: Certificate[];
    notifications: Notification[];
}
