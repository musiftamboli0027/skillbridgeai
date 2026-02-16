import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            await api.forgotPassword(email);
            setStatus('success');
            setMessage('If an account exists with this email, you will receive a password reset link shortly.');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Gradient Orbs */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-[#8b5cf6]/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8b5cf6]/20 rounded-full blur-3xl" />

            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="mb-6">
                        <Link to="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Login
                        </Link>
                    </div>

                    <h1 className="text-2xl font-bold text-black mb-2 text-center">
                        Forgot Password?
                    </h1>
                    <p className="text-[#333333] text-center mb-6">
                        Enter your email address to verify your identity and help us secure your account.
                    </p>

                    {status === 'success' && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                            <p className="font-bold mb-1">Check your email</p>
                            <p>{message}</p>
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
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all"
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
                                    Send Reset Link
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
