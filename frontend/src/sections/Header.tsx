import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

// Links configuration
const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'About', href: '/about' },
  { name: 'Life', href: '/life' },
  { name: 'Career', href: '/careers' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isSolid = isScrolled || !isHomePage;

  const dashboardUrl = user?.role === 'admin' ? '/admin' : '/dashboard';

  // --- Optimized Scroll Listener ---
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Update state only if value effectively changes to minimize re-renders
          setIsScrolled(prev => {
            const next = window.scrollY > 50;
            return prev !== next ? next : prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // --- Auto-close Mobile Menu on Route Change ---
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // --- Safe Section Scrolling ---
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, link: { href: string; hash?: string }) => {
    // If it's a hash link on the home page
    if (link.hash && location.pathname === '/') {
      e.preventDefault();
      const element = document.querySelector(link.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Optional: update URL hash without jump
        window.history.pushState(null, '', link.hash);
      }
      setIsMobileMenuOpen(false);
    }
    // If on another page, let generic Link behavior (to="/") handle it, 
    // and ideally you'd have a useLayoutEffect on the home page to detect hash on mount.
  }, [location.pathname]);

  // --- Button Styles with Accessibility & Contrast Checks ---

  // Outline Button (Sign In)
  const outlineBtnClass = cn(
    "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold border transition-all duration-300 hover:-translate-y-0.5 animate-fade-slide-down",
    isSolid
      ? "border-slate-200 text-slate-900 hover:border-primary hover:text-primary hover:bg-slate-50" // Solid Header: Dark text, light border
      : "border-white/30 text-white hover:bg-white/10 hover:border-white" // Transparent Header: White text/border
  );

  // Primary Button (Logout, Sign Up)
  // Fix: Ensure distinct high-contrast look when scrolled
  const primaryBtnClass = cn(
    "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg animate-scale-pop active:scale-95",
    isSolid
      ? "bg-slate-900 hover:bg-slate-800 hover:shadow-slate-900/20" // Solid Header: Deep dark button for max contrast
      : "bg-gradient-to-r from-primary to-purple-600 hover:shadow-primary/30 border border-white/10" // Transparent Header: Vibrant Gradient
  );

  // Text color for logo and icons
  const logoAndIconTextColorClass = isSolid ? 'text-slate-900' : 'text-white';

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[70px]",
        isSolid
          ? "glass shadow-md bg-white/80 backdrop-blur-xl border-b border-slate-200/50" // Stronger glass effect
          : "bg-transparent"
      )}
      style={{ height: '70px' }}
    >
      <div className="container-custom h-full flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group animate-fade-slide-down" aria-label="SkillBridge Home">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div className="flex flex-col">
            <span className={cn("font-bold text-lg leading-tight transition-colors duration-300", logoAndIconTextColorClass)}>
              SKILLBRIDGE
            </span>
            <span className={cn("text-[8px] tracking-wider font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 opacity-90")}>
              THE FUTURE RUNS ON SKILLBRIDGE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8" role="navigation">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className={cn(
                "relative text-sm font-medium transition-all duration-300 hover:text-primary hover:-translate-y-0.5 animate-fade-slide-down group py-2",
                isSolid ? 'text-slate-600 hover:text-slate-900' : 'text-white/90 hover:text-white'
              )}
              style={{ animationDelay: `${100 + index * 50}ms` }}
            >
              {link.name}
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 -translate-x-1/2 group-hover:w-full ease-out" />
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardUrl}
                className={primaryBtnClass}
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className={outlineBtnClass}
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={outlineBtnClass}>
                Sign In
              </Link>
              <Link
                to="/register"
                className={primaryBtnClass}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className={cn("w-6 h-6", logoAndIconTextColorClass)} />
          ) : (
            <Menu className={cn("w-6 h-6", logoAndIconTextColorClass)} />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={cn(
          "lg:hidden absolute top-[70px] left-0 right-0 bg-white shadow-xl border-t border-slate-100 transition-all duration-300 transform origin-top overflow-hidden",
          isMobileMenuOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible h-0"
        )}
      >
        <nav className="container-custom py-6 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="text-slate-700 font-medium py-3 px-4 rounded-xl hover:bg-slate-50 hover:text-primary transition-colors flex items-center justify-between group"
            >
              {link.name}
              <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}

          <div className="h-px bg-slate-100 my-2" />

          <div className="flex flex-col gap-3 pt-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardUrl}
                  className="w-full px-5 py-3 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-all text-center"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full px-5 py-3 rounded-xl text-sm font-bold border border-slate-200 text-slate-900 hover:border-primary hover:text-primary transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full px-5 py-3 rounded-xl text-sm font-bold border border-slate-200 text-slate-900 hover:border-primary hover:text-primary transition-all text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full px-5 py-3 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-all text-center shadow-lg shadow-primary/20"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
