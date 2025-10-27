import React from 'react';
import { useTheme } from '../services/ThemeContext';
import { AVAILABLE_THEMES } from '../services/ThemeContext';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      marginBottom: '1rem',
      maxWidth: '340px'
    }}>
      <label style={{ fontWeight: 'bold', fontSize: '14px' }}>🎨 Choose Theme:</label>
      <select
        value={theme}
        onChange={e => setTheme(e.target.value)}
        style={{
          padding: '8px 10px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '14px',
          background: '#fff'
        }}
      >
        {AVAILABLE_THEMES.map(t => (
          <option key={t.id} value={t.id}>{t.label}</option>
        ))}
      </select>
      <small style={{ opacity: 0.7 }}>Theme applies across all hotels and pages after login.</small>
    </div>
  );
};

export default ThemeSelector;
