import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/contexts/ToastContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDonorAuth } from "@/hooks/useDonorAuth";
import {
  getDonorNationalNumber,
  getDonorProfile,
  getToken,
  updateDonorProfile,
} from "@/services/donorAuth.service";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { donor, loading, logout } = useDonorAuth();
  const dark = useColorScheme() === "dark";
  const { showToast } = useToast();
  const { t, lang } = useLanguage() as any;
  const insets = useSafeAreaInsets();
  const tabBarHeight = (
    typeof useBottomTabBarHeight === "function" ? useBottomTabBarHeight() : 0
  ) as number;
  const baseContentBottomPadding = 40;

  // Determine if current language is RTL
  const isRTL = lang === "ar";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [nationalNumber, setNationalNumber] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const avatarScale = useRef(new Animated.Value(0)).current;
  const slideDirection = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) router.replace("/donor/signin");
    })();

    // Entrance animations with directional slide
    Animated.sequence([
      Animated.parallel([
        Animated.spring(headerAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(slideDirection, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(avatarScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(cardAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    (async () => {
      const profile = await getDonorProfile();
      if (profile) {
        setName(profile.name ?? "");
        setEmail(profile.email ?? "");
        setPhone(profile.phone ?? "");
      } else if (donor) {
        setName(donor.name ?? "");
        setEmail(donor.email ?? "");
      }
      try {
        const nn = await getDonorNationalNumber();
        if (nn?.nationalNumber) setNationalNumber(nn.nationalNumber);
      } catch {}
    })();
  }, [donor?.id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload: any = {};
      if (name !== undefined) payload.name = name;
      if (email !== undefined) payload.email = email;
      if (phone !== undefined) payload.phone = phone;
      await updateDonorProfile(payload);

      showToast(t("toastProfileUpdated"), "success");
      setIsEditing(false);
    } catch (e: any) {
      showToast(
        e?.response?.data?.message || e?.message || t("toastUpdateFailed"),
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/donor/signin");
  };

  if ((loading && !donor) || (!name && !email && !donor)) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: dark ? "#000000" : "#FFFFFF" },
        ]}
      >
        <ActivityIndicator size="large" color="#007BFF" />
        <Text
          style={[styles.loadingText, { color: dark ? "#808080" : "#666666" }]}
        >
          {t("loadingProfile")}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dark ? "#000000" : "#FFFFFF" },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="always"
        scrollIndicatorInsets={{ bottom: tabBarHeight }}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              baseContentBottomPadding + insets.bottom + tabBarHeight,
          },
        ]}
      >
        {/* Header */}
        <Animated.View
          style={{
            opacity: headerAnim,
            transform: [
              {
                translateX: slideDirection.interpolate({
                  inputRange: [0, 1],
                  outputRange: [isRTL ? 50 : -50, 0],
                }),
              },
            ],
          }}
        >
          <View style={styles.headerContainer}>
            <View
              style={[
                styles.headerTop,
                { alignItems: isRTL ? "flex-end" : "flex-start" },
              ]}
            >
              <View style={{ width: "100%" }}>
                <Text
                  style={[
                    styles.subtitle,
                    {
                      color: dark ? "#808080" : "#666666",
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                >
                  {t("donor")}
                </Text>
                <Text
                  style={[
                    styles.title,
                    {
                      color: dark ? "#FFFFFF" : "#000000",
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                >
                  {t("profile")}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.titleUnderline,
                { alignSelf: isRTL ? "flex-end" : "flex-start" },
              ]}
            />
          </View>
        </Animated.View>

        {/* Avatar Section */}
        <Animated.View
          style={{
            opacity: avatarScale,
            transform: [
              { scale: avatarScale },
              {
                rotateY: avatarScale.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["90deg", "0deg"],
                }),
              },
            ],
          }}
        >
          <View style={styles.avatarSection}>
            <LinearGradient
              colors={["#007BFF", "#0056b3"]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {name.charAt(0).toUpperCase() || "D"}
              </Text>
            </LinearGradient>
            <Text
              style={[
                styles.userName,
                {
                  color: dark ? "#FFFFFF" : "#000000",
                  textAlign: "center",
                },
              ]}
            >
              {name || t("donorNameFallback")}
            </Text>
            <Text
              style={[
                styles.userEmail,
                {
                  color: dark ? "#808080" : "#666666",
                  textAlign: "center",
                },
              ]}
            >
              {email || t("noEmailProvided")}
            </Text>
          </View>
        </Animated.View>

        {/* Information Card */}
        <Animated.View
          style={{
            opacity: cardAnim,
            transform: [
              {
                translateX: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [isRTL ? -50 : 50, 0],
                }),
              },
              {
                scale: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          }}
        >
          <View
            style={[
              styles.card,
              {
                backgroundColor: dark ? "#000000" : "#FFFFFF",
                borderColor: dark ? "#1a1a1a" : "#f0f0f0",
              },
            ]}
          >
            <View
              style={[
                styles.cardAccent,
                { left: isRTL ? undefined : 0, right: isRTL ? 0 : undefined },
              ]}
            />

            <View
              style={[
                styles.cardHeader,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <View
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: dark ? "#007BFF20" : "#007BFF10" },
                  ]}
                >
                  <Text style={styles.iconText}>👤</Text>
                </View>
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: dark ? "#FFFFFF" : "#000000",
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                >
                  {t("personalInfo")}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                style={[
                  styles.editButton,
                  {
                    backgroundColor: isEditing
                      ? "#007BFF15"
                      : dark
                      ? "#0a0a0a"
                      : "#f8f8f8",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.editButtonText,
                    {
                      color: isEditing
                        ? "#007BFF"
                        : dark
                        ? "#FFFFFF"
                        : "#000000",
                    },
                  ]}
                >
                  {isEditing
                    ? lang === "ar"
                      ? "إلغاء"
                      : "Cancel"
                    : lang === "ar"
                    ? "تعديل"
                    : "Edit"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldContainer}>
              <Text
                style={[
                  styles.label,
                  {
                    color: dark ? "#808080" : "#666666",
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {t("fullName")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isEditing
                      ? dark
                        ? "#0a0a0a"
                        : "#f8f8f8"
                      : "transparent",
                    borderColor: isEditing
                      ? dark
                        ? "#1a1a1a"
                        : "#e0e0e0"
                      : "transparent",
                    color: dark ? "#FFFFFF" : "#000000",
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
                value={name}
                onChangeText={setName}
                placeholder={t("placeholderFullName")}
                placeholderTextColor={dark ? "#666666" : "#999999"}
                editable={isEditing}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text
                style={[
                  styles.label,
                  {
                    color: dark ? "#808080" : "#666666",
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {t("emailAddress")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isEditing
                      ? dark
                        ? "#0a0a0a"
                        : "#f8f8f8"
                      : "transparent",
                    borderColor: isEditing
                      ? dark
                        ? "#1a1a1a"
                        : "#e0e0e0"
                      : "transparent",
                    color: dark ? "#FFFFFF" : "#000000",
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder={t("placeholderEmail")}
                placeholderTextColor={dark ? "#666666" : "#999999"}
                editable={isEditing}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text
                style={[
                  styles.label,
                  {
                    color: dark ? "#808080" : "#666666",
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {t("phoneNumber")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isEditing
                      ? dark
                        ? "#0a0a0a"
                        : "#f8f8f8"
                      : "transparent",
                    borderColor: isEditing
                      ? dark
                        ? "#1a1a1a"
                        : "#e0e0e0"
                      : "transparent",
                    color: dark ? "#FFFFFF" : "#000000",
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder={t("placeholderPhone")}
                placeholderTextColor={dark ? "#666666" : "#999999"}
                editable={isEditing}
              />
            </View>

            {isEditing && (
              <TouchableOpacity
                disabled={saving}
                onPress={handleSave}
                style={styles.saveButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#007BFF", "#0056b3"]}
                  style={styles.saveGradient}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.saveText}>{t("saveChanges")}</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* National Number Card */}
        <Animated.View
          style={{
            opacity: cardAnim,
            transform: [
              {
                translateX: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [isRTL ? 50 : -50, 0],
                }),
              },
              {
                scale: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          }}
        >
          <View
            style={[
              styles.card,
              {
                backgroundColor: dark ? "#000000" : "#FFFFFF",
                borderColor: dark ? "#1a1a1a" : "#f0f0f0",
              },
            ]}
          >
            <View
              style={[
                styles.cardAccent,
                {
                  [isRTL ? "right" : "left"]: 0,
                  [isRTL ? "left" : "right"]: undefined,
                },
              ]}
            />

            <View
              style={[
                styles.cardHeader,
                {
                  flexDirection: isRTL ? "row-reverse" : "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              <View
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: dark ? "#007BFF20" : "#007BFF10",
                      marginEnd: isRTL ? 0 : 8,
                      marginStart: isRTL ? 8 : 0,
                    },
                  ]}
                >
                  <Text style={styles.iconText}>🆔</Text>
                </View>
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: dark ? "#FFFFFF" : "#000000",
                      textAlign: isRTL ? "right" : "left",
                      writingDirection: isRTL ? "rtl" : "ltr",
                    },
                  ]}
                >
                  {t("identification")}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.infoRow,
                {
                  flexDirection: isRTL ? "row-reverse" : "row",
                  backgroundColor: dark ? "#0a0a0a" : "#f8f8f8",
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: dark ? "#1a1a1a" : "#e0e0e0",
                  alignItems: "center",
                },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color: dark ? "#808080" : "#666666",
                    textAlign: isRTL ? "right" : "left",
                    writingDirection: isRTL ? "rtl" : "ltr",
                    flex: 1,
                  },
                ]}
              >
                {t("nationalNumber")}
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    color: dark ? "#FFFFFF" : "#000000",
                    textAlign: isRTL ? "left" : "right",
                    writingDirection: isRTL ? "rtl" : "ltr",
                    fontWeight: "700",
                  },
                ]}
              >
                {nationalNumber || donor?.nationalNumber || t("notProvided")}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={dark ? ["#1a0a0a", "#0a0000"] : ["#fff5f5", "#ffe5e5"]}
            style={[
              styles.logoutInner,
              {
                borderColor: "#ff3b30",
                flexDirection: isRTL ? "row-reverse" : "row",
              },
            ]}
          >
            <Text style={styles.logoutText}>{t("signOut")}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 32,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: "700",
    letterSpacing: -1,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: "#007BFF",
    borderRadius: 2,
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "700",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: "500",
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#007BFF",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "NotoNaskhArabicRegular",
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  logoutButton: {
    marginTop: 16,
  },
  logoutInner: {
    borderRadius: 16,
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  logoutIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ff3b3020",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIcon: {
    fontSize: 16,
  },
  logoutText: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "700",
  },
});
