import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = ({ isAuthenticated, user, onLogout }) => {
  return (
    <nav className="fixed top-0 w-full z-1000 bg-dark/85 backdrop-blur-2xl border-b border-green-500/10">
      <div className="max-w-7xl mx-auto px-12 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black bg-gradient-to-r from-primary-green to-green-300 bg-clip-text text-transparent">
          FoodShare
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-8">
            <Link to="/" className="text-muted hover:text-primary-green transition-colors text-sm font-medium">Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-muted hover:text-primary-green transition-colors text-sm font-medium">Dashboard</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-muted hover:text-primary-green transition-colors text-sm font-medium">Admin</Link>
                )}
              </>
            )}
          </div>
          
          <div className="flex gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="px-5 py-2 text-sm font-medium text-primary-green border border-green-500/40 rounded-lg hover:bg-green-500/10 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2 text-sm font-medium text-white bg-primary-green rounded-lg hover:bg-primary-green-dark transition-colors">
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={onLogout}
                className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
