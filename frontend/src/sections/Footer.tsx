import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ArrowRight } from 'lucide-react';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Our Courses', href: '/courses' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
];

const companyLinks = [
  { name: 'Life at SKILLBRIDGE', href: '/life' },
  { name: 'FAQ', href: '#' },
  { name: 'Recruiter Login', href: '/recruiter-login' },
];

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const footerRef = useRef<HTMLElement>(null);

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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="bg-[#f9f9f9] pt-16 pb-8 relative overflow-hidden"
    >
      {/* Top Border Gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)',
          transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.8s var(--ease-expo-out)',
        }}
      />

      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div
            className="lg:col-span-1"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s var(--ease-expo-out)',
              transitionDelay: '200ms',
            }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#8b5cf6] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-xl text-black">SKILLBRIDGE</span>
            </div>

            <p className="text-sm text-[#333333] mb-6 leading-relaxed">
              The future runs on SKILLBRIDGE. Transforming careers through
              world-class tech education and industry-focused training programs.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div
                className="flex items-start gap-3 text-sm text-[#333333]"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                  transitionDelay: '350ms',
                }}
              >
                <MapPin className="w-5 h-5 text-[#8b5cf6] flex-shrink-0 mt-0.5" />
                <span>
                 xyz
                </span>
              </div>
              <div
                className="flex items-center gap-3 text-sm text-[#333333]"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                  transitionDelay: '450ms',
                }}
              >
                <Mail className="w-5 h-5 text-[#8b5cf6] flex-shrink-0" />
                <a
                  href="mailto:skillbridge9@gmail.com"
                  className="hover:text-[#8b5cf6] transition-colors"
                >
                  skillbridge9@gmail.com
                </a>
              </div>
              <div
                className="flex items-center gap-3 text-sm text-[#333333]"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                  transitionDelay: '550ms',
                }}
              >
                <Phone className="w-5 h-5 text-[#8b5cf6] flex-shrink-0" />
                <a
                  href="tel:+918888806098"
                  className="hover:text-[#8b5cf6] transition-colors"
                >
                  +91 8888806098
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
              transition: 'all 0.5s var(--ease-expo-out)',
              transitionDelay: '400ms',
            }}
          >
            <h4 className="font-semibold text-black mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li
                  key={link.name}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-15px)',
                    transition: 'all 0.4s var(--ease-expo-out)',
                    transitionDelay: `${480 + index * 80}ms`,
                  }}
                >
                  <Link
                    to={link.href}
                    className="text-sm text-[#333333] hover:text-[#8b5cf6] hover:translate-x-1 inline-block transition-all duration-250"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
              transition: 'all 0.5s var(--ease-expo-out)',
              transitionDelay: '500ms',
            }}
          >
            <h4 className="font-semibold text-black mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li
                  key={link.name}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-15px)',
                    transition: 'all 0.4s var(--ease-expo-out)',
                    transitionDelay: `${580 + index * 80}ms`,
                  }}
                >
                  <Link
                    to={link.href}
                    className="text-sm text-[#333333] hover:text-[#8b5cf6] hover:translate-x-1 inline-block transition-all duration-250"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
              transition: 'all 0.5s var(--ease-expo-out)',
              transitionDelay: '600ms',
            }}
          >
            <h4 className="font-semibold text-black mb-4">Newsletter</h4>
            <p className="text-sm text-[#333333] mb-4">
              Get the latest updates on new courses and exclusive offers.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.5s var(--ease-expo-out)',
                transitionDelay: '750ms',
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-black/10 text-sm focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all duration-200"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#8b5cf6] text-white text-sm font-medium hover:bg-[#0f172a] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
              >
                Join
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.4s ease',
            transitionDelay: '900ms',
          }}
        >
          <p className="text-sm text-[#333333]/70">
            © 2026 SKILLBRIDGE. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-[#333333]/70 hover:text-[#8b5cf6] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-[#333333]/70 hover:text-[#8b5cf6] transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-[#333333]/70 hover:text-[#8b5cf6] transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
