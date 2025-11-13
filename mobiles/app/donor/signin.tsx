import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/contexts/ToastContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDonorAuth } from "@/hooks/useDonorAuth";
import { donorForgotPassword, getToken } from "@/services/donorAuth.service";
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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const { width } = Dimensions.get("window");

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const dark = colorScheme === "dark";
  const { t, isRTL } = useLanguage();

  const { signIn, loading } = useDonorAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const resetSlideAnim = useRef(new Animated.Value(-100)).current;
  const resetOpacityAnim = useRef(new Animated.Value(0)).current;
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // Floating circles animation
  const circle1 = useRef(new Animated.Value(0)).current;
  const circle2 = useRef(new Animated.Value(0)).current;
  const circle3 = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    Animated.timing(emailBorderAnim, {
      toValue: emailFocused ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [emailFocused]);

  useEffect(() => {
    Animated.timing(passwordBorderAnim, {
      toValue: passwordFocused ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [passwordFocused]);

  useEffect(() => {
    if (showReset) {
      Animated.parallel([
        Animated.spring(resetSlideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(resetOpacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(resetSlideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(resetOpacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showReset]);

  const onSubmit = async (data: SignInForm) => {
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
      await signIn(data);
      const token = await getToken();
      console.log("Donor access token:", token);

      // Navigate immediately
      router.replace("/(tabs)/student" as any);

      // Show toast on the next page after navigation
      setTimeout(() => {
        showToast(t("toastLoginOk"), "success");
      }, 300);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || error?.message || t("toastLoginFail"),
        "error"
      );
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

  const emailBorderColor = emailBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      "#007BFF",
    ],
  });

  const passwordBorderColor = passwordBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      "#007BFF",
    ],
  });

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
            top: "10%",
            [isRTL ? "right" : "left"]: "10%",
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
            bottom: "20%",
            [isRTL ? "left" : "right"]: "5%",
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
            top: "40%",
            [isRTL ? "left" : "right"]: "15%",
            width: 100,
            height: 100,
            backgroundColor: "rgba(0, 123, 255, 0.12)",
            transform: [{ translateY: circle3Y }],
          },
        ]}
      />

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

          <Text style={[styles.title, { color: dark ? "#FFFFFF" : "#000000" }]}>
            {t("donorPortal")}
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" },
            ]}
          >
            {t("makeDifference")}
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Animated.Text
              style={[
                styles.label,
                {
                  color: emailFocused
                    ? "#007BFF"
                    : dark
                    ? "#FFFFFF"
                    : "#000000",
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
            >
              {t("emailAddress")}
            </Animated.Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Animated.View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: dark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.04)",
                      borderColor: errors.email ? "#FF3B30" : emailBorderColor,
                      shadowColor: emailFocused ? "#007BFF" : "transparent",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: emailFocused ? 0.2 : 0,
                      shadowRadius: 12,
                      elevation: emailFocused ? 4 : 0,
                      flexDirection: isRTL ? "row-reverse" : "row",
                    },
                  ]}
                >
                  <TextInput
                    placeholder={t("placeholderEmail")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
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
                </Animated.View>
              )}
            />
            {errors.email && (
              <Animated.View style={{ opacity: fadeAnim }}>
                <Text
                  style={[
                    styles.errorText,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                >
                  ⚠️ {errors.email.message}
                </Text>
              </Animated.View>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Animated.Text
              style={[
                styles.label,
                {
                  color: passwordFocused
                    ? "#007BFF"
                    : dark
                    ? "#FFFFFF"
                    : "#000000",
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
            >
              {t("password")}
            </Animated.Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Animated.View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: dark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.04)",
                      borderColor: errors.password
                        ? "#FF3B30"
                        : passwordBorderColor,
                      shadowColor: passwordFocused ? "#007BFF" : "transparent",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: passwordFocused ? 0.2 : 0,
                      shadowRadius: 12,
                      elevation: passwordFocused ? 4 : 0,
                      flexDirection: isRTL ? "row-reverse" : "row",
                    },
                  ]}
                >
                  <TextInput
                    placeholder={t("placeholderEnterPassword")}
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
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
                </Animated.View>
              )}
            />
            {errors.password && (
              <Animated.View style={{ opacity: fadeAnim }}>
                <Text
                  style={[
                    styles.errorText,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                >
                  ⚠️ {errors.password.message}
                </Text>
              </Animated.View>
            )}
          </View>

          {/* Sign In Button */}
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
                  <Text style={styles.buttonText}>{t("signIn")}</Text>
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

          {/* Forgot Password Link */}
          <TouchableOpacity
            onPress={() => {
              if (!showReset) {
                const v = getValues();
                if (v?.email) setResetEmail(v.email);
              }
              setShowReset((s) => !s);
            }}
            style={styles.linkContainer}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>
              {showReset ? t("backToSignIn") : t("forgotPassword")}
            </Text>
          </TouchableOpacity>

          {/* Reset Password Section */}
          {showReset && (
            <Animated.View
              style={[
                styles.resetContainer,
                {
                  opacity: resetOpacityAnim,
                  transform: [{ translateY: resetSlideAnim }],
                  backgroundColor: dark
                    ? "rgba(0, 123, 255, 0.05)"
                    : "rgba(0, 123, 255, 0.03)",
                  borderColor: "rgba(0, 123, 255, 0.2)",
                },
              ]}
            >
              <Text
                style={[
                  styles.resetTitle,
                  { color: dark ? "#FFFFFF" : "#000000" },
                ]}
              >
                {t("resetPassword")}
              </Text>

              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: dark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.04)",
                      borderColor: dark
                        ? "rgba(255, 255, 255, 0.15)"
                        : "rgba(0, 0, 0, 0.15)",
                      flexDirection: isRTL ? "row-reverse" : "row",
                    },
                  ]}
                >
                  <TextInput
                    placeholder={t("placeholderEmailShort")}
                    value={resetEmail}
                    onChangeText={setResetEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
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
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: dark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.04)",
                      borderColor: dark
                        ? "rgba(255, 255, 255, 0.15)"
                        : "rgba(0, 0, 0, 0.15)",
                      flexDirection: isRTL ? "row-reverse" : "row",
                    },
                  ]}
                >
                  <TextInput
                    placeholder={t("placeholderNewPassword")}
                    secureTextEntry={!showResetPassword}
                    value={resetPassword}
                    onChangeText={setResetPassword}
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
                  <TouchableOpacity
                    onPress={() => setShowResetPassword(!showResetPassword)}
                    style={[
                      styles.eyeButton,
                      { [isRTL ? "marginRight" : "marginLeft"]: 8 },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.eyeIcon}>
                      {showResetPassword ? "👁️" : "👁️‍🗨️"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                disabled={resetting}
                onPress={async () => {
                  try {
                    if (!resetEmail) return Alert.alert(t("alertEnterEmail"));
                    if (!resetPassword || resetPassword.length < 6)
                      return Alert.alert(t("alertPasswordLen"));
                    setResetting(true);
                    await donorForgotPassword({
                      email: resetEmail,
                      newPassword: resetPassword,
                    });
                    Alert.alert(t("alertPwUpdated"));
                    await onSubmit({
                      email: resetEmail,
                      password: resetPassword,
                    });
                  } catch (e: any) {
                    Alert.alert(
                      e?.response?.data?.message ||
                        e?.message ||
                        "Failed to reset password"
                    );
                  } finally {
                    setResetting(false);
                  }
                }}
                activeOpacity={0.8}
                style={[
                  styles.button,
                  styles.primaryButton,
                  resetting && styles.buttonDisabled,
                ]}
              >
                {resetting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>{t("resetPassword")}</Text>
                    <Text style={styles.buttonIcon}>✓</Text>
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}

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

          {/* Sign Up Link */}
          <TouchableOpacity
            onPress={() => router.push("/donor/signup")}
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
              {t("createNewAccount")}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  bgCircle: {
    position: "absolute",
    borderRadius: 1000,
    opacity: 0.3,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 440,
    paddingHorizontal: 24,
  },
  card: {
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
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#007BFF",
    fontSize: 15,
    fontWeight: "600",
  },
  resetContainer: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  resetTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
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
