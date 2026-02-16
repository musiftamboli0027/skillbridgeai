import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Users } from 'lucide-react';
import { api } from '../services/api';

interface Course {
  _id?: string;
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  rating: number;
  enrolledStudents?: number;
  students?: number;
  image: string;
}

function CourseCard({ course, index }: { course: Course; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 400 + index * 150);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const offsets = [0, 40, 20];
  const rotations = [-1, 0, 1];
  const courseId = course._id || course.id || '';
  const studentCount = course.enrolledStudents || course.students || 0;

  return (
    <div
      ref={cardRef}
      className="group relative"
      style={{
        marginTop: `${offsets[index]}px`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? `translateY(0) rotate(${rotations[index]}deg)`
          : `translateY(80px) rotateX(15deg)`,
        transition: 'all 0.8s var(--ease-expo-out)',
        perspective: '1000px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/courses/${courseId}`}>
        <div
          className="bg-white rounded-2xl overflow-hidden border border-black/10 transition-all duration-400"
          style={{
            transform: isHovered
              ? 'translateY(-15px) translateZ(30px) rotateX(-5deg)'
              : 'translateY(0) translateZ(0) rotateX(0)',
            boxShadow: isHovered
              ? '0 25px 50px rgba(0,0,0,0.15), 0 10px 20px rgba(139, 92, 246, 0.1)'
              : '0 4px 20px rgba(0,0,0,0.08)',
            borderColor: isHovered ? 'rgba(139, 92, 246, 0.3)' : 'rgba(0,0,0,0.1)',
          }}
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
            />
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">{course.rating || 4.5}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-black mb-1">
              {course.title}
            </h3>
            {course.subtitle && (
              <p className="text-sm text-[#333333]/70 mb-3">{course.subtitle}</p>
            )}
            <p className="text-sm text-[#333333] line-clamp-3 mb-4">
              {course.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#333333]/70">
                <Users className="w-4 h-4" />
                <span>{studentCount.toLocaleString()} Students</span>
              </div>
              <span className="group/btn flex items-center gap-2 text-[#8b5cf6] font-medium text-sm">
                Explore
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function Courses() {
  const [isVisible, setIsVisible] = useState(false);
  const [displayCourses, setDisplayCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await api.getCourses();
        // Get first 3 courses for homepage
        const coursesToDisplay = (response.courses || []).slice(0, 3);
        setDisplayCourses(coursesToDisplay);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        // Fallback to empty array on error
        setDisplayCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section
      id="courses"
      ref={sectionRef}
      className="py-20 md:py-28 bg-white"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2
              className="section-title"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s var(--ease-expo-out)',
              }}
            >
              Popular Courses
            </h2>
            <p
              className="section-subtitle max-w-xl"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s var(--ease-expo-out)',
                transitionDelay: '200ms',
              }}
            >
              Choose from our industry-leading programs designed to get you
              job-ready in 6 months.
            </p>
          </div>
          <Link
            to="/courses"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#8b5cf6] font-medium hover:text-[#0f172a] transition-colors"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'all 0.5s var(--ease-expo-out)',
              transitionDelay: '400ms',
            }}
          >
            View All Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeleton
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-black/10 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : displayCourses.length > 0 ? (
            displayCourses.map((course, index) => (
              <CourseCard key={course._id || course.id} course={course} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[#333333]/70">No courses available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
