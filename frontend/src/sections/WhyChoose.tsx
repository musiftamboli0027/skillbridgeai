import { useEffect, useRef, useState } from 'react';
import { Target, Users, CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Target,
    title: 'Job-Focused Training',
    description:
      '100% industry-relevant curriculum designed for immediate employability',
  },
  {
    icon: Users,
    title: 'Expert Mentorship',
    description:
      '1:1 guidance from industry professionals throughout your journey',
  },
  {
    icon: CheckCircle,
    title: 'Placement Assistance',
    description:
      'Dedicated placement team ensuring you land your dream job',
  },
];

export default function WhyChoose() {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 bg-[#020617]"
    >
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Why Choose <span className="text-[#8b5cf6]">SkillBridge</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto"
          >
            We don't just teach technology - we transform careers with a proven
            methodology.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass-card p-8 rounded-[2rem] border-white/5 group hover:bg-white/10 transition-all duration-500"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:scale-110 group-hover:rotate-6 transition-all"
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-[#8b5cf6] text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <span>→</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
