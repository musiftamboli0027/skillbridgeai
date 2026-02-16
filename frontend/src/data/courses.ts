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
  type: 'video' | 'reading' | 'quiz' | 'project';
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
    id: 'java-spring-boot',
    title: 'Java - Spring Boot',
    subtitle: 'Full Stack Backend Development',
    description: 'Master backend development with Java and Spring Boot. Build scalable enterprise applications.',
    fullDescription: `The Java - Spring Boot course is designed to provide a strong foundation in backend development using Java and modern Spring Boot frameworks. 

This comprehensive 12-week course covers core Java programming concepts, object-oriented design, and essential backend skills required to build scalable applications.

You'll learn Spring Boot fundamentals including REST API development, dependency injection, database integration using JPA, security implementation, and building real-world backend services.

By the end of the course, students will be able to develop robust Spring Boot applications, understand backend architecture, and solve practical problem statements relevant to industry projects.`,
    rating: 4.8,
    students: 1250,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
    duration: '12 weeks',
    level: 'Intermediate',
    price: 24999,
    originalPrice: 34999,
    instructor: {
      name: 'Rajesh Kumar',
      role: 'Senior Java Developer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      bio: '10+ years of experience in Java development. Former Tech Lead at Infosys.',
    },
    tags: ['Java', 'Spring Boot', 'Backend', 'REST API'],
    features: [
      '50+ hours of video content',
      '20+ hands-on projects',
      '1:1 mentorship sessions',
      'Industry-recognized certificate',
      'Lifetime access to course materials',
      'Placement assistance',
    ],
    modules: [
      {
        id: 'm1',
        title: 'Java Fundamentals',
        lessons: [
          { id: 'l1', title: 'Introduction to Java', duration: '45 min', type: 'video', isPreview: true },
          { id: 'l2', title: 'Variables and Data Types', duration: '60 min', type: 'video' },
          { id: 'l3', title: 'Control Flow Statements', duration: '55 min', type: 'video' },
          { id: 'l4', title: 'Object-Oriented Programming Basics', duration: '90 min', type: 'video' },
        ],
      },
      {
        id: 'm2',
        title: 'Advanced Java Concepts',
        lessons: [
          { id: 'l5', title: 'Collections Framework', duration: '75 min', type: 'video' },
          { id: 'l6', title: 'Exception Handling', duration: '50 min', type: 'video' },
          { id: 'l7', title: 'Multithreading', duration: '80 min', type: 'video' },
          { id: 'l8', title: 'Java 8 Features', duration: '70 min', type: 'video' },
        ],
      },
      {
        id: 'm3',
        title: 'Spring Boot Fundamentals',
        lessons: [
          { id: 'l9', title: 'Introduction to Spring Boot', duration: '60 min', type: 'video', isPreview: true },
          { id: 'l10', title: 'Dependency Injection', duration: '65 min', type: 'video' },
          { id: 'l11', title: 'Building REST APIs', duration: '90 min', type: 'video' },
          { id: 'l12', title: 'Project: Build Your First API', duration: '120 min', type: 'project' },
        ],
      },
      {
        id: 'm4',
        title: 'Database Integration',
        lessons: [
          { id: 'l13', title: 'JPA and Hibernate', duration: '80 min', type: 'video' },
          { id: 'l14', title: 'Database Relationships', duration: '70 min', type: 'video' },
          { id: 'l15', title: 'Query Methods', duration: '55 min', type: 'video' },
        ],
      },
    ],
  },
  {
    id: 'python-full-stack',
    title: 'Python Full Stack',
    subtitle: 'From Basics to Advanced',
    description: 'Learn Python from scratch and build complete web applications with Django and Flask.',
    fullDescription: `Master Python programming from the ground up with our comprehensive Full Stack Python course. This 16-week program takes you from Python basics to building complete web applications.

You'll start with Python fundamentals, then progress to web development using Django and Flask frameworks. Learn to build REST APIs, work with databases, and deploy your applications to the cloud.

The course includes real-world projects, code reviews, and mentorship from industry professionals to ensure you're job-ready upon completion.`,
    rating: 4.9,
    students: 2100,
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=500&fit=crop',
    duration: '16 weeks',
    level: 'Beginner',
    price: 29999,
    originalPrice: 39999,
    instructor: {
      name: 'Anita Desai',
      role: 'Python Expert & Data Scientist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      bio: 'Data Scientist with 8+ years of experience. Python enthusiast and open-source contributor.',
    },
    tags: ['Python', 'Django', 'Flask', 'Web Development'],
    features: [
      '80+ hours of video content',
      '15+ real-world projects',
      'Weekly live coding sessions',
      'Code review by experts',
      'Job placement support',
      'Community access',
    ],
    modules: [
      {
        id: 'm1',
        title: 'Python Basics',
        lessons: [
          { id: 'l1', title: 'Introduction to Python', duration: '40 min', type: 'video', isPreview: true },
          { id: 'l2', title: 'Variables and Data Types', duration: '50 min', type: 'video' },
          { id: 'l3', title: 'Functions and Modules', duration: '60 min', type: 'video' },
        ],
      },
      {
        id: 'm2',
        title: 'Object-Oriented Programming',
        lessons: [
          { id: 'l4', title: 'Classes and Objects', duration: '70 min', type: 'video' },
          { id: 'l5', title: 'Inheritance and Polymorphism', duration: '65 min', type: 'video' },
          { id: 'l6', title: 'Project: Build a Game', duration: '150 min', type: 'project' },
        ],
      },
      {
        id: 'm3',
        title: 'Web Development with Django',
        lessons: [
          { id: 'l7', title: 'Django Introduction', duration: '55 min', type: 'video', isPreview: true },
          { id: 'l8', title: 'Models and Views', duration: '80 min', type: 'video' },
          { id: 'l9', title: 'Templates and Forms', duration: '70 min', type: 'video' },
        ],
      },
    ],
  },
  {
    id: 'mern-stack',
    title: 'MERN Stack',
    subtitle: 'Full Stack JavaScript',
    description: 'Become a full-stack developer with MongoDB, Express, React, and Node.js.',
    fullDescription: `The MERN Stack course is your gateway to becoming a full-stack JavaScript developer. Learn to build modern web applications using MongoDB, Express.js, React, and Node.js.

This intensive 14-week program covers everything from frontend development with React to backend API development with Node.js and Express. You'll build multiple projects including a complete e-commerce application.

With hands-on coding sessions, real-world projects, and expert mentorship, you'll be ready to take on full-stack developer roles in top tech companies.`,
    rating: 4.7,
    students: 1800,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop',
    duration: '14 weeks',
    level: 'Intermediate',
    price: 27999,
    originalPrice: 35999,
    instructor: {
      name: 'Vikram Patel',
      role: 'Full Stack Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      bio: 'Full Stack Developer with expertise in MERN stack. Former developer at Flipkart.',
    },
    tags: ['MongoDB', 'Express', 'React', 'Node.js'],
    features: [
      '70+ hours of content',
      'Build 5 complete projects',
      'React hooks deep dive',
      'API development mastery',
      'Deployment strategies',
      'Interview preparation',
    ],
    modules: [
      {
        id: 'm1',
        title: 'React Fundamentals',
        lessons: [
          { id: 'l1', title: 'React Introduction', duration: '50 min', type: 'video', isPreview: true },
          { id: 'l2', title: 'Components and Props', duration: '60 min', type: 'video' },
          { id: 'l3', title: 'State and Lifecycle', duration: '70 min', type: 'video' },
        ],
      },
      {
        id: 'm2',
        title: 'Node.js and Express',
        lessons: [
          { id: 'l4', title: 'Node.js Basics', duration: '55 min', type: 'video' },
          { id: 'l5', title: 'Express Framework', duration: '65 min', type: 'video' },
          { id: 'l6', title: 'Building REST APIs', duration: '80 min', type: 'video' },
        ],
      },
      {
        id: 'm3',
        title: 'Database with MongoDB',
        lessons: [
          { id: 'l7', title: 'MongoDB Introduction', duration: '50 min', type: 'video', isPreview: true },
          { id: 'l8', title: 'CRUD Operations', duration: '60 min', type: 'video' },
          { id: 'l9', title: 'Mongoose ODM', duration: '55 min', type: 'video' },
        ],
      },
    ],
  },
  {
    id: 'data-science',
    title: 'Data Science',
    subtitle: 'ML and AI Fundamentals',
    description: 'Master data science, machine learning, and AI with Python and industry tools.',
    fullDescription: `Dive into the world of Data Science with our comprehensive course covering Python, statistics, machine learning, and deep learning. This 20-week program is designed to take you from beginner to job-ready data scientist.

You'll work with real datasets, build predictive models, and learn to use industry-standard tools like TensorFlow, scikit-learn, and pandas. The course includes capstone projects that you can showcase to potential employers.

With personalized mentorship and career support, you'll be prepared for roles in data science, machine learning engineering, and AI development.`,
    rating: 4.9,
    students: 950,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    duration: '20 weeks',
    level: 'Advanced',
    price: 34999,
    originalPrice: 44999,
    instructor: {
      name: 'Dr. Sarah Johnson',
      role: 'Data Science Lead',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      bio: 'PhD in Computer Science. 12+ years in data science and machine learning.',
    },
    tags: ['Python', 'Machine Learning', 'Deep Learning', 'AI'],
    features: [
      '100+ hours of content',
      'Work with real datasets',
      'TensorFlow and PyTorch',
      'Capstone projects',
      'Research paper guidance',
      'PhD-level mentorship',
    ],
    modules: [
      {
        id: 'm1',
        title: 'Python for Data Science',
        lessons: [
          { id: 'l1', title: 'NumPy and Pandas', duration: '70 min', type: 'video', isPreview: true },
          { id: 'l2', title: 'Data Visualization', duration: '60 min', type: 'video' },
          { id: 'l3', title: 'Data Cleaning', duration: '55 min', type: 'video' },
        ],
      },
      {
        id: 'm2',
        title: 'Machine Learning',
        lessons: [
          { id: 'l4', title: 'Supervised Learning', duration: '80 min', type: 'video' },
          { id: 'l5', title: 'Unsupervised Learning', duration: '75 min', type: 'video' },
          { id: 'l6', title: 'Model Evaluation', duration: '65 min', type: 'video' },
        ],
      },
      {
        id: 'm3',
        title: 'Deep Learning',
        lessons: [
          { id: 'l7', title: 'Neural Networks', duration: '90 min', type: 'video', isPreview: true },
          { id: 'l8', title: 'CNN and RNN', duration: '85 min', type: 'video' },
          { id: 'l9', title: 'Project: Image Classifier', duration: '180 min', type: 'project' },
        ],
      },
    ],
  },
  {
    id: 'web-development',
    title: 'Web Development',
    subtitle: 'HTML, CSS, JavaScript',
    description: 'Build responsive websites from scratch with modern HTML, CSS, and JavaScript.',
    fullDescription: `Start your web development journey with our comprehensive course covering HTML5, CSS3, and modern JavaScript. This 10-week program is perfect for beginners who want to build beautiful, responsive websites.

You'll learn semantic HTML, modern CSS techniques including Flexbox and Grid, and JavaScript ES6+ features. By the end of the course, you'll have built a portfolio of projects including a personal website, landing pages, and interactive web applications.

The course includes design principles, accessibility best practices, and deployment to make you a well-rounded frontend developer.`,
    rating: 4.6,
    students: 3200,
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=500&fit=crop',
    duration: '10 weeks',
    level: 'Beginner',
    price: 19999,
    originalPrice: 24999,
    instructor: {
      name: 'Meera Shah',
      role: 'Frontend Developer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      bio: 'Creative developer with passion for UI/UX. Former designer turned developer.',
    },
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    features: [
      '60+ hours of content',
      'Build 10+ websites',
      'Design principles included',
      'Portfolio development',
      'Freelancing guidance',
      'Lifetime community access',
    ],
    modules: [
      {
        id: 'm1',
        title: 'HTML5 Fundamentals',
        lessons: [
          { id: 'l1', title: 'HTML Structure', duration: '40 min', type: 'video', isPreview: true },
          { id: 'l2', title: 'Semantic Elements', duration: '45 min', type: 'video' },
          { id: 'l3', title: 'Forms and Inputs', duration: '50 min', type: 'video' },
        ],
      },
      {
        id: 'm2',
        title: 'CSS3 Styling',
        lessons: [
          { id: 'l4', title: 'CSS Selectors', duration: '55 min', type: 'video' },
          { id: 'l5', title: 'Flexbox Layout', duration: '65 min', type: 'video' },
          { id: 'l6', title: 'CSS Grid', duration: '70 min', type: 'video' },
        ],
      },
      {
        id: 'm3',
        title: 'JavaScript Basics',
        lessons: [
          { id: 'l7', title: 'JS Introduction', duration: '50 min', type: 'video', isPreview: true },
          { id: 'l8', title: 'DOM Manipulation', duration: '60 min', type: 'video' },
          { id: 'l9', title: 'Events and Interactivity', duration: '55 min', type: 'video' },
        ],
      },
    ],
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    subtitle: 'AWS, Docker, Kubernetes',
    description: 'Learn cloud computing and DevOps practices with AWS, Docker, and Kubernetes.',
    fullDescription: `Master modern cloud infrastructure and DevOps practices with our comprehensive course. Learn to deploy, manage, and scale applications using AWS, Docker, Kubernetes, and CI/CD pipelines.

This 12-week program covers cloud fundamentals, containerization, orchestration, and infrastructure as code. You'll gain hands-on experience with real-world scenarios and best practices used by top tech companies.

The course prepares you for AWS certifications and DevOps engineer roles in the industry.`,
    rating: 4.8,
    students: 750,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop',
    duration: '12 weeks',
    level: 'Advanced',
    price: 29999,
    originalPrice: 37999,
    instructor: {
      name: 'Arun Nair',
      role: 'DevOps Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      bio: 'AWS Certified Solutions Architect. 10+ years in cloud infrastructure.',
    },
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    features: [
      'AWS hands-on labs',
      'Docker and Kubernetes',
      'CI/CD pipeline setup',
      'Infrastructure as Code',
      'AWS certification prep',
      'Real-world scenarios',
    ],
    modules: [
      {
        id: 'm1',
        title: 'Cloud Fundamentals',
        lessons: [
          { id: 'l1', title: 'Introduction to Cloud', duration: '50 min', type: 'video', isPreview: true },
          { id: 'l2', title: 'AWS Core Services', duration: '70 min', type: 'video' },
          { id: 'l3', title: 'EC2 and S3', duration: '65 min', type: 'video' },
        ],
      },
      {
        id: 'm2',
        title: 'Containerization',
        lessons: [
          { id: 'l4', title: 'Docker Basics', duration: '60 min', type: 'video' },
          { id: 'l5', title: 'Docker Compose', duration: '55 min', type: 'video' },
          { id: 'l6', title: 'Container Orchestration', duration: '70 min', type: 'video' },
        ],
      },
      {
        id: 'm3',
        title: 'Kubernetes',
        lessons: [
          { id: 'l7', title: 'K8s Architecture', duration: '75 min', type: 'video', isPreview: true },
          { id: 'l8', title: 'Deployments and Services', duration: '80 min', type: 'video' },
          { id: 'l9', title: 'Project: Deploy Microservices', duration: '200 min', type: 'project' },
        ],
      },
    ],
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id);
}

export function getRelatedCourses(currentId: string): Course[] {
  return courses.filter(course => course.id !== currentId).slice(0, 3);
}
