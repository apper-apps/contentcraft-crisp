import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { toast } from "react-toastify";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "Content Creator",
    email: "creator@contentcraft.com",
    avatar: null,
    timezone: "UTC-5 (Eastern Time)",
    notifications: {
      email: true,
      browser: true,
      weekly: true
    }
  });

  const [apiKeys, setApiKeys] = useState({
    openai: "",
    claude: "",
    gemini: ""
  });

  const [preferences, setPreferences] = useState({
    defaultBrand: "1",
    autoSave: true,
    darkMode: false,
    language: "en"
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  const handleApiKeyUpdate = (e) => {
    e.preventDefault();
    toast.success("API keys updated successfully!");
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target.result }));
        toast.success("Avatar updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="User" className="w-5 h-5 text-primary-600" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <ApperIcon name="User" className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div>
                      <label className="block">
                        <span className="sr-only">Choose avatar</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                      <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
                      <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                      <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                      <option value="UTC+1 (CET)">UTC+1 (CET)</option>
                    </select>
                  </div>

                  <Button type="submit" variant="gradient">
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Key" className="w-5 h-5 text-primary-600" />
                  <span>API Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApiKeyUpdate} className="space-y-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Configure your AI provider API keys to enable content generation.
                  </p>

                  {/* OpenAI */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OpenAI API Key
                    </label>
                    <div className="relative">
                      <ApperIcon name="Zap" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="password"
                        value={apiKeys.openai}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                        placeholder="sk-..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Claude */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anthropic Claude API Key
                    </label>
                    <div className="relative">
                      <ApperIcon name="Brain" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="password"
                        value={apiKeys.claude}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, claude: e.target.value }))}
                        placeholder="sk-ant-..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Gemini */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Gemini API Key
                    </label>
                    <div className="relative">
                      <ApperIcon name="Sparkles" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="password"
                        value={apiKeys.gemini}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, gemini: e.target.value }))}
                        placeholder="AIza..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="gradient">
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    Save API Keys
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Bell" className="w-5 h-5 text-primary-600" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Get notified via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.notifications.email}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Browser Notifications</p>
                      <p className="text-sm text-gray-500">Push notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.notifications.browser}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, browser: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Weekly Summary</p>
                      <p className="text-sm text-gray-500">Weekly activity report</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.notifications.weekly}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, weekly: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Settings" className="w-5 h-5 text-primary-600" />
                  <span>Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Auto-save</p>
                      <p className="text-sm text-gray-500">Save content automatically</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.autoSave}
                        onChange={(e) => setPreferences(prev => ({ ...prev, autoSave: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 mb-2">Language</p>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Shield" className="w-5 h-5 text-primary-600" />
                  <span>Account</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="secondary" className="w-full justify-start">
                    <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                    Reset Preferences
                  </Button>
                  <Button variant="danger" className="w-full justify-start">
                    <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;