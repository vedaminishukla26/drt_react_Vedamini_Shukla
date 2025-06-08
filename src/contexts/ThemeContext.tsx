import React, { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,

    // Background colors
    bg: {
      primary: isDarkMode ? 'bg-slate-900' : 'bg-gray-50',
      secondary: isDarkMode ? 'bg-slate-800' : 'bg-white',
      tertiary: isDarkMode ? 'bg-slate-700' : 'bg-gray-100',
    },

    // Text colors
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-slate-300' : 'text-gray-700',
      muted: isDarkMode ? 'text-slate-400' : 'text-gray-500',
    },

    // Button colors
    button: {
      primary: isDarkMode ? 'bg-slate-600 text-white' : 'bg-gray-200 text-gray-800',
      primaryHover: isDarkMode ? 'hover:bg-slate-500' : 'hover:bg-gray-300',
      secondary: isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800',
      selected: isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white',
      selectedHover: isDarkMode ? 'hover:bg-blue-500' : 'hover:bg-blue-600',
    },

    // Input colors
    input: {
      bg: isDarkMode ? 'bg-slate-700' : 'bg-white',
      border: isDarkMode ? 'border-slate-600' : 'border-gray-300',
      text: isDarkMode ? 'text-white' : 'text-gray-900',
      placeholder: isDarkMode ? 'placeholder-slate-400' : 'placeholder-gray-500',
    },

    // Dropdown colors
    dropdown: {
      bg: isDarkMode ? 'bg-slate-700' : 'bg-white',
      border: isDarkMode ? 'border-slate-600' : 'border-gray-300',
      text: isDarkMode ? 'text-white' : 'text-gray-900',
      hover: isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100',
    },

    // Filter colors
    filter: {
      all: isDarkMode ? 'bg-slate-600 text-white' : 'bg-gray-200 text-gray-800',
      allHover: isDarkMode ? 'hover:bg-slate-500' : 'hover:bg-gray-300',
      category: isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800',
      categorySelected: isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white',
    },

    // Border colors
    border: {
      default: isDarkMode ? 'border-slate-600' : 'border-gray-300',
      light: isDarkMode ? 'border-slate-700' : 'border-gray-200',
    },

    // Shadow colors
    shadow: {
      default: isDarkMode ? 'shadow-lg shadow-black/20' : 'shadow-lg shadow-gray-300/20',
      small: isDarkMode ? 'shadow-md shadow-black/10' : 'shadow-md shadow-gray-300/10',
    }
  };

  const value = {
    isDarkMode,
    toggleTheme,
    theme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;