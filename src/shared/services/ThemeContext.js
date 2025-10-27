import React, { createContext, useContext, useState, useEffect } from 'react';

// Available themes list (id + label)
export const AVAILABLE_THEMES = [
  { id: 'classic', label: 'Classic (Red/Gold)' },
  { id: 'royal', label: 'Royal Blue' },
  { id: 'fresh', label: 'Fresh Green' },
  { id: 'dark', label: 'Dark Mode' }
];

const ThemeContext = createContext({
  theme: 'classic',
  setTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('classic');

  useEffect(() => {
    const saved = localStorage.getItem('global_theme');
    if (saved && AVAILABLE_THEMES.some(t => t.id === saved)) {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('global_theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
