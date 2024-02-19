'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { updateThemeColor } from '@/utils/update-theme-color';
import { presetDark, presetLight } from '@/config/color-presets';
import { useColorPresetName } from '@/hooks/use-theme-color';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { colorPresetName } = useColorPresetName();
  // Convert theme ('light'/'dark') to boolean value for DarkModeSwitch
  const [isDarkMode, setDarkMode] = useState(theme === 'dark');

  useEffect(() => {
    // Update dark mode state when theme changes
    setDarkMode(theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (theme === 'light' && colorPresetName === 'black') {
      updateThemeColor(
        presetLight.lighter,
        presetLight.light,
        presetLight.default,
        presetLight.dark,
        presetLight.foreground
      );
    } else if (theme === 'dark' && colorPresetName === 'black') {
      updateThemeColor(
        presetDark.lighter,
        presetDark.light,
        presetDark.default,
        presetDark.dark,
        presetDark.foreground
      );
    }
  }, [theme, colorPresetName]);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    // Toggle theme between 'light' and 'dark'
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="flex justify-center items-center">
      <DarkModeSwitch
        checked={isDarkMode}
        onChange={toggleDarkMode}
        size={25}
      />
    </div>
  );
}
