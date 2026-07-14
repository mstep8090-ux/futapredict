import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('user_email', response.data.email);
      localStorage.setItem('user_name', response.data.full_name);

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Side: The Form */}
      <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20">
        {/* Header */}
        <div className="w-full max-w-md mx-auto flex items-center gap-2">
          <img src="/futa_market_logo.png" alt="FUTA Market AI Logo" className="w-7 h-7 object-contain" />
          <span className="font-bold text-slate-800 text-lg tracking-tight">FUTA Market AI</span>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-2 font-normal">
              Enter your credentials to access your business analytics.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm text-center font-normal">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field with Floating Label */}
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 transition peer"
              />
              <label
                htmlFor="email"
                className="absolute text-sm text-slate-400 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-3 peer-focus:text-brand-800"
              >
                Email Address
              </label>
            </div>

            {/* Password Field with Floating Label */}
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand-800/10 focus:border-brand-800 transition peer"
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-slate-400 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-3 peer-focus:text-brand-800"
              >
                Password
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-800 border-slate-200 rounded focus:ring-brand-800"
                />
                <label htmlFor="remember-me" className="ml-2 text-slate-500 font-normal">
                  Remember me
                </label>
              </div>
              <a href="#" className="font-semibold text-brand-800 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-800 text-white py-3 rounded-xl font-medium hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:bg-brand-900 transition-all duration-150 text-sm flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold">Or continue with</span>
              </div>
            </div>

            {/* Google Mockup Button */}
            <button
              type="button"
              className="w-full border border-slate-200 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 active:bg-slate-100 transition text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="w-full max-w-md mx-auto text-center text-sm text-slate-500 font-normal">
          New to the platform?{' '}
          <Link to="/register" className="text-brand-800 font-semibold hover:underline">
            Create an account
          </Link>
        </div>
      </div>

      {/* Right Side: The Showcase */}
      <div 
        className="hidden lg:flex flex-col justify-center items-center p-12 text-white relative overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url("/futa_student_startup.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Abstract shape */}
        <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-brand-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-brand-600/10 rounded-full blur-3xl"></div>

        {/* Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md shadow-2xl relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/10">
            <img src="/futa_market_logo.png" alt="FUTA Market AI Logo" className="w-8 h-8 object-contain" />
          </div>
          
          <h3 className="text-2xl font-bold mb-4 tracking-tight leading-snug">
            Empower your FUTA Business with AI.
          </h3>
          
          <p className="text-white/80 text-sm leading-relaxed mb-6 font-normal">
            Know when to sell, where to sell, and what to sell across Obanla, South Gate, and beyond. Let data fuel your entrepreneurial path.
          </p>

          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="font-medium text-white/90">97% Demand Forecasting Accuracy</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="font-medium text-white/90">Granular Product & Location Models</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="font-medium text-white/90">Interactive ROI & Saturation Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
