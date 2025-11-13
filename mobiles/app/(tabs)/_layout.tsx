import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import React from "react";

const COLORS = {
  white: "#FFFFFF",
  black: "#000000",
  blue: "#007BFF",
  gray: "#9CA3AF",
};

export default function TabsLayout() {
  const dark = useColorScheme() === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.blue,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 20,
          borderRadius: 24,
          height: 70,
          backgroundColor: dark ? COLORS.black : COLORS.white,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 6,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="student/index"
        options={{
          title: "Students",
          tabBarIcon: ({ color }) => (
            <Icon name="school" color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="donations/index"
        options={{
          title: "Donations",
          tabBarIcon: ({ color }) => (
            <Icon name="heart" color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Icon name="user" color={color} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}

// Simple icon component (uses built-in vector icons)
import { Feather } from "@expo/vector-icons";
function Icon({ name, color, size }: any) {
  return <Feather name={name} color={color} size={size} />;
}
