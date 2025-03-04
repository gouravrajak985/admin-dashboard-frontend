import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Login = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add login logic here
    console.log('Logging in with:', { email, password });
    
    // For demo purposes, navigate to OTP verification
    navigate('/auth/otp-verification');
    
    // In a real app, you would verify credentials first
    // then navigate to dashboard or OTP verification
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className={`max-w-md w-full mx-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      } rounded-lg shadow-lg p-8`}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <LayoutDashboard className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Admin Panel</h2>
          <p className="text-sm text-gray-500">Developed by Avirrav</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-300'
              }`}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-300'
              }`}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="remember" className="ml-2 text-sm">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-primary hover:text-primary/80">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded hover:bg-primary/90 flex items-center justify-center"
          >
            <Lock className="h-4 w-4 mr-2" />
            Sign In
          </button>

          <p className="text-center text-sm">
            Don't have an account?{' '}
            <a
              href="/auth/signup"
              className="text-primary hover:text-primary/80"
              onClick={(e) => {
                e.preventDefault();
                navigate('/auth/signup');
              }}
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;