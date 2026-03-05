import type {
    University, Course, Assignment, Submission,
    AIMessage, AnalyticsData
} from '../types';

// Universities
export const mockUniversities: University[] = [
    {
        id: 'uni-001',
        name: 'State Technical University',
        slug: 'state-tech',
        domain: 'statetech.edu',
        plan: 'enterprise',
        status: 'active',
        studentCount: 3240,
        courseCount: 45,
        createdAt: '2023-01-15',
    },
    {
        id: 'uni-002',
        name: 'Design Institute',
        slug: 'design-inst',
        domain: 'design.edu',
        plan: 'university',
        status: 'active',
        studentCount: 1890,
        courseCount: 28,
        createdAt: '2023-03-20',
    },
    {
        id: 'uni-003',
        name: 'Business Academy',
        slug: 'business-acad',
        domain: 'business.edu',
        plan: 'university',
        status: 'active',
        studentCount: 2156,
        courseCount: 32,
        createdAt: '2023-06-10',
    },
    {
        id: 'uni-004',
        name: 'Arts College',
        slug: 'arts-college',
        domain: 'arts.edu',
        plan: 'starter',
        status: 'pending',
        studentCount: 540,
        courseCount: 12,
        createdAt: '2024-01-05',
    },
];

// Courses
export const mockCourses: Course[] = [
    {
        id: 'course-001',
        universityId: 'uni-001',
        title: 'Full-Stack Web Development',
        description: 'Master modern web development with React, Node.js, and PostgreSQL. Build real-world applications with AI-guided learning.',
        thumbnail: '/course_thumb.jpg',
        instructor: 'Dr. James Wilson',
        modules: [
            {
                id: 'mod-001',
                title: 'Setup & Tooling',
                order: 1,
                lessons: [
                    { id: 'les-001', title: 'Development Environment', type: 'text', duration: '15 min', completed: true },
                    { id: 'les-002', title: 'Git & GitHub Basics', type: 'video', duration: '25 min', completed: true },
                    { id: 'les-003', title: 'Package Managers', type: 'code', duration: '20 min', completed: true },
                ],
                completed: true,
            },
            {
                id: 'mod-002',
                title: 'Components & State',
                order: 2,
                lessons: [
                    { id: 'les-004', title: 'React Fundamentals', type: 'video', duration: '30 min', completed: true },
                    { id: 'les-005', title: 'State Management', type: 'code', duration: '35 min', completed: false, locked: false },
                    { id: 'les-006', title: 'Props & Events', type: 'code', duration: '25 min', locked: true },
                ],
                completed: false,
            },
            {
                id: 'mod-003',
                title: 'Routing & Data',
                order: 3,
                lessons: [
                    { id: 'les-007', title: 'React Router', type: 'video', duration: '28 min', locked: true },
                    { id: 'les-008', title: 'API Integration', type: 'code', duration: '40 min', locked: true },
                ],
                completed: false,
            },
            {
                id: 'mod-004',
                title: 'Backend & Auth',
                order: 4,
                lessons: [
                    { id: 'les-009', title: 'Node.js Basics', type: 'code', duration: '35 min', locked: true },
                    { id: 'les-010', title: 'Authentication', type: 'code', duration: '45 min', locked: true },
                ],
                completed: false,
            },
        ],
        totalLessons: 10,
        totalAssignments: 8,
        duration: '12 weeks',
        level: 'intermediate',
        status: 'published',
        enrolledCount: 342,
        aiEnabled: true,
        createdAt: '2024-01-10',
    },
    {
        id: 'course-002',
        universityId: 'uni-001',
        title: 'Data Structures & Algorithms',
        description: 'Master fundamental computer science concepts with interactive coding challenges and AI-powered explanations.',
        instructor: 'Prof. Maria Garcia',
        modules: [
            {
                id: 'mod-005',
                title: 'Arrays & Strings',
                order: 1,
                lessons: [
                    { id: 'les-011', title: 'Array Basics', type: 'code', duration: '30 min', completed: true },
                    { id: 'les-012', title: 'String Manipulation', type: 'code', duration: '35 min', completed: false },
                ],
                completed: false,
            },
        ],
        totalLessons: 24,
        totalAssignments: 15,
        duration: '16 weeks',
        level: 'advanced',
        status: 'published',
        enrolledCount: 256,
        aiEnabled: true,
        createdAt: '2024-02-15',
    },
    {
        id: 'course-003',
        universityId: 'uni-001',
        title: 'UI Design Systems',
        description: 'Learn to create scalable design systems with Figma, component libraries, and accessibility best practices.',
        instructor: 'Alex Thompson',
        modules: [],
        totalLessons: 18,
        totalAssignments: 6,
        duration: '8 weeks',
        level: 'beginner',
        status: 'published',
        enrolledCount: 189,
        aiEnabled: false,
        createdAt: '2024-03-01',
    },
];

// Assignments
export const mockAssignments: Assignment[] = [
    {
        id: 'assign-001',
        courseId: 'course-001',
        moduleId: 'mod-002',
        lessonId: 'les-005',
        title: 'Build a Responsive Dashboard',
        description: 'Create a responsive dashboard layout with sidebar navigation and main content area.',
        instructions: `
## Assignment: Responsive Dashboard Layout

### Requirements:
1. Use CSS Grid for the main layout
2. Sidebar should be collapsible on mobile
3. Include a header with user menu
4. Make it responsive (desktop, tablet, mobile)

### Bonus:
- Add dark mode toggle
- Animate sidebar transitions
- Use CSS variables for theming

### Submission:
Push your code to the GitHub repository. The AI tutor will review your code automatically.`,
        dueDate: '2024-12-30',
        maxPoints: 100,
        githubRepo: 'skillbridge/fullstack-web/assignments/dashboard-layout',
        submissions: [],
    },
    {
        id: 'assign-002',
        courseId: 'course-001',
        moduleId: 'mod-002',
        lessonId: 'les-006',
        title: 'State Management Challenge',
        description: 'Build a shopping cart with React state management.',
        instructions: 'Implement a fully functional shopping cart with add, remove, and quantity update features.',
        dueDate: '2025-01-05',
        maxPoints: 100,
        submissions: [],
    },
];

