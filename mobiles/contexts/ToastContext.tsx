import React, { createContext, useContext, useRef, useState } from "react";
import { 
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
  
 } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "info">("success");
  const dark = useColorScheme() === "dark";

  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const showToast = (
    msg: string,
    toastType: "success" | "error" | "info" = "success"
  ) => {
    setMessage(msg);
    setType(toastType);
    setVisible(true);

    // Slide in
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide after 3 seconds
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
        slideAnim.setValue(-100);
        opacityAnim.setValue(0);
      });
    }, 3000);
  };

  const getIconAndColor = () => {
    switch (type) {
      case "success":
        return { icon: "✓", color: "#007BFF", bgColor: "#007BFF" };
      case "error":
        return { icon: "✕", color: "#FF3B30", bgColor: "#FF3B30" };
      case "info":
        return { icon: "i", color: "#007BFF", bgColor: "#007BFF" };
      default:
        return { icon: "✓", color: "#007BFF", bgColor: "#007BFF" };
    }
  };

  const { icon, color, bgColor } = getIconAndColor();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.toast,
            {
              opacity: opacityAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View
            style={[
              styles.toastContent,
              {
                backgroundColor: dark ? "#0a0a0a" : "#FFFFFF",
                borderColor: dark ? "#1a1a1a" : "#e0e0e0",
              },
            ]}
          >
            {/* Accent Line */}
            <View style={[styles.accentLine, { backgroundColor: bgColor }]} />

            {/* Icon */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${bgColor}15` },
              ]}
            >
              <Text style={[styles.icon, { color }]}>{icon}</Text>
            </View>

            {/* Text */}
            <View style={styles.textContainer}>
              <Text
                style={[styles.title, { color: dark ? "#FFFFFF" : "#000000" }]}
              >
                {type === "success"
                  ? "Success"
                  : type === "error"
                  ? "Error"
                  : "Info"}
              </Text>
              <Text
                style={[
                  styles.message,
                  { color: dark ? "#808080" : "#666666" },
                ]}
                numberOfLines={2}
              >
                {message}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingLeft: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  accentLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
    fontWeight: "700",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
  },
});

