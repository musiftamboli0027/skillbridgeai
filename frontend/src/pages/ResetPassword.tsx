import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Lock, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token || !email) {
            setStatus('error');
            setMessage('Invalid or missing password reset token.');
        }
    }, [token, email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            await api.resetPassword({ token: token!, email: email!, password });
            setStatus('success');
            setMessage('Your password has been reset successfully.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Link</h2>
                    <p className="text-gray-600 mb-6">The password reset link is invalid or missing required information.</p>
                    <Link to="/forgot-password" className="btn-primary inline-flex">Request New Link</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h1 className="text-2xl font-bold text-black mb-2 text-center">
                        Reset Password
                    </h1>
                    <p className="text-[#333333] text-center mb-6">
                        Enter your new password below.
                    </p>

                    {status === 'success' && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            <div>
                                <p className="font-bold">Success!</p>
                                <p>{message}</p>
                                <p className="text-xs mt-1">Redirecting to login...</p>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full pl-12 pr-12 py-3 border border-black/10 rounded-xl focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full pl-12 pr-12 py-3 border border-black/10 rounded-xl focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || status === 'success'}
                            className="w-full py-3 bg-[#8b5cf6] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#0f172a] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Reset Password
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
