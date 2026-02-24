import React, { useState } from 'react';
import { Bell, Moon, Sun, Globe, User, LogOut, Eye, EyeOff, Save } from 'lucide-react';

function Settings() {
  const [aiInsights, setAiInsights] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [timezone, setTimezone] = useState('UTC+5:30 (IST)');
  const [showProfile, setShowProfile] = useState(false);
  
  const colors = {
    primary: '#3B2621',
    secondary: '#D97706',
    accent: '#0F766E'
  };

  const timezones = [
    'UTC-8:00 (PST)',
    'UTC-5:00 (EST)',
    'UTC+0:00 (GMT)',
    'UTC+1:00 (CET)',
    'UTC+5:30 (IST)',
    'UTC+8:00 (CST)',
    'UTC+9:00 (JST)'
  ];

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: colors.primary }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: `${colors.primary}80` }}>Manage your preferences and account</p>
      </div>

      {/* Theme Preview */}
      <div className="bg-white rounded-3xl border p-6 mb-6" style={{ borderColor: `${colors.primary}20` }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: colors.primary }}>Theme Preview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {Object.entries(colors).map(([name, color]) => (
            <div key={name} className="text-center">
              <div className="w-full h-16 rounded-xl mb-2" style={{ backgroundColor: color }} />
              <p className="text-xs capitalize" style={{ color: `${colors.primary}80` }}>{name}</p>
              <p className="text-xs font-mono" style={{ color: colors.primary }}>{color}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Appearance */}
        <div className="bg-white rounded-3xl border p-6" style={{ borderColor: `${colors.primary}20` }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.primary }}>Appearance</h2>
          <div className="space-y-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center justify-between p-3 rounded-xl border"
              style={{ borderColor: `${colors.primary}20` }}
            >
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5" style={{ color: colors.secondary }} /> : <Sun className="w-5 h-5" style={{ color: colors.secondary }} />}
                <span style={{ color: colors.primary }}>Dark Mode</span>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-opacity-100' : 'bg-opacity-20'}`}
                   style={{ backgroundColor: darkMode ? colors.secondary : `${colors.primary}20` }}>
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Notifications & AI */}
        <div className="bg-white rounded-3xl border p-6" style={{ borderColor: `${colors.primary}20` }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.primary }}>Features</h2>
          <div className="space-y-4">
            <button
              onClick={() => setAiInsights(!aiInsights)}
              className="w-full flex items-center justify-between p-3 rounded-xl border"
              style={{ borderColor: `${colors.primary}20` }}
            >
              <div className="flex items-center gap-3">
                {aiInsights ? <Eye className="w-5 h-5" style={{ color: colors.secondary }} /> : <EyeOff className="w-5 h-5" style={{ color: colors.primary }} />}
                <span style={{ color: colors.primary }}>AI Insights</span>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${aiInsights ? 'bg-opacity-100' : 'bg-opacity-20'}`}
                   style={{ backgroundColor: aiInsights ? colors.accent : `${colors.primary}20` }}>
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${aiInsights ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Timezone Selection */}
      <div className="bg-white rounded-3xl border p-6 mb-6" style={{ borderColor: `${colors.primary}20` }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: colors.primary }}>Regional Settings</h2>
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5" style={{ color: colors.secondary }} />
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2"
            style={{ borderColor: `${colors.primary}20`, focusRingColor: colors.secondary }}
          >
            {timezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Profile Update */}
      <div className="bg-white rounded-3xl border p-6 mb-6" style={{ borderColor: `${colors.primary}20` }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: colors.primary }}>Admin Profile</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                 style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
              A
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Full Name"
                defaultValue="Admin User"
                className="w-full p-3 border rounded-xl mb-2"
                style={{ borderColor: `${colors.primary}20` }}
              />
              <input
                type="email"
                placeholder="Email"
                defaultValue="admin@savra.com"
                className="w-full p-3 border rounded-xl"
                style={{ borderColor: `${colors.primary}20` }}
              />
            </div>
          </div>
          <button
            className="w-full py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
          >
            <Save className="w-4 h-4 inline mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full py-4 rounded-xl border-2 transition-all hover:shadow-lg flex items-center justify-center gap-2"
        style={{ borderColor: colors.primary, color: colors.primary }}
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}

export default Settings;