import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Save, ArrowLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    role: 'Administrator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Experienced administrator with expertise in e-commerce management and customer relations.',
    location: 'New York, USA',
    joinDate: '2023-01-15',
    lastLogin: '2024-03-20 14:30'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Add profile update logic here
    console.log('Updated profile:', formData);
  };

  const inputClassName = `w-full p-3 border ${
    theme === 'dark'
      ? 'bg-gray-900 border-gray-800'
      : 'bg-white border-gray-200'
  }`;

  return (
    <div className={`border ${
      theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
    }`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/home')}
            className={`p-2 mr-4 border ${
              theme === 'dark' ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">Admin Profile</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8 text-center">
            <div className="relative inline-block">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full cursor-pointer">
                  <Camera className="h-5 w-5" />
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              )}
            </div>
            <h1 className="mt-4 text-2xl font-bold">{formData.name}</h1>
            <p className="text-gray-500">{formData.role}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className={`p-6 border ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClassName}
                    />
                  ) : (
                    <p className="p-3">{formData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClassName}
                    />
                  ) : (
                    <p className="p-3">{formData.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={inputClassName}
                    />
                  ) : (
                    <p className="p-3">{formData.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={inputClassName}
                    />
                  ) : (
                    <p className="p-3">{formData.location}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className={`p-6 border ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className={`${inputClassName} h-32`}
                    />
                  ) : (
                    <p className="p-3">{formData.bio}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Join Date</label>
                    <p className="p-3">{formData.joinDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Login</label>
                    <p className="p-3">{formData.lastLogin}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className={`px-6 py-3 border ${
                      theme === 'dark'
                        ? 'border-gray-800 hover:bg-gray-900'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-3 ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-black'
                    } text-white hover:opacity-90 flex items-center`}
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={`px-6 py-3 ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-black'
                  } text-white hover:opacity-90`}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;