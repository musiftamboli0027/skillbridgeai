import { useEffect, useRef, useState } from 'react';
import { ClipboardList, BookOpen, Code2, Briefcase } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: any;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Enroll',
    description: 'Choose your course and complete the enrollment process',
    icon: ClipboardList,
  },
  {
    number: '02',
    title: 'Learn',
    description: 'Access structured curriculum with expert-led sessions',
    icon: BookOpen,
  },
  {
    number: '03',
    title: 'Practice',
    description: 'Work on real-world projects and build your portfolio',
    icon: Code2,
  },
  {
    number: '04',
    title: 'Get Placed',
    description: 'Receive placement assistance and land your dream job',
    icon: Briefcase,
  },
];

function StepCard({
  step,
  index,
  isVisible,
}: {
  step: Step;
  index: number;
  isVisible: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = step.icon;

  return (
    <div
      className="relative flex flex-col items-center text-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.5)',
        transition: 'all 0.5s var(--ease-elastic)',
        transitionDelay: `${600 + index * 500}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Number Circle */}
      <div
        className="relative w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
          transform: isHovered ? 'scale(1.15)' : 'scale(1)',
          boxShadow: isHovered
            ? '0 0 30px rgba(139, 92, 246, 0.5)'
            : '0 0 20px rgba(139, 92, 246, 0.3)',
        }}
      >
        <span className="text-2xl font-bold text-white">{step.number}</span>

        {/* Icon overlay */}
        <div
          className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300"
          style={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          <Icon className="w-5 h-5 text-[#8b5cf6]" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-black mb-2">{step.title}</h3>
      <p
        className="text-sm text-[#333333] max-w-xs transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0.8 }}
      >
        {step.description}
      </p>
    </div>
  );
}

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const [pathProgress, setPathProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate path drawing
          setTimeout(() => {
            const interval = setInterval(() => {
              setPathProgress((prev) => {
                if (prev >= 100) {
                  clearInterval(interval);
                  return 100;
                }
                return prev + 2;
              });
            }, 40);
          }, 400);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="life"
      ref={sectionRef}
      className="py-20 md:py-28 bg-white overflow-hidden"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="section-title"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.7s var(--ease-expo-out)',
            }}
          >
            How It <span className="text-[#8b5cf6]">Works</span>
          </h2>
          <p
            className="section-subtitle max-w-2xl mx-auto"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s var(--ease-expo-out)',
              transitionDelay: '200ms',
            }}
          >
            Your journey from beginner to job-ready professional in 4 simple
            steps
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Path - Desktop */}
          <svg
            className="absolute top-10 left-0 w-full h-4 hidden md:block"
            viewBox="0 0 1000 20"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path
              d="M 50 10 Q 200 10 350 10 Q 500 10 650 10 Q 800 10 950 10"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="1000"
              strokeDashoffset={1000 - (pathProgress / 100) * 1000}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))',
                transition: 'stroke-dashoffset 0.1s linear',
              }}
            />
          </svg>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                step={step}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
