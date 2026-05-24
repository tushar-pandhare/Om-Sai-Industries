import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  forgotPassword, verifyOTP, resetPassword, clearForgotPassword
} from '../../features/auth/authSlice';
import {
  Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft,
  CheckCircle, RotateCcw, Store, ShieldCheck, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Step indicators ─────────────────────────────────────────────────────────
const STEPS = ['Enter Email', 'Verify OTP', 'New Password'];

const StepBar = ({ current }) => (
  <div className="flex items-center justify-between mb-8">
    {STEPS.map((label, i) => (
      <React.Fragment key={i}>
        <div className="flex flex-col items-center gap-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            i < current ? 'bg-green-500 text-white' :
            i === current ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
            'bg-gray-100 text-gray-400'
          }`}>
            {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          <span className={`text-[10px] font-medium ${i === current ? 'text-indigo-600' : 'text-gray-400'}`}>
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all duration-500 ${i < current ? 'bg-green-400' : 'bg-gray-200'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─── OTP Input boxes ──────────────────────────────────────────────────────────
const OTPInput = ({ value, onChange }) => {
  const inputs = useRef([]);
  const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      const next = digits.map((d, i) => i === idx ? '' : d).join('');
      onChange(next);
      if (idx > 0) inputs.current[idx - 1]?.focus();
      return;
    }
    if (e.key === 'ArrowLeft' && idx > 0) { inputs.current[idx - 1]?.focus(); return; }
    if (e.key === 'ArrowRight' && idx < 5) { inputs.current[idx + 1]?.focus(); return; }
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    if (!val) return;
    const next = digits.map((d, i) => i === idx ? val : d).join('');
    onChange(next);
    if (idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) { onChange(pasted.padEnd(6, '').slice(0, 6)); inputs.current[Math.min(pasted.length, 5)]?.focus(); }
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKey(e, i)}
          onPaste={handlePaste}
          className={`w-11 h-12 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all duration-200
            ${d ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-gray-50 text-gray-800'}
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100`}
        />
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, forgotPasswordSent, otpVerified, resetToken, passwordReset } = useSelector(s => s.auth);

  const [step, setStep] = useState(0);        // 0=email, 1=otp, 2=new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [localError, setLocalError] = useState('');

  // Advance step on Redux state change
  useEffect(() => { if (forgotPasswordSent && step === 0) { setStep(1); startResendTimer(); } }, [forgotPasswordSent]);
  useEffect(() => { if (otpVerified && step === 1) setStep(2); }, [otpVerified]);
  useEffect(() => {
    if (passwordReset) {
      toast.success('Password reset! Redirecting to login…');
      setTimeout(() => { dispatch(clearForgotPassword()); navigate('/login'); }, 2000);
    }
  }, [passwordReset]);

  // Cleanup on unmount
  useEffect(() => () => { dispatch(clearForgotPassword()); }, []);

  const startResendTimer = () => {
    setResendTimer(60);
    const t = setInterval(() => {
      setResendTimer(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; });
    }, 1000);
  };

  // ── Step 0: send OTP ──
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLocalError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setLocalError('Please enter a valid email address'); return; }
    dispatch(forgotPassword(email));
  };

  // ── Step 1: verify OTP ──
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (otp.length !== 6) { setLocalError('Please enter the complete 6-digit OTP'); return; }
    dispatch(verifyOTP({ email, otp }));
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setOtp('');
    setLocalError('');
    dispatch(forgotPassword(email));
    startResendTimer();
  };

  // ── Step 2: reset password ──
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (newPassword.length < 6) { setLocalError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setLocalError('Passwords do not match'); return; }
    dispatch(resetPassword({ resetToken, newPassword }));
  };

  const displayError = error || localError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 py-12 px-4">
      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Store className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {step === 0 && "We'll send a 6-digit OTP to your email"}
            {step === 1 && `OTP sent to ${email}`}
            {step === 2 && 'Create a strong new password'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <StepBar current={step} />

          {/* Error */}
          {displayError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{displayError}</p>
            </div>
          )}

          {/* ── Step 0: Email ── */}
          {step === 0 && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><Spinner /> Sending OTP…</> : <><Mail className="w-4 h-4" /> Send OTP</>}
              </button>
            </form>
          )}

          {/* ── Step 1: OTP ── */}
          {step === 1 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Enter 6-digit OTP</label>
                <OTPInput value={otp} onChange={setOtp} />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><Spinner /> Verifying…</> : <><KeyRound className="w-4 h-4" /> Verify OTP</>}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className="text-sm text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 flex items-center gap-1 mx-auto transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                <p className="text-xs text-blue-700 text-center">
                  Check your spam folder if you don't see the email. OTP valid for 10 minutes.
                </p>
              </div>
            </form>
          )}

          {/* ── Step 2: New Password ── */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Strength bar */}
                {newPassword && (
                  <div className="mt-2 flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        newPassword.length >= i * 3
                          ? i <= 1 ? 'bg-red-400' : i <= 2 ? 'bg-yellow-400' : i <= 3 ? 'bg-blue-400' : 'bg-green-400'
                          : 'bg-gray-200'
                      }`} />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showCpw ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      confirmPassword && confirmPassword !== newPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  <button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCpw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || (confirmPassword && confirmPassword !== newPassword)}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><Spinner /> Resetting…</> : <><ShieldCheck className="w-4 h-4" /> Reset Password</>}
              </button>
            </form>
          )}

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 justify-center transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-50px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
      `}</style>
    </div>
  );
};

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

export default ForgotPassword;
