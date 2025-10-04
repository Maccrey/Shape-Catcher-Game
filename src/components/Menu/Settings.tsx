import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SettingsManager } from '../../services/SettingsManager';
import { GameSettings } from '../../types/settings.types';

interface SettingsProps {
  settingsManager: SettingsManager;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settingsManager,
  onClose
}) => {
  const [settings, setSettings] = useState<GameSettings>(
    settingsManager.getSettings()
  );

  const updateSetting = <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => {
    settingsManager.setSetting(key, value);
    setSettings(settingsManager.getSettings());
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to default?')) {
      settingsManager.resetSettings();
      setSettings(settingsManager.getSettings());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Audio Settings */}
          <SettingsSection title="Audio">
            <ToggleSetting
              label="Music"
              value={settings.musicEnabled}
              onChange={v => updateSetting('musicEnabled', v)}
            />
            <SliderSetting
              label="Music Volume"
              value={settings.musicVolume}
              onChange={v => updateSetting('musicVolume', v)}
              disabled={!settings.musicEnabled}
            />
            <ToggleSetting
              label="Sound Effects"
              value={settings.sfxEnabled}
              onChange={v => updateSetting('sfxEnabled', v)}
            />
            <SliderSetting
              label="SFX Volume"
              value={settings.sfxVolume}
              onChange={v => updateSetting('sfxVolume', v)}
              disabled={!settings.sfxEnabled}
            />
          </SettingsSection>

          {/* Graphics Settings */}
          <SettingsSection title="Graphics">
            <ToggleSetting
              label="Particle Effects"
              value={settings.particlesEnabled}
              onChange={v => updateSetting('particlesEnabled', v)}
            />
            <ToggleSetting
              label="Animations"
              value={settings.animationsEnabled}
              onChange={v => updateSetting('animationsEnabled', v)}
            />
            <ToggleSetting
              label="Background Animations"
              value={settings.backgroundAnimationsEnabled}
              onChange={v => updateSetting('backgroundAnimationsEnabled', v)}
            />
          </SettingsSection>

          {/* Gameplay Settings */}
          <SettingsSection title="Gameplay">
            <ToggleSetting
              label="Show Next Shape"
              value={settings.showNextShape}
              onChange={v => updateSetting('showNextShape', v)}
            />
            <ToggleSetting
              label="Show Tutorial"
              value={settings.showTutorial}
              onChange={v => updateSetting('showTutorial', v)}
            />
            <ToggleSetting
              label="Auto Save"
              value={settings.autoSave}
              onChange={v => updateSetting('autoSave', v)}
            />
          </SettingsSection>

          {/* Accessibility Settings */}
          <SettingsSection title="Accessibility">
            <ToggleSetting
              label="Color Blind Mode"
              value={settings.colorBlindMode}
              onChange={v => updateSetting('colorBlindMode', v)}
            />
            <ToggleSetting
              label="Reduce Motion"
              value={settings.reduceMotion}
              onChange={v => updateSetting('reduceMotion', v)}
            />
            <ToggleSetting
              label="High Contrast"
              value={settings.highContrast}
              onChange={v => updateSetting('highContrast', v)}
            />
          </SettingsSection>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-700 flex justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children
}) => (
  <div>
    <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const ToggleSetting: React.FC<{
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
    <span className="text-white font-medium">{label}</span>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-14 h-7 rounded-full transition-colors ${
        value ? 'bg-blue-600' : 'bg-gray-600'
      }`}
    >
      <motion.div
        className="absolute top-1 w-5 h-5 bg-white rounded-full"
        animate={{ left: value ? 32 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  </div>
);

const SliderSetting: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}> = ({ label, value, onChange, disabled }) => (
  <div className="p-3 bg-gray-800/50 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <span className={`text-white font-medium ${disabled ? 'opacity-50' : ''}`}>
        {label}
      </span>
      <span className={`text-gray-400 ${disabled ? 'opacity-50' : ''}`}>
        {Math.round(value * 100)}%
      </span>
    </div>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      disabled={disabled}
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        accentColor: '#3b82f6'
      }}
    />
  </div>
);
