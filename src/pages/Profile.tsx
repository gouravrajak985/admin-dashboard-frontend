import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, updateUserProfile, clearError, resetSuccess } from '../redux/slices/authSlice';
import { AppDispatch, RootState } from '../redux/store';
import { Save, Camera } from 'lucide-react';
import Message from '../components/Message';
import Loader from '../components/Loader';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error, success } = useSelector((state: RootState) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');

  useEffect(() => {
    dispatch(getUserProfile());
    
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (success) {
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
      dispatch(resetSuccess());
    }
  }, [success, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    // Validate passwords match if changing password
    if (password && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    const userData = {
      name,
      email,
      password: password || undefined
    };

    dispatch(updateUserProfile(userData));
  };

  const inputClassName = "w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="border rounded-lg">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">My Profile</h2>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {error && <Message variant="error">{error}</Message>}
          {message && <Message variant="error">{message}</Message>}
          {loading && <Loader />}
          
          {/* Profile Header */}
          <div className="mb-8 text-center">
            <div className="relative inline-block">
              <img
                src={avatar}
                alt={name}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full cursor-pointer">
                  <Camera className="h-5 w-5" />
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              )}
            </div>
            <h1 className="mt-4 text-2xl font-bold">{name}</h1>
            <p className="text-gray-500">{user?.role || 'Seller'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClassName}
                      required
                    />
                  ) : (
                    <p className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">{name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClassName}
                      required
                    />
                  ) : (
                    <p className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">{email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Password Change (only when editing) */}
            {isEditing && (
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClassName}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClassName}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <p className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                    {user?.role || 'Seller'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Account Status</label>
                  <p className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                    {user?.isVerified ? 'Verified' : 'Not Verified'}
                  </p>
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
                    className="px-6 py-3 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                    disabled={loading}
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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