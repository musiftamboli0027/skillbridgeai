import { useEffect, useRef, useState } from 'react';

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
  delay: number;
}

function StatItem({ value, suffix, label, decimals = 0, delay }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div
      ref={itemRef}
      className="text-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.7s var(--ease-expo-out)',
      }}
    >
      <div className="text-4xl md:text-5xl font-bold text-[#8b5cf6] mb-2 animate-pulse-glow">
        {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
        {suffix}
      </div>
      <div className="text-[#333333] text-sm md:text-base">{label}</div>
    </div>
  );
}

const stats = [
  { value: 100, suffix: '+', label: 'Students Trained' },
  { value: 95, suffix: '%', label: 'Job Placement' },
  { value: 8.5, suffix: ' LPA', label: 'Average Package', decimals: 1 },
  { value: 24, suffix: '/7', label: 'Mentor Support' },
];

export default function Stats() {
  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Subtle gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6]/5 via-transparent to-[#06b6d4]/5 pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              decimals={stat.decimals}
              delay={200 + index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
