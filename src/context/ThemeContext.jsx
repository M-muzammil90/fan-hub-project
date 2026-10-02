import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('fan-hub-theme');

    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }

    return 'dark';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.style.colorScheme = theme;

    localStorage.setItem('fan-hub-theme', theme);
  }, [theme, isDark]);

  const toggleTheme = () => {
    setTheme((previousTheme) =>
      previousTheme === 'dark' ? 'light' : 'dark'
    );
  };

  const value = useMemo(
    () => ({
      theme,
      isDark,
      toggleTheme
    }),
    [theme, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider'
    );
  }

  return context;
}