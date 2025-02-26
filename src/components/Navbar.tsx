import React, { useState } from 'react';
import { Search, Sun, Moon, MessageCircle, Bell, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  };

  return (
    <nav className={`fixed top-0 left-64 right-0 h-16 ${
      theme === 'dark' 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-shopify-border'
    } border-b px-4 flex items-center justify-between z-10`}>
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-shopify-text-secondary" />
          <input
            type="text"
            placeholder="Search..."
            className={`w-full pl-10 pr-4 py-2 border rounded-md ${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-800 placeholder-gray-500'
                : 'bg-shopify-surface border-shopify-border placeholder-shopify-text-secondary focus:border-shopify-focus focus:ring-1 focus:ring-shopify-focus'
            }`}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-md hover:bg-shopify-surface ${
            theme === 'dark' 
              ? 'border-gray-800' 
              : 'text-shopify-text-secondary'
          }`}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        <button className={`p-2 rounded-md hover:bg-shopify-surface ${
          theme === 'dark' 
            ? 'border-gray-800' 
            : 'text-shopify-text-secondary'
        }`}>
          <MessageCircle className="h-5 w-5" />
        </button>
        
        <button className={`p-2 rounded-md hover:bg-shopify-surface ${
          theme === 'dark' 
            ? 'border-gray-800' 
            : 'text-shopify-text-secondary'
        }`}>
          <Bell className="h-5 w-5" />
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center space-x-3 p-2 rounded-md ${
              theme === 'dark' 
                ? 'hover:bg-gray-800' 
                : 'hover:bg-shopify-surface'
            }`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full"
            />
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-shopify-text-secondary">{user.email}</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            } ring-1 ring-black ring-opacity-5`}>
              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowProfileMenu(false);
                  }}
                  className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-800' 
                      : 'hover:bg-shopify-surface text-shopify-text'
                  }`}
                >
                  <User className="inline-block w-4 h-4 mr-2" />
                  Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;