import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { profileService } from '../services/profileService';
import PasswordChange from '../components/PasswordChange';
import FileUploadModal from '../components/FileUploadModal';
import DeleteAccountModal from '../components/DeleteAccountModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Profile.css';

const Profile = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();

    // State management
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [deletingPhoto, setDeletingPhoto] = useState(false);

    const [formData, setFormData] = useState(() => ({
        name: '',
        email: '',
        phoneNumber: '',
        bio: '',
        dateOfBirth: '',
        gender: ''
    }));

    const [stats, setStats] = useState(() => ({
        joinedDate: '',
        streak: 0,
        completedGoals: 0,
        totalCheckins: 0
    }));

    // Memoized values
    const profileImageUrl = useMemo(() => {
        return user?.profilePictureUrl || null;
    }, [user?.profilePictureUrl]);

    const userInitials = useMemo(() => {
        if (!user?.name) return 'U';
        return user.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }, [user?.name]);

    // Memoized handlers
    const fetchProfile = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            const result = await profileService.getProfile();
            if (result.success && result.data) {
                const profileData = result.data;

                // Batch state updates
                setFormData({
                    name: profileData.name || '',
                    email: profileData.email || '',
                    phoneNumber: profileData.phoneNumber || '',
                    bio: profileData.bio || '',
                    dateOfBirth: profileData.dateOfBirth || '',
                    gender: profileData.gender || ''
                });

                // Update user in context (single update)
                updateUser({
                    ...user,
                    ...profileData
                });

                // Format stats
                setStats({
                    joinedDate: formatDate(profileData.createdAt) || '2024-01-01',
                    streak: 14,
                    completedGoals: 8,
                    totalCheckins: 45
                });
            } else {
                toast.error('Failed to load profile');
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
            toast.error('Error loading profile');
        } finally {
            setLoading(false);
        }
    }, [user, updateUser]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Debounce the fetch to prevent multiple calls
        const timer = setTimeout(() => {
            fetchProfile();
        }, 100);

        return () => clearTimeout(timer);
    }, [user, navigate, fetchProfile]);

    const formatDate = useCallback((dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return '';
        }
    }, []);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSaveProfile = useCallback(async () => {
        setUpdating(true);
        try {
            const result = await profileService.updateProfile(formData);
            if (result.success) {
                toast.success('Profile updated successfully!');
                setIsEditing(false);

                // Update user in context
                if (result.data) {
                    updateUser({
                        ...user,
                        ...result.data
                    });
                }
            } else {
                toast.error(result.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Save profile error:', error);
            toast.error('Failed to update profile');
        } finally {
            setUpdating(false);
        }
    }, [formData, updateUser, user]);

    const handleFileUpload = useCallback(async (file) => {
        setUploadingPhoto(true);
        try {
            const result = await profileService.uploadProfilePicture(file);
            if (result.success) {
                toast.success('Profile picture updated!');
                setShowFileUpload(false);
                // Refresh only specific data instead of full fetch
                if (result.data) {
                    updateUser({
                        ...user,
                        profilePictureUrl: result.data
                    });
                }
            } else {
                toast.error(result.message || 'Failed to upload picture');
            }
        } catch (error) {
            console.error('File upload error:', error);
            toast.error('Failed to upload picture');
        } finally {
            setUploadingPhoto(false);
        }
    }, [updateUser, user]);

    const handleDeletePicture = useCallback(async () => {
        if (!window.confirm('Are you sure you want to remove your profile picture?')) {
            return;
        }

        setDeletingPhoto(true);
        try {
            const result = await profileService.deleteProfilePicture();
            if (result.success) {
                toast.success('Profile picture removed');
                // Update only the profile picture
                updateUser({
                    ...user,
                    profilePictureUrl: null
                });
            } else {
                toast.error(result.message || 'Failed to remove picture');
            }
        } catch (error) {
            console.error('Delete picture error:', error);
            toast.error('Failed to remove picture');
        } finally {
            setDeletingPhoto(false);
        }
    }, [updateUser, user]);

    const handleDeleteAccount = useCallback(async () => {
        try {
            const result = await profileService.deleteAccount();
            if (result.success) {
                toast.success('Account deleted successfully');
                logout();
                navigate('/');
            } else {
                toast.error(result.message || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Delete account error:', error);
            toast.error('Failed to delete account');
        } finally {
            setShowDeleteModal(false);
        }
    }, [logout, navigate]);

    // Prevent unnecessary re-renders
    if (loading && !user) {
        return (
            <div className="profile-loading">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="profile-container" key="profile-container">
            {/* Header Section - Fixed with stable keys */}
            <div className="profile-header" key="profile-header">
                <div className="profile-header-content">
                    <div className="profile-avatar-wrapper">
                        {profileImageUrl ? (
                            <div className="profile-avatar-image" key="avatar-image">
                                <img
                                    src={profileImageUrl}
                                    alt={user.name}
                                    className="profile-avatar-img"
                                    key="avatar-img"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        const parent = e.target.parentElement;
                                        const fallback = document.createElement('div');
                                        fallback.className = 'profile-avatar';
                                        fallback.innerHTML = `<span>${userInitials}</span>`;
                                        parent.appendChild(fallback);
                                    }}
                                />
                                {deletingPhoto && (
                                    <div className="avatar-overlay">
                                        <LoadingSpinner size="small" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="profile-avatar" key="avatar-initials">
                                <span>{userInitials}</span>
                            </div>
                        )}

                        <button
                            className="profile-edit-btn"
                            onClick={() => setShowFileUpload(true)}
                            disabled={uploadingPhoto || deletingPhoto}
                            key="edit-avatar-btn"
                        >
                            {uploadingPhoto || deletingPhoto ? (
                                <LoadingSpinner size="small" />
                            ) : (
                                <svg className="edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <h1 className="profile-name" key="profile-name">{user.name}</h1>
                    <p className="profile-email" key="profile-email">{user.email}</p>

                    {user.emailVerified ? (
                        <div className="email-verified-badge" key="verified-badge">
                            <svg className="verified-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Email Verified
                        </div>
                    ) : (
                        <button className="verify-email-btn" key="verify-email-btn">
                            Verify Email
                        </button>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="profile-content-wrapper">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="profile-grid"
                    key="profile-grid"
                >
                    {/* Personal Information Card */}
                    <ProfileInfoCard
                        isEditing={isEditing}
                        formData={formData}
                        onInputChange={handleInputChange}
                        onSave={handleSaveProfile}
                        onToggleEdit={() => setIsEditing(!isEditing)}
                        updating={updating}
                    />

                    {/* Stats Card */}
                    <StatsCard
                        stats={stats}
                        user={user}
                        formatDate={formatDate}
                        onViewDashboard={() => navigate('/dashboard')}
                    />

                    {/* Account Settings Card */}
                    <AccountSettingsCard
                        user={user}
                        onPasswordChange={() => setShowPasswordChange(true)}
                        onDeletePicture={handleDeletePicture}
                        deletingPhoto={deletingPhoto}
                        onLogout={logout}
                        onDeleteAccount={() => setShowDeleteModal(true)}
                    />
                </motion.div>
            </div>

            {/* Modals */}
            <AnimatePresence mode="wait">
                {showPasswordChange && (
                    <PasswordChange
                        key="password-change-modal"
                        onClose={() => setShowPasswordChange(false)}
                    />
                )}

                {showFileUpload && (
                    <FileUploadModal
                        key="file-upload-modal"
                        onClose={() => setShowFileUpload(false)}
                        onUpload={handleFileUpload}
                        uploading={uploadingPhoto}
                    />
                )}

                {showDeleteModal && (
                    <DeleteAccountModal
                        key="delete-account-modal"
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDeleteAccount}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Extract Card Components to prevent re-renders
const ProfileInfoCard = React.memo(({
                                        isEditing,
                                        formData,
                                        onInputChange,
                                        onSave,
                                        onToggleEdit,
                                        updating
                                    }) => (
    <div className="profile-card">
        <h2 className="profile-card-title">Personal Information</h2>

        <FormField
            label="Full Name"
            isEditing={isEditing}
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Enter your name"
            type="text"
        />

        <ReadOnlyField label="Email Address" value={formData.email} />

        <FormField
            label="Phone Number"
            isEditing={isEditing}
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={onInputChange}
            placeholder="+1234567890"
            type="tel"
        />

        <FormField
            label="Bio"
            isEditing={isEditing}
            name="bio"
            value={formData.bio}
            onChange={onInputChange}
            placeholder="Tell us about yourself..."
            type="textarea"
            rows={3}
        />

        {isEditing && (
            <FormField
                label="Gender"
                isEditing={isEditing}
                name="gender"
                value={formData.gender}
                onChange={onInputChange}
                type="select"
                options={[
                    { value: '', label: 'Select gender' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Non-binary', label: 'Non-binary' },
                    { value: 'Other', label: 'Other' },
                    { value: 'Prefer not to say', label: 'Prefer not to say' }
                ]}
            />
        )}

        {isEditing && (
            <FormField
                label="Date of Birth"
                isEditing={isEditing}
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={onInputChange}
                type="date"
            />
        )}

        <div className="profile-action-buttons">
            {isEditing ? (
                <>
                    <button
                        onClick={() => onToggleEdit(false)}
                        className="profile-cancel-btn"
                        disabled={updating}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        disabled={updating}
                        className="profile-save-btn"
                    >
                        {updating ? (
                            <>
                                <LoadingSpinner size="small" className="btn-spinner" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </>
            ) : (
                <button
                    onClick={() => onToggleEdit(true)}
                    className="profile-edit-toggle"
                >
                    Edit Profile
                </button>
            )}
        </div>
    </div>
));

const StatsCard = React.memo(({ stats, user, formatDate, onViewDashboard }) => (
    <div className="profile-card">
        <h2 className="profile-card-title">Your Journey</h2>

        <div className="profile-stats">
            <div className="stats-item">
                <span className="stats-label">Member Since</span>
                <span className="stats-value">{stats.joinedDate}</span>
            </div>

            <div className="stats-item">
                <span className="stats-label">Current Streak</span>
                <span className="stats-value">{stats.streak} days</span>
            </div>

            <div className="stats-item">
                <span className="stats-label">Goals Completed</span>
                <span className="stats-value">{stats.completedGoals}</span>
            </div>

            <div className="stats-item">
                <span className="stats-label">Total Check-ins</span>
                <span className="stats-value">{stats.totalCheckins}</span>
            </div>

            <div className="stats-item">
                <span className="stats-label">Last Login</span>
                <span className="stats-value">
                    {user.lastLogin ? formatDate(user.lastLogin) : 'N/A'}
                </span>
            </div>
        </div>

        <button
            onClick={onViewDashboard}
            className="profile-stats-btn"
        >
            <svg className="stats-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Detailed Dashboard
        </button>
    </div>
));

const AccountSettingsCard = React.memo(({
                                            user,
                                            onPasswordChange,
                                            onDeletePicture,
                                            deletingPhoto,
                                            onLogout,
                                            onDeleteAccount
                                        }) => (
    <div className="profile-card">
        <h2 className="profile-card-title">Account Settings</h2>

        <div className="profile-actions">
            <button
                onClick={onPasswordChange}
                className="profile-action-btn"
            >
                <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Change Password
            </button>

            {user.profilePictureUrl && (
                <button
                    onClick={onDeletePicture}
                    disabled={deletingPhoto}
                    className="profile-action-btn"
                >
                    {deletingPhoto ? (
                        <>
                            <LoadingSpinner size="small" />
                            Removing...
                        </>
                    ) : (
                        <>
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove Profile Picture
                        </>
                    )}
                </button>
            )}

            <button
                onClick={() => toast.info('Coming soon!')}
                className="profile-action-btn"
            >
                <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notification Settings
            </button>

            <button
                onClick={onLogout}
                className="profile-logout-btn"
            >
                <svg className="logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
            </button>
        </div>

        {/* Danger Zone */}
        <div className="danger-zone">
            <h3 className="danger-title">
                <svg className="danger-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.146 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Danger Zone
            </h3>
            <p className="danger-description">
                Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
                onClick={onDeleteAccount}
                className="danger-btn"
            >
                <svg className="trash-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Account
            </button>
        </div>
    </div>
));

// Form field components
const FormField = React.memo(({
                                  label,
                                  isEditing,
                                  name,
                                  value,
                                  onChange,
                                  placeholder,
                                  type = 'text',
                                  rows,
                                  options = []
                              }) => {
    if (!isEditing && type !== 'textarea') {
        return <ReadOnlyField label={label} value={value || 'Not provided'} />;
    }

    if (!isEditing && type === 'textarea') {
        return (
            <div className="form-group">
                <label className="form-label">{label}</label>
                <div className="profile-readonly profile-bio">
                    {value || 'No bio provided'}
                </div>
            </div>
        );
    }

    return (
        <div className="form-group">
            <label className="form-label">{label}</label>
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="profile-textarea"
                    placeholder={placeholder}
                    rows={rows}
                />
            ) : type === 'select' ? (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="profile-input"
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="profile-input"
                    placeholder={placeholder}
                />
            )}
        </div>
    );
});

const ReadOnlyField = React.memo(({ label, value }) => (
    <div className="form-group">
        <label className="form-label">{label}</label>
        <div className="profile-readonly">{value}</div>
    </div>
));

ProfileInfoCard.displayName = 'ProfileInfoCard';
StatsCard.displayName = 'StatsCard';
AccountSettingsCard.displayName = 'AccountSettingsCard';
FormField.displayName = 'FormField';
ReadOnlyField.displayName = 'ReadOnlyField';

export default Profile;