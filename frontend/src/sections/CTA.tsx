import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function CTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background: '#0f172a',
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
      }}
    >
      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient Orbs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 bg-[#8b5cf6]/20 rounded-full blur-3xl"
        style={{ animation: 'morphFloat 15s ease-in-out infinite alternate' }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        style={{ animation: 'morphFloat 12s ease-in-out infinite alternate-reverse' }}
      />

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2
            className="text-3xl md:text-5xl font-semibold text-white mb-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.7s var(--ease-expo-out)',
              transitionDelay: '300ms',
            }}
          >
            Ready to Transform Your Career?
          </h2>

          {/* Subheadline */}
          <p
            className="text-lg text-white/80 mb-10"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s var(--ease-expo-out)',
              transitionDelay: '600ms',
            }}
          >
            Join thousands of successful graduates who have landed their dream
            jobs. Your tech career starts here with our industry-leading
            training programs.
          </p>

          {/* Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.5)',
              transition: 'all 0.6s var(--ease-elastic)',
              transitionDelay: '900ms',
            }}
          >
            <Link
              to="/courses"
              className="group px-8 py-4 rounded-full bg-[#8b5cf6] text-white font-medium inline-flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
              style={{
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
                animation: 'pulseGlow 2s ease-in-out infinite',
              }}
            >
              Explore Courses
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="group px-8 py-4 rounded-full border-2 border-white text-white font-medium inline-flex items-center justify-center gap-3 transition-all duration-300 hover:border-[#8b5cf6] hover:text-[#8b5cf6] hover:bg-[#8b5cf6]/10"
            >
              <MessageCircle className="w-5 h-5" />
              Talk to Counselor
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f9f9f9] to-transparent pointer-events-none" />
    </section>
  );
}
