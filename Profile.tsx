import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, Edit, Save, X, Lock, LogOut, 
  Upload, AlertTriangle, Clock, CheckCircle 
} from 'lucide-react';
import Modal from '../components/Modal';

// Define the User interface to match the backend schema
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  scheduledDeletionAt?: string;
}

const Profile = () => {
  const { user, logout, deleteUser, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [scheduledForDeletion, setScheduledForDeletion] = useState(false);
  const [deletionDate, setDeletionDate] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize edit form with user data
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if account is scheduled for deletion
    const checkDeletionStatus = async () => {
      try {
        const response = await fetch("/api/user", { 
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        const data = await response.json();
        
        if (data.scheduledDeletionAt) {
          setScheduledForDeletion(true);
          setDeletionDate(new Date(data.scheduledDeletionAt).toLocaleDateString());
        } else {
          setScheduledForDeletion(false);
          setDeletionDate(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    checkDeletionStatus();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          username: editForm.username,
          bio: editForm.bio,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Profile updated successfully!');
        // Update local user state
        if (user) {
          const updatedUser: User = {
            ...user,
            username: data.user.username,
            bio: data.user.bio,
          };
          setUser(updatedUser);
        }
        setIsEditing(false);
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('An error occurred while updating the profile.');
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(data.error || 'Password update failed');
      }
    } catch (error) {
      console.error('Password change failed:', error);
      alert('Error changing password');
    }
  };

  // Schedule account deletion (30-day delay)
  const scheduleAccountDeletion = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      const response = await fetch("/api/user/schedule-deletion", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to schedule deletion");

      const data = await response.json();
      alert(data.message);
      setScheduledForDeletion(true);
      
      // Calculate and set deletion date
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      setDeletionDate(thirtyDaysFromNow.toLocaleDateString());
      
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error scheduling deletion:", error);
      setDeleteError('Failed to schedule account deletion. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel scheduled deletion
  const cancelScheduledDeletion = async () => {
    try {
      const response = await fetch("/api/user/cancel-deletion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to cancel deletion");

      const data = await response.json();
      alert(data.message);
      setScheduledForDeletion(false);
      setDeletionDate(null);
      
      // Update user object in context
      if (user) {
        const updatedUser: User = {
          ...user,
          scheduledDeletionAt: undefined
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Error cancelling deletion:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Handle file upload for avatar
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await fetch('/api/user/upload-avatar', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          alert('Avatar updated successfully!');
          if (user) {
            const updatedUser: User = { ...user, avatarUrl: data.avatarUrl };
            setUser(updatedUser);
          }
        } else {
          alert(data.error || 'Failed to upload avatar');
        }
      } catch (error) {
        console.error('Avatar upload failed:', error);
        alert('Error uploading avatar');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

        {/* Deletion Warning Banner */}
        {scheduledForDeletion && (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Account Scheduled for Deletion
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Your account will be permanently deleted on <strong>{deletionDate}</strong>.
                    All your data will be lost. You can cancel the deletion before this date.
                  </p>
                  <button
                    onClick={cancelScheduledDeletion}
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Cancel Deletion
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleProfileUpdate}
                      className="p-2 text-green-600 hover:bg-gray-100 rounded-full"
                    >
                      <Save size={20} />
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-2 text-red-600 hover:bg-gray-100 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-blue-600 hover:bg-gray-100 rounded-full"
                  >
                    <Edit size={20} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{user?.username || 'Guest'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{user?.email || 'No email provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{user?.bio || 'No bio provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Type</label>
                  <p className="mt-1 text-gray-900 capitalize">{user?.role || 'Standard user'}</p>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Lock size={20} /> Security
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-8">
            {/* Profile Picture */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Profile"
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <span className="text-4xl text-gray-500">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-sm border border-gray-200 hover:bg-gray-100"
                >
                  <Upload size={16} />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{user?.username || 'Guest'}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Account Actions</h2>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                <LogOut size={16} /> Log Out
              </button>

              {scheduledForDeletion ? (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Deletion Scheduled</span>
                  </div>
                  <p className="text-xs text-yellow-700 mb-3">
                    Your account will be deleted on {deletionDate}.
                  </p>
                  <button
                    onClick={cancelScheduledDeletion}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                  >
                    <CheckCircle size={16} /> Cancel Deletion
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  <Trash2 size={16} /> Delete Account
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="text-center">
          <Trash2 className="mx-auto h-12 w-12 text-red-600" aria-hidden="true" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Delete Account</h3>
          <p className="mt-2 text-sm text-gray-500">
            Are you sure you want to delete your account? Your account will be scheduled for deletion in 30 days.
            During this period, you can log in and cancel the deletion process.
          </p>
          <p className="mt-2 text-sm font-medium text-red-600">
            After 30 days, all your data will be permanently deleted.
          </p>
          <div className="mt-5 sm:mt-6 flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-200 text-base font-medium text-gray-700 hover:bg-gray-300 focus:outline-none sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={scheduleAccountDeletion}
              disabled={isDeleting}
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:text-sm disabled:opacity-50"
            >
              {isDeleting ? 'Processing...' : 'Schedule Deletion'}
            </button>
          </div>
          {deleteError && (
            <p className="mt-3 text-sm text-red-600">{deleteError}</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
