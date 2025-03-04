import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserPlus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Signup = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    // Add signup logic here
    console.log('Signing up with:', formData);
    
    // Navigate to OTP verification
    navigate('/auth/otp-verification');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-300'
              }`}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-300'
              }`}
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-300'
              }`}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded hover:bg-primary/90 flex items-center justify-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Create Account
          </button>

          <p className="text-center text-sm">
            Already have an account?{' '}
            <a
              href="/auth/login"
              className="text-primary hover:text-primary/80"
              onClick={(e) => {
                e.preventDefault();
                navigate('/auth/login');
              }}
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;