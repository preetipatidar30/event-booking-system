import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiPhone, FiCheck, FiAlertCircle } from 'react-icons/fi';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Reset Password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Step 1: Email
    const [email, setEmail] = useState('');
    const [otpData, setOtpData] = useState(null);

    // Step 2: OTP
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');

    // Step 3: New Password
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Step 1: Request OTP
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.forgotPassword({ email });
            setOtpData(response.data.data);
            setSuccess('OTP sent successfully! Check the console or use the OTP shown below.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.verifyOTP({ email, otp });
            setResetToken(response.data.resetToken);
            setSuccess('OTP verified! Please set your new password.');
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await authAPI.resetPassword({ resetToken, newPassword, confirmPassword });
            setSuccess('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-[100px] opacity-20" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full filter blur-[100px] opacity-20" />
            </div>

            <div className="relative max-w-md w-full">
                {/* Back to Login Link */}
                <Link
                    to="/login"
                    className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <FiArrowLeft />
                    <span>Back to Login</span>
                </Link>

                {/* Card */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                    {/* Step Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step >= s
                                                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                                                : 'bg-slate-700 text-slate-400'
                                            }`}
                                    >
                                        {step > s ? <FiCheck /> : s}
                                    </div>
                                    {s < 3 && (
                                        <div
                                            className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-purple-500' : 'bg-slate-700'
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {step === 1 && 'Forgot Password?'}
                            {step === 2 && 'Enter OTP'}
                            {step === 3 && 'Reset Password'}
                        </h2>
                        <p className="text-slate-400">
                            {step === 1 && 'Enter your email to receive an OTP'}
                            {step === 2 && 'Enter the 6-digit code sent to your email/phone'}
                            {step === 3 && 'Create a new secure password'}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start space-x-3">
                            <FiAlertCircle className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl flex items-start space-x-3">
                            <FiCheck className="text-green-400 text-xl flex-shrink-0 mt-0.5" />
                            <p className="text-green-400 text-sm">{success}</p>
                        </div>
                    )}

                    {/* Step 1: Enter Email */}
                    {step === 1 && (
                        <form onSubmit={handleRequestOTP} className="space-y-6">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your registered email"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Enter OTP */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            {/* OTP Sent Info */}
                            {otpData && (
                                <div className="p-4 bg-slate-700/50 rounded-xl space-y-2 mb-4">
                                    <p className="text-slate-300 text-sm">
                                        <FiMail className="inline mr-2" />
                                        Email: <span className="text-white">{otpData.email}</span>
                                    </p>
                                    <p className="text-slate-300 text-sm">
                                        <FiPhone className="inline mr-2" />
                                        Phone: <span className="text-white">{otpData.phone}</span>
                                    </p>
                                    {/* Demo: Show OTP (remove in production) */}
                                    <div className="mt-3 p-3 bg-purple-500/20 rounded-lg border border-purple-500/50">
                                        <p className="text-purple-300 text-xs">Demo Mode - Your OTP:</p>
                                        <p className="text-2xl font-bold text-white tracking-widest">{otpData.otp}</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Enter 6-Digit OTP
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    required
                                    maxLength={6}
                                    className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white text-center text-2xl tracking-[0.5em] placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                />
                                <p className="text-slate-400 text-sm mt-2">
                                    Expires in: {otpData?.expiresIn || '10 minutes'}
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setOtp('');
                                    setError('');
                                    setSuccess('');
                                }}
                                className="w-full py-3 bg-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-600 transition-all"
                            >
                                Request New OTP
                            </button>
                        </form>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                        minLength={6}
                                        className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        required
                                        minLength={6}
                                        className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Password Match Indicator */}
                            {newPassword && confirmPassword && (
                                <div className={`flex items-center space-x-2 text-sm ${newPassword === confirmPassword ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {newPassword === confirmPassword ? <FiCheck /> : <FiAlertCircle />}
                                    <span>
                                        {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                    </span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Resetting Password...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Help Text */}
                <p className="text-center text-slate-400 mt-6">
                    Remember your password?{' '}
                    <Link to="/login" className="text-purple-400 hover:text-purple-300">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
