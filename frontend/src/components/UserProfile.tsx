import React, { useState, useRef } from 'react';
import {
  User,
  Lock,
  Save,
  AlertCircle,
  Eye,
  EyeOff,
  Camera,
  Pencil,
  X,
  Mail,
  AtSign,
  Shield,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';

const inputBase =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-900 placeholder:text-slate-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 focus:bg-white transition-all duration-200';

export function UserProfile() {
  const { user, logout, refreshUser } = useAuth();
  const [username, setUsername] = useState(user?.username ?? '');
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar ?? null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  React.useEffect(() => {
    setUsername(user?.username ?? '');
    setFirstName(user?.firstName ?? '');
    setLastName(user?.lastName ?? '');
    setAvatarPreview(user?.avatar ?? null);
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setProfileMessage({ type: 'error', text: 'Please select an image file (JPEG, PNG, GIF, WebP)' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setProfileMessage({ type: 'error', text: 'Image must be less than 2MB' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    try {
      const payload: { username?: string; firstName?: string; lastName?: string; avatar?: string | null } = {
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        avatar: avatarPreview || null,
      };
      if (username.trim().length >= 3) {
        payload.username = username.trim();
      }
      await authApi.updateProfile(payload);
      await refreshUser();
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err: unknown) {
      setProfileMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update profile',
      });
    }
  };

  const handleCancelEdit = () => {
    setUsername(user?.username ?? '');
    setFirstName(user?.firstName ?? '');
    setLastName(user?.lastName ?? '');
    setAvatarPreview(user?.avatar ?? null);
    setProfileMessage(null);
    setIsEditing(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setPasswordMessage({ type: 'success', text: 'Password changed. Please log in again.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => logout(), 1500);
    } catch (err: unknown) {
      setPasswordMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to change password',
      });
    }
  };

  const displayName = [firstName, lastName].filter(Boolean).join(' ') || 'Member';
  const headline = user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} at Signage Creators` : 'Signage Creators';

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center text-slate-600">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-slate-400" />
          </div>
          <p className="font-medium">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 px-4 sm:px-6">
      {/* Profile card with modern glassmorphism effect */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-blue-500/10 border border-slate-200/50 overflow-hidden transition-all duration-500 hover:shadow-3xl hover:shadow-blue-500/15 hover:-translate-y-1">
        {/* Cover: stunning gradient mesh + animated patterns */}
        <div className="h-44 sm:h-56 relative overflow-hidden">
          {/* Base gradient with mesh effect */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
            }}
          />
          {/* Animated gradient overlay */}
          <div 
            className="absolute inset-0 opacity-70 animate-gradient"
            style={{
              background: 'linear-gradient(270deg, #667eea, #764ba2, #f093fb, #4facfe)',
              backgroundSize: '400% 400%',
            }}
          />
          {/* Decorative circles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute top-20 left-1/4 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="white" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 via-black/5 to-transparent pointer-events-none" />
          
          {/* Floating decorative elements */}
          <div className="absolute top-8 left-8 w-2 h-2 bg-white/60 rounded-full animate-pulse" />
          <div className="absolute top-16 right-16 w-3 h-3 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-12 left-1/3 w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Profile photo + name + actions */}
        <div className="px-5 sm:px-8 pb-8 -mt-20 sm:-mt-24 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              {/* Avatar with premium styling */}
              <div className="relative group shrink-0">
                {/* Animated glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-full opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-2xl shadow-purple-500/30 ring-6 ring-white border-4 border-white/50 relative backdrop-blur-sm">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                      <User className="w-16 h-16 sm:w-20 sm:h-20 text-purple-600" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/60 to-blue-900/60 rounded-full transition-all duration-300 cursor-pointer hover:from-purple-900/80 hover:to-blue-900/80 backdrop-blur-md"
                  >
                    <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white/95 text-purple-700 shadow-xl transform group-hover:scale-110 transition-transform">
                      <Camera className="w-7 h-7" />
                    </span>
                  </button>
                )}
                {/* Status indicator */}
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow-lg" />
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              {/* Name & headline with enhanced typography */}
              <div className="pt-2 sm:pt-0 sm:pb-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent tracking-tight font-[family-name:var(--font-geist-sans,inherit)] drop-shadow-sm">
                  {displayName}
                </h1>
                <p className="text-slate-700 mt-2 text-base font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  {headline}
                </p>
                {username && (
                  <p className="text-sm text-slate-600 mt-2 flex items-center gap-2 font-semibold px-3 py-1.5 bg-slate-100/80 rounded-full w-fit backdrop-blur-sm">
                    <AtSign className="w-4 h-4 text-purple-500" />
                    @{username}
                  </p>
                )}
              </div>
            </div>
            {/* Action buttons with modern styling */}
            <div className="flex items-center gap-3 sm:pb-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-400 flex items-center gap-2.5 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                  >
                    <X className="w-4.5 h-4.5" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="profile-form"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold shadow-lg shadow-purple-500/40 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 flex items-center gap-2.5 transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Save className="w-4.5 h-4.5 relative z-10" />
                    <span className="relative z-10">Save Changes</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 flex items-center gap-2.5 transition-all duration-300"
                >
                  <Pencil className="w-4.5 h-4.5" />
                  Edit profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 sm:px-8 pb-8 space-y-6">
          {profileMessage && (
            <div
              className={`flex items-center gap-3 p-5 rounded-2xl text-sm font-semibold backdrop-blur-sm border-2 shadow-lg ${
                profileMessage.type === 'success'
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-emerald-300/80 shadow-emerald-200/50'
                  : 'bg-gradient-to-r from-rose-50 to-red-50 text-rose-800 border-rose-300/80 shadow-rose-200/50'
              }`}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {profileMessage.text}
            </div>
          )}

          {isEditing ? (
            <form id="profile-form" onSubmit={handleProfileSave} className="space-y-6 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-800 text-sm font-bold mb-2.5 flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-slate-800 text-sm font-bold mb-2.5 flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className={inputBase}
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-800 text-sm font-bold mb-2.5 flex items-center gap-2">
                  <AtSign className="w-4 h-4 text-purple-600" />
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                  placeholder="e.g. john_doe"
                  className={inputBase}
                />
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-400" />
                  Letters, numbers, underscore, hyphen. Min 3 characters.
                </p>
              </div>
              {avatarPreview && isEditing && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="text-sm text-slate-600 hover:text-rose-600 font-semibold transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-rose-50"
                >
                  <X className="w-4 h-4" />
                  Remove photo
                </button>
              )}
            </form>
          ) : (
            <div className="rounded-2xl border-2 border-slate-200/60 overflow-hidden bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 shadow-inner">
              <div className="px-6 py-5 border-b-2 border-slate-200/60 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  About
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-blue-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 group">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </span>
                  <span className="text-slate-800 font-semibold">{user.email}</span>
                </div>
                {username && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-purple-100 hover:border-purple-200 hover:shadow-md transition-all duration-200 group">
                    <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                      <AtSign className="w-5 h-5" />
                    </span>
                    <span className="text-slate-800 font-semibold">@{username}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 group">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-500/30 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-5 h-5" />
                  </span>
                  <span className="text-slate-800 font-semibold capitalize">{user.role}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security card with enhanced styling */}
      <div className="mt-8 bg-white rounded-3xl shadow-2xl shadow-blue-500/10 border border-slate-200/50 overflow-hidden transition-all duration-500 hover:shadow-3xl hover:shadow-blue-500/15">
        <div className="px-5 sm:px-8 py-6 border-b-2 border-slate-200/60 bg-gradient-to-r from-red-50/50 via-orange-50/50 to-yellow-50/50">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30">
              <Shield className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Security Settings</h2>
              <p className="text-xs text-slate-600 mt-0.5">Manage your password and security</p>
            </div>
          </div>
        </div>
        <div className="p-5 sm:p-8 bg-gradient-to-br from-slate-50/30 via-white to-orange-50/20">
          <form onSubmit={handlePasswordChange} className="space-y-6">
            {passwordMessage && (
              <div
                className={`flex items-center gap-3 p-5 rounded-2xl text-sm font-semibold backdrop-blur-sm border-2 shadow-lg ${
                  passwordMessage.type === 'success'
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-emerald-300/80 shadow-emerald-200/50'
                    : 'bg-gradient-to-r from-rose-50 to-red-50 text-rose-800 border-rose-300/80 shadow-rose-200/50'
                }`}
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {passwordMessage.text}
              </div>
            )}
            <div>
              <label className="block text-slate-800 text-sm font-bold mb-2.5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-600" />
                Current password
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter current password"
                  className={`${inputBase} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
                >
                  {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-slate-800 text-sm font-bold mb-2.5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-600" />
                New password
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min 6 characters"
                className={inputBase}
              />
            </div>
            <div>
              <label className="block text-slate-800 text-sm font-bold mb-2.5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-600" />
                Confirm new password
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Confirm new password"
                className={inputBase}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 flex items-center gap-3 transition-all duration-300 group"
            >
              <Lock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Change password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
