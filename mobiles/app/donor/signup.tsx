import { useLanguage } from "@/contexts/LanguageContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDonorAuth } from "@/hooks/useDonorAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const { width } = Dimensions.get("window");

const signUpSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  nationalNumber: z.string().min(6, "National number required"),
  phone: z.string().optional(),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const { signUp, loading } = useDonorAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const dark = colorScheme === "dark";
  const { t, isRTL } = useLanguage();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({ resolver: zodResolver(signUpSchema) });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // Floating circles animation
  const circle1 = useRef(new Animated.Value(0)).current;
  const circle2 = useRef(new Animated.Value(0)).current;
  const circle3 = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating circles animation
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(circle1, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(circle1, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(circle2, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(circle2, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(circle3, {
            toValue: 1,
            duration: 6000,
            useNativeDriver: true,
          }),
          Animated.timing(circle3, {
            toValue: 0,
            duration: 6000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const onSubmit = async (data: SignUpForm) => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await signUp(data);
      Alert.alert(t("accountCreated"));
      router.push("/donor/signin");
    } catch (error: any) {
      Alert.alert(error?.response?.data?.message || t("accountCreationFailed"));
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const circle1Y = circle1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const circle2Y = circle2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const circle3Y = circle3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const getBorderColor = (fieldName: string) => {
    if (errors[fieldName as keyof SignUpForm]) return "#FF3B30";
    if (focusedField === fieldName) return "#007BFF";
    return dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  };

  const renderInput = (
    name: keyof SignUpForm,
    placeholder: string,
    options?: {
      secureTextEntry?: boolean;
      keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
      autoCapitalize?: "none" | "sentences" | "words" | "characters";
      showEye?: boolean;
    }
  ) => {
    const isFocused = focusedField === name;
    const hasError = !!errors[name];

    return (
      <View style={styles.inputContainer}>
        <Animated.Text
          style={[
            styles.label,
            {
              color: isFocused ? "#007BFF" : dark ? "#FFFFFF" : "#000000",
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {placeholder}
        </Animated.Text>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: dark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.04)",
                  borderColor: getBorderColor(name),
                  shadowColor: isFocused ? "#007BFF" : "transparent",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isFocused ? 0.2 : 0,
                  shadowRadius: 12,
                  elevation: isFocused ? 4 : 0,
                  flexDirection: isRTL ? "row-reverse" : "row",
                },
              ]}
            >
              <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChange}
                onFocus={() => setFocusedField(name)}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={options?.secureTextEntry && !showPassword}
                keyboardType={options?.keyboardType || "default"}
                autoCapitalize={options?.autoCapitalize || "sentences"}
                placeholderTextColor={
                  dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"
                }
                style={[
                  styles.input,
                  {
                    color: dark ? "#FFFFFF" : "#000000",
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              />
              {options?.showEye && (
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={[
                    styles.eyeButton,
                    { [isRTL ? "marginRight" : "marginLeft"]: 8 },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.eyeIcon}>
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
        {hasError && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text
              style={[
                styles.errorText,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              ⚠️ {errors[name]?.message}
            </Text>
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dark ? "#000000" : "#FFFFFF" },
      ]}
    >
      {/* Animated Background Circles */}
      <Animated.View
        style={[
          styles.bgCircle,
          {
            top: "5%",
            [isRTL ? "right" : "left"]: "5%",
            width: 150,
            height: 150,
            backgroundColor: "rgba(0, 123, 255, 0.1)",
            transform: [{ translateY: circle1Y }, { rotate: spin }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.bgCircle,
          {
            bottom: "10%",
            [isRTL ? "left" : "right"]: "0%",
            width: 200,
            height: 200,
            backgroundColor: "rgba(0, 123, 255, 0.08)",
            transform: [{ translateY: circle2Y }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.bgCircle,
          {
            top: "50%",
            [isRTL ? "left" : "right"]: "10%",
            width: 100,
            height: 100,
            backgroundColor: "rgba(0, 123, 255, 0.12)",
            transform: [{ translateY: circle3Y }],
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Glassmorphic Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: dark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
                borderColor: dark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              },
            ]}
          >
            {/* Logo/Icon Area with Animation */}
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <View style={styles.logoCircle}>
                <Text style={styles.logoIcon}>🤝</Text>
              </View>
            </Animated.View>

            <Text
              style={[styles.title, { color: dark ? "#FFFFFF" : "#000000" }]}
            >
              {t("joinAsDonor")}
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" },
              ]}
            >
              {t("createAccountSubtitle")}
            </Text>

            {/* Form Fields */}
            {renderInput("name", t("fullName"))}
            {renderInput("email", t("emailAddress"), {
              keyboardType: "email-address",
              autoCapitalize: "none",
            })}
            {renderInput("password", t("password"), {
              secureTextEntry: true,
              showEye: true,
            })}
            {renderInput("nationalNumber", t("nationalNumber"), {
              keyboardType: "numeric",
            })}
            {renderInput("phone", t("phoneNumber"), {
              keyboardType: "phone-pad",
            })}

            {/* Sign Up Button */}
            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <TouchableOpacity
                disabled={loading}
                onPress={handleSubmit(onSubmit)}
                activeOpacity={0.8}
                style={[
                  styles.button,
                  styles.primaryButton,
                  loading && styles.buttonDisabled,
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>{t("createAccount")}</Text>
                    <Text
                      style={[
                        styles.buttonIcon,
                        { transform: [{ scaleX: isRTL ? -1 : 1 }] },
                      ]}
                    >
                      →
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <View style={styles.divider}>
              <View
                style={[
                  styles.dividerLine,
                  {
                    backgroundColor: dark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  },
                ]}
              />
              <Text
                style={[
                  styles.dividerText,
                  { color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" },
                ]}
              >
                {t("or")}
              </Text>
              <View
                style={[
                  styles.dividerLine,
                  {
                    backgroundColor: dark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  },
                ]}
              />
            </View>

            {/* Sign In Link */}
            <TouchableOpacity
              onPress={() => router.push("/donor/signin")}
              activeOpacity={0.8}
              style={[
                styles.button,
                styles.secondaryButton,
                {
                  backgroundColor: dark
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)",
                  borderColor: "#007BFF",
                },
              ]}
            >
              <Text style={[styles.secondaryButtonText, { color: "#007BFF" }]}>
                {t("alreadyHave")}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgCircle: {
    position: "absolute",
    borderRadius: 1000,
    opacity: 0.3,
  },
  scrollContent: {
    paddingVertical: 40,
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: 24,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.1,
        shadowRadius: 40,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 123, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(0, 123, 255, 0.3)",
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    fontWeight: "400",
  },
  inputContainer: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 60,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  eyeButton: {
    padding: 8,
  },
  eyeIcon: {
    fontSize: 22,
    opacity: 0.6,
  },
  errorText: {
    color: "#FF3B30",
    marginTop: 6,
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "500",
  },
  button: {
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#007BFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  primaryButton: {
    backgroundColor: "#007BFF",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.3,
  },
  buttonIcon: {
    color: "#FFFFFF",
    fontSize: 20,
    marginLeft: 8,
    fontWeight: "700",
  },
  secondaryButton: {
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  secondaryButtonText: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    fontWeight: "600",
  },
});
