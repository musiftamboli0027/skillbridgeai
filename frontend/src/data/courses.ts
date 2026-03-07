export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  fullDescription: string;
  rating: number;
  students: number;
  image: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  originalPrice?: number;
  modules: Module[];
  instructor: Instructor;
  tags: string[];
  features: string[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'reading' | 'quiz' | 'project' | 'coding';
  isPreview?: boolean;
}

export interface Instructor {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export const courses: Course[] = [
  {
    id: 'skillbridge-python-basics',
    title: 'SkillBridge Python Basics',
    subtitle: 'From Zero to Real-World Command-Line Applications',
    description: 'SkillBridge Python for Beginners is a guided learning pathway aligned with modern NEP-based skill education.',
    fullDescription: 'Students learn best by doing. Instead of passive reading, this course encourages experimentation, debugging, and logical reasoning.',
    rating: 4.9,
    students: 1240,
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200',
    duration: '6 weeks',
    level: 'Beginner',
    price: 1999,
    originalPrice: 4999,
    instructor: {
      name: 'Dr. Alex Rivers',
      role: 'Senior Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
      bio: 'Expert in Python and Algorithm Design.'
    },
    tags: ['Python', 'Beginner', 'Programming', 'CLI', 'Automation'],
    features: ['AI Tutor Assistance', 'Hands-On Practice', 'NEP-Aligned Curriculum', 'Certificate of Completion'],
    modules: [
      {
        id: 'm1',
        title: 'Week 1: Python Foundations',
        lessons: [
          { id: 'l1', title: 'Introduction to Programming & Algorithms', duration: '10 min', type: 'reading', isPreview: true },
          { id: 'l2', title: 'Python Syntax, Variables & Data Types', duration: '15 min', type: 'reading' }
        ]
      }
    ]
  }
];

export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id);
}

export function getRelatedCourses(currentId: string): Course[] {
  return courses.filter(course => course.id !== currentId).slice(0, 3);
}
