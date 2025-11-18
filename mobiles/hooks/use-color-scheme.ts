import { useThemePreference } from "../contexts/ThemeContext";
import { useColorScheme as useRNScheme } from "react-native";

export function useColorScheme(): "light" | "dark" {
  const { theme } = useThemePreference();
  // Fallback to system if provider returns nothing
  const sys = useRNScheme() === "dark" ? "dark" : "light";
  return theme || sys;
}
