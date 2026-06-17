import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { setAuthToken, setUser, showToast } from '../utils/helpers';

const Register = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'donor'
  });
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
      const response = await authAPI.register(formData);
      setAuthToken(response.data.token);
      setUser(response.data.user);
      showToast('Registration successful!', 'success');
      onLoginSuccess(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-text flex">
      {/* Left Panel */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center p-8 md:p-12 bg-dark2 border-r border-green-500/10">
        <div className="max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-primary-green transition-colors text-sm font-medium mb-8">
            ← Back to Home
          </Link>

          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-muted mb-2 text-sm">Join FoodShare today</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm mt-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* Role Toggle */}
            <div>
              <label className="block text-xs font-bold text-muted mb-3 uppercase tracking-wider">
                I want to be a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="donor"
                    checked={formData.role === 'donor'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`p-3 rounded-lg border-2 text-center transition-all ${
                    formData.role === 'donor'
                      ? 'border-primary-green bg-green-500/10'
                      : 'border-green-500/10 bg-card'
                  }`}>
                    <div className="text-lg mb-1">🍱</div>
                    <div className="text-xs font-bold">Donor</div>
                  </div>
                </label>
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="receiver"
                    checked={formData.role === 'receiver'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`p-3 rounded-lg border-2 text-center transition-all ${
                    formData.role === 'receiver'
                      ? 'border-primary-orange bg-orange-500/10'
                      : 'border-green-500/10 bg-card'
                  }`}>
                    <div className="text-lg mb-1">🤝</div>
                    <div className="text-xs font-bold">Receiver</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 bg-card border border-green-500/10 rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary-green transition-colors"
                required
              />
            </div>

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
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
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
                placeholder="Create a strong password"
                className="w-full px-4 py-2 bg-card border border-green-500/10 rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary-green transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary-green text-white font-semibold rounded-lg hover:bg-primary-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-green font-semibold hover:text-green-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex lg:w-3/5 flex-col justify-end p-12 bg-gradient-to-b from-transparent via-transparent to-dark relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-6 leading-tight">
            Make a <span className="text-primary-green">Difference</span><br/>
            Today
          </h1>
          <p className="text-lg text-muted max-w-md mb-8 leading-relaxed">
            Whether you want to share surplus food or help someone in need, you're in the right place.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-primary-green">✓</span>
              <span className="text-muted">Help reduce food waste in your community</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary-green">✓</span>
              <span className="text-muted">Support people facing food insecurity</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary-green">✓</span>
              <span className="text-muted">Build meaningful connections</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
