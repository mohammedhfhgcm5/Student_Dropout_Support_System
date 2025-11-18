import { useLanguage } from "@/contexts/LanguageContext";
import { useThemePreference } from "@/contexts/ThemeContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  white: "#FFFFFF",
  black: "#000000",
  blue: "#007BFF",
  gray: "#9CA3AF",
  blueLight: "#E6F2FF",
  blueDark: "#0056B3",
};

// Custom Tab Bar Icon Component with Animations
function TabBarIcon({
  name,
  focused,
  isImage = false,
  imageSource,
}: {
  name: any;
  focused: boolean;
  isImage?: boolean;
  imageSource?: any;
}) {
  const dark = useColorScheme() === "dark";
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      // Scale up animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Rotation animation for active tab
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      rotateAnim.setValue(0);
    }
  }, [focused]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (focused) {
    return (
      <Animated.View
        style={[
          styles.activeIconContainer,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Animated.View
          style={[
            styles.activeIconCircle,
            {
              backgroundColor: COLORS.blue,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.innerCircle}>
            <Animated.View style={{ transform: [{ rotate }] }}>
              {isImage ? (
                <Image
                  source={imageSource}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              ) : (
                <Feather name={name} color={COLORS.white} size={26} />
              )}
            </Animated.View>
          </View>
        </Animated.View>
        <View style={styles.activeIndicator} />

        {/* Glow rings */}
        <View style={[styles.glowRing, styles.glowRing1]} />
        <View style={[styles.glowRing, styles.glowRing2]} />
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.inactiveIconContainer,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View
        style={[
          styles.inactiveIconCircle,
          {
            backgroundColor: dark
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.03)",
          },
        ]}
      >
        {isImage ? (
          <Image
            source={imageSource}
            style={[styles.iconImage, styles.inactiveIconImage]}
            resizeMode="contain"
          />
        ) : (
          <Feather name={name} color={COLORS.gray} size={22} />
        )}
      </View>
      <View style={styles.inactiveIndicator} />
    </Animated.View>
  );
}

export default function TabsLayout() {
  const dark = useColorScheme() === "dark";
  const { toggleLang, lang } = useLanguage();
  const { toggleTheme } = useThemePreference();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 8,
          borderRadius: 32,
          height: 75,
          backgroundColor: dark
            ? "rgba(0, 0, 0, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          borderTopWidth: 0,
          paddingHorizontal: 16,
          paddingBottom: 8,
          borderWidth: 1,
          borderColor: dark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
          overflow: "visible",
          ...Platform.select({
            ios: {
              shadowColor: dark ? COLORS.blue : "#000",
              shadowOffset: { width: 0, height: 15 },
              shadowOpacity: dark ? 0.4 : 0.15,
              shadowRadius: 25,
            },
            android: {
              elevation: 15,
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="student/index"
        options={{
          title: lang === "ar" ? "الطلاب" : "Students",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="users" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="donations/index"
        options={{
          title: lang === "ar" ? "التبرعات" : "Donations",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name="gift"
              focused={focused}
              isImage={true}
              imageSource={require("@/assets/images/donate-icon.png")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => null,
          headerStyle: {
            backgroundColor: dark ? COLORS.black : COLORS.white,
          },
          headerTitleStyle: {
            color: dark ? COLORS.white : COLORS.black,
          },
          headerTintColor: COLORS.blue,
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={toggleLang}
                style={{
                  marginRight: 8,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: dark ? "#1a1a1a" : "#e5e7eb",
                  backgroundColor: dark ? "#0a0a0a" : "#f8f8f8",
                }}
                activeOpacity={0.7}
              >
                <Text style={{ color: COLORS.blue, fontWeight: "700" }}>
                  {lang === "ar" ? "AR" : "EN"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleTheme}
                style={{
                  marginRight: 12,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: dark ? "#1a1a1a" : "#e5e7eb",
                  backgroundColor: dark ? "#0a0a0a" : "#f8f8f8",
                }}
                activeOpacity={0.7}
              >
                <Feather
                  name={dark ? "sun" : "moon"}
                  size={20}
                  color={COLORS.blue}
                />
              </TouchableOpacity>
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="settings" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
    position: "relative",
  },
  activeIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    borderWidth: 3,
    borderColor: "rgba(0, 123, 255, 0.3)",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.blue,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  innerCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 123, 255, 0.1)",
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.blue,
    marginTop: 2,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.blue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  glowRing: {
    position: "absolute",
    top: 6,
    borderRadius: 100,
    borderWidth: 1,
  },
  glowRing1: {
    width: 70,
    height: 70,
    borderColor: "rgba(0, 123, 255, 0.2)",
  },
  glowRing2: {
    width: 80,
    height: 80,
    borderColor: "rgba(0, 123, 255, 0.1)",
  },
  inactiveIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  inactiveIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "rgba(156, 163, 175, 0.2)",
  },
  inactiveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "transparent",
    marginTop: 4,
  },
  iconImage: {
    width: 200,
    height: 50,
    tintColor: COLORS.white,
  },
  inactiveIconImage: {
    width: 60, // was 22
    height: 45, // was 22
    tintColor: COLORS.gray,
    opacity: 0.8, // adds a softer dim look
  },
});
