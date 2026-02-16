import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Code, Briefcase, ArrowRight } from 'lucide-react';
import ThreeBackground from '../components/three/ThreeBackground';

const features = [
  { icon: Target, text: 'Battle-Tested Curriculum' },
  { icon: Users, text: 'Elite Squad Mentorship' },
  { icon: Code, text: 'Production-Grade Projects' },
  { icon: Briefcase, text: 'Career Velocity Support' },
];

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Three.js Background */}
      <ThreeBackground />

      {/* Content */}
      <div className="container-custom relative z-10 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6 tracking-tight">
            <span
              className="block overflow-hidden"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '600ms',
              }}
            >
              Decode Your Destiny
            </span>
            <span
              className="block overflow-hidden"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '800ms',
              }}
            >
              with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6]">SkillBridge</span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: '1000ms',
            }}
          >
            Technology waits for no one. Fast-track your evolution from novice to expert with our immersive, high-impact training. We don't just teach code; we forge problem solvers and innovators.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
            {features.map((feature, index) => (
              <div
                key={feature.text}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-sm"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'scale(1)' : 'scale(0.5)',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transitionDelay: `${1200 + index * 120}ms`,
                }}
              >
                <feature.icon className="w-4 h-4 text-[#a78bfa]" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
              transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: '1800ms',
            }}
          >
            <Link
              to="/courses"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#8b5cf6] text-white rounded-full font-semibold transition-all duration-300 hover:bg-[#7c3aed] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] overflow-hidden"
            >
              <span className="relative z-10">Initialize Your Legacy</span>
              <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent z-10" />
    </section>
  );
}

