import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

export const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(user?.profilePhoto);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfilePhoto(user.profilePhoto);
    }
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('File size must be less than 5MB');
          e.target.value = '';
          return;
        }
        setPhotoFile(file);
        setError('');
        
        // Preview the image
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          setProfilePhoto(base64);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select an image file');
        e.target.value = '';
        setPhotoFile(null);
      }
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSavePhoto = async () => {
    if (!user) {
      setError('You must be logged in');
      return;
    }

    if (!photoFile && !profilePhoto) {
      setError('Please select a photo to upload');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let photoData = profilePhoto;
      
      if (photoFile) {
        photoData = await convertFileToBase64(photoFile);
      }

      if (photoData) {
        const success = authService.updateProfilePhoto(user.id, photoData);
        if (success) {
          setSuccess('Profile photo updated successfully!');
          setPhotoFile(null);
          // Refresh user data in context without reloading page
          refreshUser();
        } else {
          setError('Failed to update profile photo');
        }
      }
    } catch (err) {
      setError('Failed to upload photo. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    const success = authService.updateProfilePhoto(user.id, '');
    if (success) {
      setProfilePhoto(undefined);
      setPhotoFile(null);
      setSuccess('Profile photo removed successfully!');
      // Refresh user data in context without reloading page
      refreshUser();
    } else {
      setError('Failed to remove profile photo');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400 text-sm sm:text-base">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/dashboard" className="text-ruby-400 hover:text-ruby-300 mb-2 inline-block text-sm sm:text-base font-medium transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            <span className="bg-gradient-to-r from-ruby-400 to-ruby-600 bg-clip-text text-transparent">My Profile</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">Manage your profile information and photo</p>
        </div>

        <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-ruby-600/30">
          {error && (
            <div className="bg-ruby-900/50 border-2 border-ruby-600 text-ruby-200 px-4 py-3 rounded-lg mb-4 text-sm sm:text-base">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-ruby-900/30 border-2 border-ruby-500 text-ruby-200 px-4 py-3 rounded-lg mb-4 text-sm sm:text-base">
              {success}
            </div>
          )}

          <div className="space-y-6 sm:space-y-8">
            {/* Profile Photo Section */}
            <div className="border-b-2 border-ruby-600/30 pb-6 sm:pb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Profile Photo</h2>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-shrink-0">
                  {profilePhoto ? (
                    <img
                      src={`data:image/jpeg;base64,${profilePhoto}`}
                      alt="Profile"
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-ruby-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-800 flex items-center justify-center border-4 border-ruby-500 shadow-lg">
                      <span className="text-4xl sm:text-5xl text-ruby-400">👤</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-white mb-2">
                      Upload New Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500 text-sm sm:text-base"
                    />
                    <p className="mt-2 text-xs sm:text-sm text-gray-400">
                      Supported formats: JPG, PNG, GIF. Max size: 5MB
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleSavePhoto}
                      disabled={loading}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-ruby-600 to-ruby-700 hover:from-ruby-700 hover:to-ruby-800 text-white rounded-lg text-sm sm:text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-ruby-glow transition-all transform hover:scale-105 active:scale-95"
                    >
                      {loading ? 'Saving...' : 'Save Photo'}
                    </button>
                    {profilePhoto && (
                      <button
                        onClick={handleRemovePhoto}
                        disabled={loading}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm sm:text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all transform hover:scale-105 active:scale-95"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information Section */}
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Profile Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-white mb-2">
                    Name
                  </label>
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border-2 border-gray-700 rounded-lg text-sm sm:text-base text-gray-300">
                    {user.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-white mb-2">
                    Email
                  </label>
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border-2 border-gray-700 rounded-lg text-sm sm:text-base text-gray-300">
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-white mb-2">
                    Role
                  </label>
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border-2 border-gray-700 rounded-lg">
                    <span className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg ${
                      user.role === 'admin' ? 'bg-ruby-900/50 text-ruby-300 border border-ruby-600' :
                      user.role === 'teacher' ? 'bg-ruby-900/50 text-ruby-300 border border-ruby-600' :
                      'bg-ruby-900/50 text-ruby-300 border border-ruby-600'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-white mb-2">
                    User ID
                  </label>
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/50 border-2 border-gray-700 rounded-lg text-xs sm:text-sm font-mono text-gray-400 break-all">
                    {user.id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

