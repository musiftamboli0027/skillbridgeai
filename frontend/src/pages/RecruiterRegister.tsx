import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Eye, 
  EyeOff, 
  Building2, 
  Briefcase, 
  Users, 
  CheckCircle2,
  User,
  Mail,
  ArrowRight,
  Globe,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

export default function RecruiterRegister() {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    companyName: '',
    companyWebsite: '',
    companyLogo: '',
    companyDescription: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const success = await register({
        username: formData.username,
        email: formData.email,
        name: formData.name || formData.username, 
        password: formData.password,
        role: 'recruiter',
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        companyLogo: formData.companyLogo,
        companyDescription: formData.companyDescription
      });

      if (success) {
        toast.success("Registration successful! Your corporate account is pending approval.");
        navigate('/recruiter-login');
      }
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Registration failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#1E293B] animate-in fade-in duration-700">
      {/* Container for Split Screen */}
      <div className="flex flex-col md:flex-row w-full max-w-[1920px] mx-auto">
        
        {/* Left Section - Hero Section (45%) */}
        <div className="w-full md:w-[45%] bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] p-8 md:p-16 text-white flex flex-col justify-between relative overflow-hidden order-2 md:order-1">
          {/* Abstract background shapes */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[100px]" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">SkillBridge Hiring</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Access Premium <br /> Verified Talent
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-md">
              Apply to join our curated recruiter network.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-6">
              {[
                { icon: Users, text: "Hire verified student talent" },
                { icon: Briefcase, text: "Performance-based filtering" },
                { icon: Building2, text: "Structured hiring pipeline" }
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

          <div className="relative z-10 mt-12 md:mt-0 space-y-4">
             <Link to="/register" className="text-sm font-bold text-white/80 hover:text-white transition-all underline underline-offset-4 block">
                Looking to build your skills? Join as Student
             </Link>
             <div className="text-sm text-white/60">
               © 2024 SkillBridge. All rights reserved.
             </div>
          </div>
        </div>

        {/* Right Section - Form Area (55%) */}
        <div className="w-full md:w-[55%] flex items-center justify-center p-6 md:p-12 order-1 md:order-2 overflow-y-auto">
          {/* Card */}
          <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-[20px] p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/20 animate-in slide-in-from-right-10 duration-500 my-8">
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#1E293B]">Apply as Recruiter</h2>
              <p className="text-[#64748B] mt-2 italic font-medium">Join our verified hiring ecosystem.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm font-medium animate-in fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Username */}
                <div className="relative group">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#7C3AED] transition-all placeholder-transparent"
                    required
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#7C3AED] peer-focus:text-sm pointer-events-none">
                     Username
                  </label>
                  <User className="absolute right-0 top-3.5 w-4 h-4 text-slate-300 peer-focus:text-[#7C3AED] transition-colors" />
                </div>

                {/* Full Name */}
                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#7C3AED] transition-all placeholder-transparent"
                    required
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#7C3AED] peer-focus:text-sm pointer-events-none">
                     Full Name
                  </label>
                </div>

                {/* Corporate Email */}
                <div className="relative group col-span-1 md:col-span-2">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#7C3AED] transition-all placeholder-transparent"
                    required
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#7C3AED] peer-focus:text-sm pointer-events-none">
                     Corporate Email Address
                  </label>
                  <Mail className="absolute right-0 top-3.5 w-4 h-4 text-slate-300 peer-focus:text-[#7C3AED] transition-colors" />
                </div>

                {/* Company Name */}
                <div className="relative group">
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#7C3AED] transition-all placeholder-transparent"
                    required
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#7C3AED] peer-focus:text-sm pointer-events-none">
                     Company Name
                  </label>
                  <Building2 className="absolute right-0 top-3.5 w-4 h-4 text-slate-300 peer-focus:text-[#7C3AED] transition-colors" />
                </div>

                {/* Company Website */}
                <div className="relative group">
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#7C3AED] transition-all placeholder-transparent"
                    required
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#7C3AED] peer-focus:text-sm pointer-events-none">
                     Company Website (URL)
                  </label>
                  <Globe className="absolute right-0 top-3.5 w-4 h-4 text-slate-300 peer-focus:text-[#7C3AED] transition-colors" />
                </div>

                {/* Company Logo URL */}
                <div className="relative group col-span-1 md:col-span-2">
                  <input
                    type="url"
                    name="companyLogo"
                    value={formData.companyLogo}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#7C3AED] transition-all placeholder-transparent"
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#7C3AED] peer-focus:text-sm pointer-events-none">
                     Company Logo URL (Optional)
                  </label>
                </div>

                {/* Company Description */}
                <div className="relative group col-span-1 md:col-span-2 mt-4">
                  <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    placeholder=" "
                    rows={3}
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#7C3AED] transition-all placeholder-transparent resize-y"
                    required
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#7C3AED] peer-focus:text-sm pointer-events-none">
                     Brief Company Description
                  </label>
                  <FileText className="absolute right-0 top-3.5 w-4 h-4 text-slate-300 peer-focus:text-[#7C3AED] transition-colors" />
                </div>

                <div className="relative group mt-2">
                   <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#7C3AED] transition-all placeholder-transparent"
                    required
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#7C3AED] peer-focus:text-sm pointer-events-none">
                     Create Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-3.5 text-slate-300 hover:text-[#7C3AED] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative group mt-2">
                   <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#7C3AED] transition-all placeholder-transparent"
                    required
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#7C3AED] peer-focus:text-sm pointer-events-none">
                     Confirm Password
                  </label>
                </div>

              </div>

              {/* Action */}
              <div className="pt-4 mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white rounded-xl font-bold shadow-[0_10px_20px_rgba(124,58,237,0.15)] hover:shadow-[0_15px_30px_rgba(124,58,237,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all focus:ring-4 focus:ring-[#7C3AED]/10 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                
                <p className="text-center mt-8 text-slate-500">
                  Already a verified partner?{' '}
                  <Link to="/recruiter-login" className="text-[#7C3AED] font-bold hover:underline transition-all">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
