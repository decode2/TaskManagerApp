import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from './ui/Modal';
import { ModalHeader, ModalBody, ModalFooter, ModalTitle, ModalCloseButton } from './ui/ModalComponents';
import { useModal } from '../hooks/useModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'profile' | 'settings' | 'security';

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const { user } = useAuth();
  const modal = useModal({ initialOpen: isOpen });

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: '👤' },
    { id: 'settings' as TabType, label: 'Settings', icon: '⚙️' },
    { id: 'security' as TabType, label: 'Security', icon: '🔒' }
  ];

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    language: 'en',
    timezone: 'UTC',
  });

  const [settingsData, setSettingsData] = useState({
    theme: 'auto',
    notifications: {
      email: true,
      push: true,
      inApp: true,
    },
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  });

  // Sync external isOpen state with internal modal state
  useEffect(() => {
    if (isOpen !== modal.isOpen) {
      if (isOpen) {
        modal.open();
      } else {
        modal.close();
      }
    }
  }, [isOpen, modal]);

  // Sync internal modal close with external onClose
  const handleClose = () => {
    modal.close();
    onClose();
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profileData.name.charAt(0).toUpperCase()}
          </div>
          <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{profileData.name}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{profileData.email}</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={profileData.email}
            disabled
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+1 (555) 123-4567"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Bio
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* Appearance */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Appearance</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Theme
            </label>
            <select
              value={settingsData.theme}
              onChange={(e) => setSettingsData(prev => ({ ...prev, theme: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            >
              <option value="auto">Auto (System)</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Notifications</h3>
        <div className="space-y-3">
          {Object.entries(settingsData.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()} Notifications
              </span>
              <button
                onClick={() => setSettingsData(prev => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    [key]: !value
                  }
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  value ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Date & Time */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Date & Time</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Date Format
            </label>
            <select
              value={settingsData.dateFormat}
              onChange={(e) => setSettingsData(prev => ({ ...prev, dateFormat: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Time Format
            </label>
            <select
              value={settingsData.timeFormat}
              onChange={(e) => setSettingsData(prev => ({ ...prev, timeFormat: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            >
              <option value="12h">12 Hour (AM/PM)</option>
              <option value="24h">24 Hour</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Password */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Password</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Two-Factor Authentication</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable 2FA</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200">
              Enable
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Active Sessions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Session</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Windows • Chrome • Now</p>
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'settings':
        return renderSettingsTab();
      case 'security':
        return renderSecurityTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <Modal
      isOpen={modal.isOpen}
      onClose={handleClose}
      size="xl"
      showCloseButton={false}
    >
      <ModalHeader>
        <div className="flex items-center justify-between w-full">
          <ModalTitle>Profile Settings</ModalTitle>
          <ModalCloseButton onClose={handleClose} />
        </div>
      </ModalHeader>

      <ModalBody>
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </ModalBody>

      <ModalFooter>
        <button
          onClick={handleClose}
          className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors duration-200 no-select"
        >
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 no-select">
          Save Changes
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ProfileModal;
