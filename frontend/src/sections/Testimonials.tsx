import { useEffect, useRef, useState } from 'react';
import { Quote } from 'lucide-react';

interface Testimonial {
  initials: string;
  name: string;
  role: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    initials: 'PS',
    name: 'Priya Sharma',
    role: 'Data Analyst at TCS',
    quote:
      'The hands-on projects and mentor support helped me transition from a non-tech background to landing my dream job.',
  },
  {
    initials: 'RK',
    name: 'Rahul Kumar',
    role: 'Full Stack Developer',
    quote:
      'Best decision I made for my career. The curriculum is industry-relevant and the placement support is excellent.',
  },
  {
    initials: 'SP',
    name: 'Sneha Patel',
    role: 'ML Engineer at Infosys',
    quote:
      'The AI/ML course gave me practical skills that I use daily in my job. Highly recommend SkillBridge!',
  },
];

function TestimonialCard({
  testimonial,
  index,
  isVisible,
  isActive,
}: {
  testimonial: Testimonial;
  index: number;
  isVisible: boolean;
  isActive: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const getTransform = () => {
    if (index === 0) {
      return isVisible
        ? 'translateZ(-100px) translateX(-20%) rotateY(25deg) scale(0.85)'
        : 'translateZ(-100px) translateX(-20%) rotateY(-90deg) scale(0.5)';
    } else if (index === 2) {
      return isVisible
        ? 'translateZ(-100px) translateX(20%) rotateY(-25deg) scale(0.85)'
        : 'translateZ(-100px) translateX(20%) rotateY(90deg) scale(0.5)';
    } else {
      return isVisible
        ? 'translateZ(0) rotateY(0) scale(1)'
        : 'translateZ(-100px) scale(0.5)';
    }
  };

  return (
    <div
      className="relative"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: 'all 0.8s var(--ease-expo-out)',
        transitionDelay: `${400 + index * 200}ms`,
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="bg-white rounded-2xl p-8 border border-black/10 relative overflow-hidden transition-all duration-400"
        style={{
          transform: isHovered ? 'translateZ(50px)' : 'translateZ(0)',
          boxShadow: isHovered
            ? '0 30px 60px rgba(0,0,0,0.15)'
            : isActive
              ? '0 20px 40px rgba(0,0,0,0.1)'
              : '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        {/* Quote Icon */}
        <div className="absolute top-4 right-4 opacity-10">
          <Quote className="w-16 h-16 text-[#8b5cf6]" />
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
            }}
          >
            {testimonial.initials}
          </div>
          <div>
            <h4 className="font-semibold text-black">{testimonial.name}</h4>
            <p className="text-sm text-[#333333]/70">{testimonial.role}</p>
          </div>
        </div>

        {/* Quote */}
        <p
          className="text-[#333333] leading-relaxed relative z-10"
          style={{
            fontWeight: isHovered ? 500 : 400,
            transition: 'font-weight 0.3s',
          }}
        >
          "{testimonial.quote}"
        </p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
      id="career"
      ref={sectionRef}
      className="py-20 md:py-28 bg-[#f9f9f9] overflow-hidden"
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
            What Our <span className="text-[#8b5cf6]">Students</span> Say
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
            Hear from our successful graduates who transformed their careers
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div
          className="relative max-w-5xl mx-auto"
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          {/* Floating Quote Marks */}
          <div
            className="absolute -top-8 left-10 opacity-5 pointer-events-none"
            style={{ animation: 'float 6s ease-in-out infinite' }}
          >
            <Quote className="w-32 h-32 text-[#8b5cf6]" />
          </div>
          <div
            className="absolute -bottom-8 right-10 opacity-5 pointer-events-none"
            style={{ animation: 'float 6s ease-in-out infinite reverse' }}
          >
            <Quote className="w-32 h-32 text-[#06b6d4] rotate-180" />
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.initials}
                testimonial={testimonial}
                index={index}
                isVisible={isVisible}
                isActive={activeIndex === index}
              />
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index
                  ? 'bg-[#8b5cf6] w-8'
                  : 'bg-black/20 hover:bg-black/40'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
