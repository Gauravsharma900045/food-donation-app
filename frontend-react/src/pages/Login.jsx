import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { setAuthToken, setUser, showToast } from '../utils/helpers';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.login(formData);
      setAuthToken(response.data.token);
      setUser(response.data.user);
      showToast('Login successful!', 'success');
      onLoginSuccess(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-text flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-3/5 flex-col justify-end p-12 bg-gradient-to-b from-transparent via-transparent to-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-6 leading-tight">
            <span className="text-primary-green">Share</span> Food,<br/>
            <span className="text-primary-green">Save</span> Lives
          </h1>
          <p className="text-lg text-muted max-w-md mb-8 leading-relaxed">
            Join our community and make a difference. Connect with others and reduce food waste.
          </p>
          <div className="flex gap-4 flex-wrap">
            <div className="bg-dark2/80 backdrop-blur border border-green-500/20 px-4 py-2 rounded-full text-sm font-medium text-muted">
              ✓ Secure & Verified
            </div>
            <div className="bg-dark2/80 backdrop-blur border border-green-500/20 px-4 py-2 rounded-full text-sm font-medium text-muted">
              ✓ Community Driven
            </div>
            <div className="bg-dark2/80 backdrop-blur border border-green-500/20 px-4 py-2 rounded-full text-sm font-medium text-muted">
              ✓ Impact Focused
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center p-8 md:p-12 bg-dark2 border-l border-green-500/10">
        <div className="max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-primary-green transition-colors text-sm font-medium mb-8">
            ← Back to Home
          </Link>

          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-muted mb-8 text-sm">Sign in to your account to continue</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-card border border-green-500/10 rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary-green transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 bg-card border border-green-500/10 rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary-green transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary-green text-white font-semibold rounded-lg hover:bg-primary-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-green font-semibold hover:text-green-300 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
