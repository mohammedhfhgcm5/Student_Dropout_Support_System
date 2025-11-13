import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import {
  ThemePreferenceProvider,
  useThemePreference,
} from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { DonorAuthProvider } from "@/hooks/useDonorAuth";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { Feather } from "@expo/vector-icons";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
  Animated,
  Keyboard,
  Platform,
  Text as RNText,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "donor/signin",
};

// Set default font family globally before component renders
const TextComponent = RNText as any;
if (!TextComponent.defaultProps) {
  TextComponent.defaultProps = {};
}
if (!TextComponent.defaultProps.style) {
  TextComponent.defaultProps.style = {};
}
// Use most formal system Arabic fonts
TextComponent.defaultProps.style.fontFamily = Platform.select({
  ios: "Damascus", // iOS font names don't have spaces
  android: "sans-serif",
  default: undefined,
});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ReactQueryProvider>
      <DonorAuthProvider>
        <ToastProvider>
          <ThemePreferenceProvider>
            <LanguageProvider>
              <AppNavigator />
            </LanguageProvider>
          </ThemePreferenceProvider>
        </ToastProvider>
      </DonorAuthProvider>
    </ReactQueryProvider>
  );
}

function AppNavigator() {
  const colorScheme = useColorScheme();
  const { toggleTheme } = useThemePreference();
  const isDark = colorScheme === "dark";
  const { toggleLang, lang, isRTL } = useLanguage();

  const ThemeToggleButton = ({
    isDark,
    onToggle,
  }: {
    isDark: boolean;
    onToggle: () => void;
  }) => {
    const rotate = React.useRef(new Animated.Value(0)).current;
    const scale = React.useRef(new Animated.Value(1)).current;
    const bgAnim = React.useRef(new Animated.Value(isDark ? 1 : 0)).current;

    React.useEffect(() => {
      Animated.timing(bgAnim, {
        toValue: isDark ? 1 : 0,
        duration: 220,
        useNativeDriver: false,
      }).start();
    }, [isDark]);

    const onPress = async () => {
      try {
        await Haptics.selectionAsync();
      } catch {}
      Animated.sequence([
        Animated.parallel([
          Animated.timing(rotate, {
            toValue: 1,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.9,
            duration: 120,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(scale, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start(() => rotate.setValue(0));
      onToggle();
    };

    const containerStyle = {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      borderWidth: 1,
      marginRight: 8,
      backgroundColor: bgAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#f8f8f8", "#0a0a0a"],
      }),
      borderColor: bgAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#e5e7eb", "#1a1a1a"],
      }),
      transform: [{ scale }],
    } as any;

    const iconRotate = rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
    });

    return (
      <TouchableOpacity
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Toggle theme"
        activeOpacity={0.8}
      >
        <Animated.View style={containerStyle}>
          <Animated.View style={{ transform: [{ rotate: iconRotate }] }}>
            <Feather name={isDark ? "sun" : "moon"} size={20} color="#007BFF" />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const LangToggleButton = ({
    lang,
    onToggle,
  }: {
    lang: string;
    onToggle: () => void;
  }) => {
    const scale = React.useRef(new Animated.Value(1)).current;
    const onPress = async () => {
      try {
        await Haptics.selectionAsync();
      } catch {}
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.92,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
      onToggle();
    };
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{ marginRight: 8 }}
      >
        <Animated.View
          style={{
            transform: [{ scale }],
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: isDark ? "#1a1a1a" : "#e5e7eb",
            backgroundColor: isDark ? "#0a0a0a" : "#f8f8f8",
          }}
        >
          <Text style={{ color: "#007BFF", fontWeight: "700" }}>
            {lang === "ar" ? "AR" : "EN"}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Custom Back Button Component for Top Left
  const CustomBackButton = () => {
    const scale = React.useRef(new Animated.Value(1)).current;

    const onPress = () => {
      // Handle back navigation
      // You might need to use router or navigation prop here
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          marginLeft: 16,
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center",
          gap: 8,
        }}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDark ? "#1a1a1a" : "#e5e7eb",
              backgroundColor: isDark ? "#0a0a0a" : "#f8f8f8",
              gap: 6,
            }}
          >
            <Text
              style={[
                {
                  fontSize: 18,
                  color: "#007BFF",
                  transform: [{ scaleX: isRTL ? -1 : 1 }],
                },
              ]}
            >
              ←
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#007BFF",
              }}
            >
              {isRTL ? "رجوع" : "Back"}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <View
        style={{ flex: 1 }}
        // Apply RTL layout for Arabic
        // @ts-ignore
        writingDirection={isRTL ? "rtl" : "ltr"}
        onStartShouldSetResponderCapture={() => {
          try {
            Keyboard.dismiss();
          } catch {}
          return false;
        }}
      >
        <Stack
          initialRouteName="donor/signin"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              gestureEnabled: false,
              fullScreenGestureEnabled: false,
              // Add header with back button for tabs if needed
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="donor/signin"
            options={{
              gestureEnabled: false,
              fullScreenGestureEnabled: false,
              headerShown: true,
              headerTitle: "",
              headerLeft: () => null,
              headerBackVisible: false,
              headerStyle: { backgroundColor: isDark ? "#000000" : "#FFFFFF" },
              headerTitleStyle: { color: isDark ? "#FFFFFF" : "#000000" },
              headerShadowVisible: false,
              headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <LangToggleButton lang={lang} onToggle={toggleLang} />
                  <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} />
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="donor/signup"
            options={{
              headerShown: true,
              headerTitle: "",
              headerLeft: () => <CustomBackButton />, // Add back button to top left
              headerBackVisible: false,
              headerStyle: { backgroundColor: isDark ? "#000000" : "#FFFFFF" },
              headerTitleStyle: { color: isDark ? "#FFFFFF" : "#000000" },
              headerShadowVisible: false,
              headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <LangToggleButton lang={lang} onToggle={toggleLang} />
                  <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} />
                </View>
              ),
            }}
          />
          {/* Add more screens with custom back button */}
        </Stack>
      </View>
      <StatusBar style={isDark ? "light" : "dark"} />
    </ThemeProvider>
  );
}
