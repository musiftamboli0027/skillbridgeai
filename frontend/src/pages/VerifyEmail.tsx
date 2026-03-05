import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email address...');
    const { setAuth } = useAuth();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        const performVerification = async () => {
            if (!token || !email) {
                setStatus('error');
                setMessage('Missing verification token or email. Please check your link.');
                return;
            }

            try {
                const response = await api.verifyEmail(token, email);
                if (response.success) {
                    setStatus('success');
                    setMessage(response.message || 'Email verified successfully!');

                    // Store token and user if returned (direct login)
                    if (response.token && response.user) {
                        setAuth(response.token, response.user);
                    }
                } else {
                    setStatus('error');
                    setMessage(response.message || 'Verification failed.');
                }
            } catch (error: any) {
                setStatus('error');
                setMessage(error.message || 'An error occurred during verification.');
            }
        };

        performVerification();
    }, [token, email]);

    return (
        <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {status === 'loading' && (
                    <div className="animate-fade-in">
                        <Loader2 className="w-16 h-16 text-[#8b5cf6] animate-spin mx-auto mb-6" />
                        <h1 className="text-2xl font-bold text-black mb-2">Verifying Email</h1>
                        <p className="text-[#333333]/70">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-fade-in">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-black mb-2">Verification Successful!</h1>
                        <p className="text-[#333333]/70 mb-8">{message}</p>
                        <Link
                            to="/dashboard"
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            Go to Dashboard
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-fade-in">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-black mb-2">Verification Failed</h1>
                        <p className="text-[#333333]/70 mb-8">{message}</p>
                        <div className="space-y-4">
                            <Link
                                to="/login"
                                className="btn-primary w-full inline-block"
                            >
                                Back to Login
                            </Link>
                            <p className="text-sm text-[#333333]/50">
                                Link expired? Try logging in to resend the activation mail.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
