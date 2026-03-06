import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Briefcase, 
  Cpu, 
  CheckCircle2,
  ChevronDown,
  User,
  Mail,
  Phone,
  ArrowRight
} from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    phone: '',
    university: '',
    college: '',
    universityManual: '',
    collegeManual: '',
    year: '1st Year',
    password: '',
    confirmPassword: ''
  });

  const [universities, setUniversities] = useState<{_id: string, name: string}[]>([]);
  const [colleges, setColleges] = useState<{_id: string, name: string}[]>([]);
  const [universityLoading, setUniversityLoading] = useState(false);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnis = async () => {
      setUniversityLoading(true);
      try {
        const res = await api.getUniversities();
        if (res.success) setUniversities(res.data);
      } catch {
        console.error('Failed to fetch universities');
      } finally {
        setUniversityLoading(false);
      }
    };
    fetchUnis();
  }, []);

  useEffect(() => {
    if (!formData.university || formData.university === 'other') {
      setColleges([]);
      return;
    }
    const fetchColleges = async () => {
      setCollegeLoading(true);
      try {
        const res = await api.getColleges(formData.university);
        if (res.success) setColleges(res.data);
      } catch {
        console.error('Failed to fetch colleges');
      } finally {
        setCollegeLoading(false);
      }
    };
    fetchColleges();
  }, [formData.university]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        phone: formData.phone,
        password: formData.password,
        universityId: formData.university === 'other' ? formData.universityManual : formData.university,
        collegeId: formData.college === 'other' ? formData.collegeManual : formData.college,
        year: formData.year,
        role: 'student'
      });

      if (success) {
        // You might want to use a toast here instead of alert
        navigate('/login');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
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
        <div className="w-full md:w-[55%] flex items-center justify-center p-4 sm:p-6 md:p-12 order-1 md:order-2 py-8 md:py-0">
          {/* Card */}
          <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-[20px] p-5 sm:p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/20 animate-in slide-in-from-right-10 duration-500">
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#1E293B]">Get Started</h2>
              <p className="text-[#64748B] mt-2 italic font-medium">Create your premium account today</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm font-medium">
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
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] transition-all placeholder-transparent"
                    required
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#2563EB] peer-focus:text-sm pointer-events-none">
                     Username
                  </label>
                  <User className="absolute right-0 top-3.5 w-4 h-4 text-slate-300 peer-focus:text-[#2563EB] transition-colors" />
                </div>

                {/* Full Name */}
                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] transition-all placeholder-transparent"
                    required
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#2563EB] peer-focus:text-sm pointer-events-none">
                     Full Name
                  </label>
                </div>

                {/* Email */}
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] transition-all placeholder-transparent"
                    required
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#2563EB] peer-focus:text-sm pointer-events-none">
                     Email Address
                  </label>
                  <Mail className="absolute right-0 top-3.5 w-4 h-4 text-slate-300 peer-focus:text-[#2563EB] transition-colors" />
                </div>

                {/* Phone */}
                <div className="relative group">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] transition-all placeholder-transparent"
                    required
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#2563EB] peer-focus:text-sm pointer-events-none">
                     Mobile Number
                  </label>
                  <Phone className="absolute right-0 top-3.5 w-4 h-4 text-slate-300 peer-focus:text-[#2563EB] transition-colors" />
                </div>

                {/* University Select */}
                <div className="relative">
                  <select
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled hidden></option>
                    <option value="" className="text-slate-400">
                      {universityLoading ? 'Loading Universities...' : 'Select University'}
                    </option>
                    {universities.map(uni => (
                      <option key={uni._id} value={uni._id}>{uni.name}</option>
                    ))}
                    <option value="other">Other (Manual Entry)</option>
                  </select>
                  <label className={`absolute left-0 pointer-events-none transition-all ${formData.university ? '-top-3.5 text-sm text-[#2563EB]' : 'top-3 text-slate-400 text-base'}`}>
                    University
                  </label>
                  <ChevronDown className="absolute right-0 top-3.5 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>

                {/* College Select */}
                <div className="relative">
                  <select
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    disabled={!formData.university || collegeLoading}
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] transition-all appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="" disabled hidden></option>
                    <option value="">
                      {collegeLoading ? 'Loading Colleges...' : 'Select College'}
                    </option>
                    {colleges.map(coll => (
                      <option key={coll._id} value={coll._id}>{coll.name}</option>
                    ))}
                    <option value="other">Other (Manual Entry)</option>
                  </select>
                  <label className={`absolute left-0 pointer-events-none transition-all ${formData.college ? '-top-3.5 text-sm text-[#2563EB]' : 'top-3 text-slate-400 text-base'}`}>
                    College
                  </label>
                  <ChevronDown className="absolute right-0 top-3.5 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>

                {/* Manual Uni Entry */}
                {formData.university === 'other' && (
                  <div className="relative col-span-1 md:col-span-2">
                    <input
                      type="text"
                      name="universityManual"
                      value={formData.universityManual}
                      onChange={handleChange}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] transition-all placeholder-transparent"
                    />
                    <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#2563EB] peer-focus:text-sm pointer-events-none">
                      Mention Your University
                    </label>
                  </div>
                )}

                {/* Manual Coll Entry */}
                {(formData.college === 'other') && (
                  <div className="relative col-span-1 md:col-span-2">
                    <input
                      type="text"
                      name="collegeManual"
                      value={formData.collegeManual}
                      onChange={handleChange}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] transition-all placeholder-transparent"
                    />
                    <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#2563EB] peer-focus:text-sm pointer-events-none">
                      Mention Your College
                    </label>
                  </div>
                )}

                {/* Year Select */}
                <div className="relative">
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] transition-all appearance-none cursor-pointer"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                  <label className="-top-3.5 text-sm text-[#2563EB] absolute left-0 pointer-events-none transition-all">
                    Academic Year
                  </label>
                  <ChevronDown className="absolute right-0 top-3.5 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>

                {/* Password section hidden or compact? Let's keep it clean */}
                <div className="relative group">
                   <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] transition-all placeholder-transparent"
                    required
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#2563EB] peer-focus:text-sm pointer-events-none">
                     Create Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-3.5 text-slate-300 hover:text-[#2563EB] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative group">
                   <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-slate-200 py-3 text-[#1E293B] focus:outline-none focus:border-[#2563EB] transition-all placeholder-transparent"
                    required
                  />
                  <label className="absolute left-0 -top-3.5 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#2563EB] peer-focus:text-sm pointer-events-none">
                     Confirm Password
                  </label>
                </div>

              </div>

              {/* Action */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white rounded-xl font-bold shadow-[0_10px_20px_rgba(37,99,235,0.15)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all focus:ring-4 focus:ring-[#2563EB]/10 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Register Now
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                
                <p className="text-center mt-8 text-slate-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#2563EB] font-bold hover:underline transition-all">
                    Login
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
