import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/useAuthStore';
import Layout from '../components/Layout';

interface UserProfile {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // In a real app, this would fetch profile data from backend
      // For now, we'll use the user data from auth store
      setProfile({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '',
        address: '',
        dateOfBirth: '',
      });
    } catch (error: any) {
      toast.error('Failed to load profile');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would save to backend
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Update your personal details and contact information.
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-md"
                    />
                  ) : (
                    profile.fullName
                  )}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-md"
                    />
                  ) : (
                    profile.email
                  )}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-md"
                      placeholder="+1234567890"
                    />
                  ) : (
                    profile.phone || 'Not provided'
                  )}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <textarea
                      value={profile.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-md"
                      placeholder="Enter your address"
                    />
                  ) : (
                    profile.address || 'Not provided'
                  )}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-md"
                    />
                  ) : (
                    profile.dateOfBirth || 'Not provided'
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {isEditing && (
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Account Security */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Account Security</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage your password and security settings.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Password</h4>
                  <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                </div>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Change Password
                </button>
              </div>
            </div>
            <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;