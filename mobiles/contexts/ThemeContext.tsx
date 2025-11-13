import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Appearance, ColorSchemeName } from "react-native";

type ThemeValue = "light" | "dark";

interface ThemePreferenceContextType {
  theme: ThemeValue;
  setTheme: (theme: ThemeValue) => void;
  toggleTheme: () => void;
}

const ThemePreferenceContext = createContext<ThemePreferenceContextType | undefined>(
  undefined
);

const STORE_KEY = "themePreference";

export const ThemePreferenceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const system: ThemeValue = Appearance.getColorScheme() === "dark" ? "dark" : "light";
  const [theme, setThemeState] = useState<ThemeValue>(system);

  useEffect(() => {
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync(STORE_KEY);
        if (saved === "light" || saved === "dark") {
          setThemeState(saved);
        }
      } catch {}
    })();
  }, []);

  const setTheme = (value: ThemeValue) => {
    setThemeState(value);
    // persist but don't block UI
    SecureStore.setItemAsync(STORE_KEY, value).catch(() => {});
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme]
  );

  return (
    <ThemePreferenceContext.Provider value={value}>
      {children}
    </ThemePreferenceContext.Provider>
  );
};

export const useThemePreference = () => {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    // Fallback if provider not mounted
    const system: ThemeValue = Appearance.getColorScheme() === "dark" ? "dark" : "light";
    return {
      theme: system,
      setTheme: () => {},
      toggleTheme: () => {},
    } as ThemePreferenceContextType;
  }
  return ctx;
};