// Submissions
export const mockSubmissions: Submission[] = [
    {
        id: 'sub-001',
        assignmentId: 'assign-001',
        studentId: 'stu-001',
        studentName: 'Alex Chen',
        content: 'https://github.com/alexchen-dev/skillbridge-dashboard',
        githubCommit: 'a1b2c3d',
        githubBranch: 'main',
        aiFeedback: 'Clean structure! Consider extracting the Header component for better reusability. The responsive breakpoints are well-chosen.',
        grade: 92,
        feedback: 'Excellent work! The animations are smooth and the code is well-organized.',
        status: 'graded',
        submittedAt: '2024-12-28T14:30:00Z',
        gradedAt: '2024-12-29T10:15:00Z',
    },
    {
        id: 'sub-002',
        assignmentId: 'assign-001',
        studentId: 'stu-002',
        studentName: 'Jordan Smith',
        content: 'https://github.com/jordansmith/dashboard-assignment',
        githubCommit: 'e4f5g6h',
        githubBranch: 'main',
        aiFeedback: 'Good start! The sidebar toggle needs work. Consider using CSS transitions for smoother animations.',
        status: 'submitted',
        submittedAt: '2024-12-29T16:45:00Z',
    },
];

// AI Chat History
export const mockAIChat: AIMessage[] = [
    {
        id: 'msg-001',
        type: 'user',
        content: 'How do I center a div with CSS?',
        timestamp: '2024-12-29T10:00:00Z',
    },
    {
        id: 'msg-002',
        type: 'assistant',
        content: 'There are several ways to center a div! The most common modern approaches are:\\n\\n**1. Flexbox (recommended for 1D layouts):**\\n\\`\\`\\`css\\n.container {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n}\\n\\`\\`\\`\\n\\n**2. Grid (great for 2D layouts):**\\n\\`\\`\\`css\\n.container {\\n  display: grid;\\n  place-items: center;\\n}\\n\\`\\`\\`\\n\\nWhich approach fits your use case? I can explain more about either method!',
        timestamp: '2024-12-29T10:00:05Z',
        actions: [
            { label: 'Explain Flexbox', action: 'explain_flexbox' },
            { label: 'Explain Grid', action: 'explain_grid' },
            { label: 'Show examples', action: 'show_examples' },
        ],
    },
    {
        id: 'msg-003',
        type: 'user',
        content: 'Show me examples',
        timestamp: '2024-12-29T10:00:30Z',
    },
    {
        id: 'msg-004',
        type: 'assistant',
        content: 'Here are practical examples for different scenarios:\\n\\n**Centering horizontally only:**\\n\\`\\`\\`css\\n.horizontal-center {\\n  display: flex;\\n  justify-content: center;\\n}\\n\\`\\`\\`\\n\\n**Centering vertically only:**\\n\\`\\`\\`css\\n.vertical-center {\\n  display: flex;\\n  align-items: center;\\n}\\n\\`\\`\\`\\n\\n**Perfect center (both axes):**\\n\\`\\`\\`css\\n.perfect-center {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  min-height: 100vh; /* Full viewport height */\\n}\\n\\`\\`\\`\\n\\nWould you like to see how to apply this to your dashboard layout?',
        timestamp: '2024-12-29T10:00:35Z',
        actions: [
            { label: 'Apply to my code', action: 'apply_to_code' },
            { label: 'Debug my layout', action: 'debug_layout' },
        ],
    },
];

// Analytics Data
export const mockAnalytics: AnalyticsData = {
    activeStudents: 1240,
    totalStudents: 3240,
    completionRate: 78,
    avgSessionTime: 24,
    aiInteractions: 15420,
    submissionsToday: 47,
    courseProgress: [
        { courseId: 'course-001', courseName: 'Full-Stack Web', enrolled: 342, completed: 156, inProgress: 186, avgProgress: 68 },
        { courseId: 'course-002', courseName: 'Data Structures', enrolled: 256, completed: 89, inProgress: 167, avgProgress: 52 },
        { courseId: 'course-003', courseName: 'UI Design Systems', enrolled: 189, completed: 124, inProgress: 65, avgProgress: 74 },
    ],
    weeklyActivity: [
        { date: 'Mon', students: 890, assignments: 45, aiChats: 320 },
        { date: 'Tue', students: 920, assignments: 52, aiChats: 380 },
        { date: 'Wed', students: 850, assignments: 38, aiChats: 290 },
        { date: 'Thu', students: 980, assignments: 61, aiChats: 420 },
        { date: 'Fri', students: 760, assignments: 42, aiChats: 280 },
        { date: 'Sat', students: 540, assignments: 28, aiChats: 150 },
        { date: 'Sun', students: 480, assignments: 22, aiChats: 120 },
    ],
};

// Platform-wide Analytics (for Super Admin)
export const mockPlatformAnalytics = {
    totalUsers: 18420,
    totalCourses: 340,
    totalAssignments: 8560,
    totalSubmissions: 92400,
    universities: mockUniversities.length,
    activeUniversities: mockUniversities.filter(u => u.status === 'active').length,
    monthlyRevenue: 124500,
    aiTokensUsed: 4500000,
    growthRate: 23,
};
