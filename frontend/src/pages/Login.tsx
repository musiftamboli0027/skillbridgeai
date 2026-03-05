import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Briefcase, 
  Cpu, 
  CheckCircle2,
  User as UserIcon,
  ArrowRight
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If we're already logged in, redirect
    const storedToken = localStorage.getItem('skillbridge_token');
    const storedUser = localStorage.getItem('skillbridge_user');
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const role = user.role?.toLowerCase();
        if (role === 'admin' || role === 'university_admin' || role === 'super_admin') {
          navigate('/admin');
        } else if (role === 'recruiter') {
          navigate('/dashboard/recruiter');
        } else {
          navigate('/dashboard');
        }
      } catch {
        navigate('/dashboard');
      }
    }

    // Check for error in query params
    const hash = window.location.hash;
    const searchPart = hash.includes('?') ? hash.split('?')[1] : window.location.search;
    const params = new URLSearchParams(searchPart);
    const errorParam = params.get('error');
    if (errorParam) {
      setError(errorParam);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (user) {
        const role = user.role?.toLowerCase();
        if (role === 'admin' || role === 'university_admin' || role === 'super_admin') {
          navigate('/admin');
        } else if (role === 'recruiter') {
          if (user.recruiterProfile?.verificationStatus === 'Pending') {
            setError('Your recruiter account is pending verification by an Admin.');
            navigate('/dashboard');
          } else {
             navigate('/dashboard/recruiter');
          }
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Login failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/github`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#1E293B] animate-in fade-in duration-700">
      {/* Container for Split Screen */}
      <div className="flex flex-col md:flex-row w-full max-w-[1920px] mx-auto">
        
        {/* Left Section - Hero Section (45%) */}
        <div className="hidden md:flex w-full md:w-[45%] bg-gradient-to-br from-[#2563EB] to-[#14B8A6] p-8 md:p-16 text-white flex-col justify-between relative overflow-hidden order-2 md:order-1">
          {/* Abstract background shapes */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[100px]" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">SkillBridge</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Build Your Career <br /> With SkillBridge
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-md">
              AI-powered career roadmap for university students.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-6">
              {[
                { icon: GraduationCap, text: "University-based career path" },
                { icon: Cpu, text: "AI Skill tracking" },
                { icon: Briefcase, text: "Internship & placement guidance" }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20 transition-all group-hover:bg-white/20">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-white/95">{feature.text}</span>
                  <CheckCircle2 className="w-5 h-5 ml-auto text-white/40" />
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-sm text-white/60 mt-12 md:mt-0">
            © 2024 SkillBridge. All rights reserved.
          </div>
        </div>

        {/* Right Section - Form Area (55%) */}
        <div className="w-full md:w-[55%] flex items-center justify-center p-4 sm:p-6 md:p-12 order-1 md:order-2 min-h-screen md:min-h-0">
          {/* Card */}
          <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-[20px] p-6 sm:p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/20 animate-in slide-in-from-right-10 duration-500">
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#1E293B]">Welcome Back</h2>
              <p className="text-[#64748B] mt-2 italic font-medium">Please enter your details to sign in.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Account / Identifier */}
              <div className="relative group">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] transition-all placeholder-transparent"
                  required
                />
                <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#2563EB] peer-focus:text-sm pointer-events-none">
                  Email or Mobile Number
                </label>
                <UserIcon className="absolute right-0 top-3.5 w-4 h-4 text-slate-300 peer-focus:text-[#2563EB] transition-colors" />
              </div>

              {/* Password */}
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] transition-all placeholder-transparent"
                  required
                />
                <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#2563EB] peer-focus:text-sm pointer-events-none">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3.5 text-slate-300 hover:text-[#2563EB] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-end mt-[-1rem]">
                <Link to="/forgot-password"  className="text-sm font-semibold text-[#2563EB] hover:underline transition-all">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white rounded-xl font-bold shadow-[0_10px_20px_rgba(37,99,235,0.15)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all focus:ring-4 focus:ring-[#2563EB]/10 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#F8FAFC] px-4 text-slate-500 font-medium">Or continue with</span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate-100 rounded-xl hover:bg-slate-50 hover:border-[#2563EB]/10 transition-all font-medium text-sm text-[#1E293B]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button 
                  type="button"
                  onClick={handleGitHubLogin}
                  className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate-100 rounded-xl hover:bg-slate-50 hover:border-[#2563EB]/10 transition-all font-medium text-sm text-[#1E293B]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.774-.773 1.774-1.729V1.729C24 .774 23.205 0 22.225 0z" />
                  </svg>
                  LinkedIn
                </button>
              </div>

              <p className="text-center mt-8 text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#2563EB] font-bold hover:underline transition-all">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
