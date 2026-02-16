import type { DashboardData } from '../types/dashboard';

export const MOCK_DASHBOARD_DATA: DashboardData = {
    user: {
        id: 'u1',
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop',
        role: 'student',
        level: 14,
        xp: 2450,
        nextLevelXp: 3000,
        streak: 12,
        rank: 'Elite Developer',
        badges: [
            { id: 'b1', name: 'Fast Learner', icon: 'Zap', color: 'orange', description: 'Completed 5 lessons in a day', dateEarned: '2024-01-15' },
            { id: 'b2', name: 'Code Ninja', icon: 'Code', color: 'indigo', description: 'Solved 50+ coding challenges', dateEarned: '2024-01-20' },
        ]
    },
    activeCourses: [
        {
            id: 'c1',
            title: 'Advanced React Patterns',
            instructor: 'Sarah Drasner',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
            progress: 65,
            totalLessons: 24,
            completedLessons: 16,
            category: 'Web Dev',
            lastAccessed: '2024-02-01T14:30:00Z',
            nextLesson: 'Higher Order Components'
        },
        {
            id: 'c2',
            title: 'System Design Interview Prep',
            instructor: 'Gaurav Sen',
            thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=800&q=80',
            progress: 30,
            totalLessons: 40,
            completedLessons: 12,
            category: 'Architecture',
            lastAccessed: '2024-01-31T10:00:00Z',
            nextLesson: 'Load Balancing Strategies'
        },
        {
            id: 'c3',
            title: 'UI/UX Design Masterclass',
            instructor: 'Gary Simon',
            thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&q=80',
            progress: 85,
            totalLessons: 15,
            completedLessons: 13,
            category: 'Design',
            lastAccessed: '2024-02-02T09:15:00Z',
            nextLesson: 'Interaction Design'
        }
    ],
    upcomingAssignments: [
        { id: 'a1', title: 'Context API Refactor', course: 'Advanced React', dueDate: '2024-02-05T23:59:59Z', status: 'pending', priority: 'high' },
        { id: 'a2', title: 'API Rate Limiting Task', course: 'System Design', dueDate: '2024-02-08T18:00:00Z', status: 'pending', priority: 'medium' },
        { id: 'a3', title: 'Figma Prototype V2', course: 'UI/UX Design', dueDate: '2024-02-10T12:00:00Z', status: 'pending', priority: 'low' }
    ],
    liveSessions: [
        { id: 'l1', topic: 'React Performance Audit', course: 'Advanced React', instructor: 'Sarah Drasner', startTime: '2024-02-03T15:00:00Z', duration: '60m', joinUrl: '#' },
        { id: 'l2', topic: 'Microservices Q&A', course: 'System Design', instructor: 'Gaurav Sen', startTime: '2024-02-04T11:00:00Z', duration: '90m', joinUrl: '#' }
    ],
    weeklyActivity: [
        { day: 'Mon', hours: 4.5, tasksCompleted: 3 },
        { day: 'Tue', hours: 3.2, tasksCompleted: 2 },
        { day: 'Wed', hours: 6.0, tasksCompleted: 5 },
        { day: 'Thu', hours: 2.1, tasksCompleted: 1 },
        { day: 'Fri', hours: 5.5, tasksCompleted: 4 },
        { day: 'Sat', hours: 1.5, tasksCompleted: 0 },
        { day: 'Sun', hours: 0, tasksCompleted: 0 }
    ],
    performance: [
        { subject: 'Coding', score: 85, fullMark: 100 },
        { subject: 'Theory', score: 72, fullMark: 100 },
        { subject: 'Projects', score: 94, fullMark: 100 },
        { subject: 'Quizzes', score: 88, fullMark: 100 }
    ],
    certificates: [
        { id: 'cert1', courseTitle: 'Java Script Fundamentals', issueDate: '2023-11-20', credentialId: 'SB-10293', downloadUrl: '#' },
        { id: 'cert2', courseTitle: 'Modern CSS Frameworks', issueDate: '2023-12-15', credentialId: 'SB-10455', downloadUrl: '#' }
    ],
    notifications: [
        { id: 'n1', title: 'Assignment Due', message: 'Context API Refactor is due in 3 days.', type: 'assignment', timestamp: '2024-02-02T10:00:00Z', read: false },
        { id: 'n2', title: 'Class Starting', message: 'Performance Audit starts in 30 mins.', type: 'class', timestamp: '2024-02-03T14:30:00Z', read: false }
    ]
};
