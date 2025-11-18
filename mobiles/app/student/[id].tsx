import { useLanguage } from "@/contexts/LanguageContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDonorAuth } from "@/hooks/useDonorAuth";
import { useStudentById } from "@/hooks/useStudents";
import { getToken } from "@/services/donorAuth.service";
import { translateBackend } from "@/utils/i18n";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Info Card Component with Animation
const InfoCard: React.FC<{
  label: string;
  value: string;
  dark: boolean;
  delay: number;
  isRTL: boolean;
}> = ({ label, value, dark, delay, isRTL }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View
        style={[
          styles.infoCard,
          {
            backgroundColor: dark ? "#000000" : "#FFFFFF",
            borderColor: dark ? "#1a1a1a" : "#f0f0f0",
          },
        ]}
      >
        <View style={styles.infoContent}>
          <Text
            style={[
              styles.label,
              {
                color: dark ? "#808080" : "#666666",
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.value,
              {
                color: dark ? "#FFFFFF" : "#000000",
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {value}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dark = useColorScheme() === "dark";
  const { donor, loading } = useDonorAuth();
  const { t, lang } = useLanguage() as any;

  // Determine if current language is RTL
  const isRTL = lang === "ar";

  const headerAnim = useRef(new Animated.Value(0)).current;
  const avatarScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) router.replace("/donor/signin");
    })();
  }, []);

  const studentId = Number(id);
  const {
    data: student,
    isLoading,
    isError,
    error,
  } = useStudentById(studentId);

  useEffect(() => {
    if (student) {
      // Trigger entrance animations
      Animated.sequence([
        Animated.spring(avatarScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(headerAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [student]);

  // Loading State
  if (isLoading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: dark ? "#000000" : "#FFFFFF" },
        ]}
      >
        <ActivityIndicator size="large" color="#007BFF" />
        <Text
          style={[
            styles.loadingText,
            {
              color: dark ? "#808080" : "#666666",
              textAlign: "center",
            },
          ]}
        >
          {lang === "ar"
            ? "جارٍ تحميل بيانات الطالب..."
            : "Loading student data..."}
        </Text>
      </View>
    );
  }

  // Error State
  if (isError || !student) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: dark ? "#000000" : "#FFFFFF" },
        ]}
      >
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text
          style={[styles.errorText, { color: dark ? "#ff4444" : "#cc0000" }]}
        >
          {lang === "ar" ? "فشل تحميل بيانات الطالب" : "Failed to load student"}
        </Text>
        {error instanceof Error && (
          <Text
            style={[
              styles.errorSubtext,
              { color: dark ? "#666666" : "#999999" },
            ]}
          >
            {error.message ||
              (lang === "ar"
                ? "حدث خطأ. حاول مرة أخرى."
                : "Something went wrong. Please try again.")}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.errorButton,
            {
              backgroundColor: dark ? "#1a1a1a" : "#f0f0f0",
              borderColor: "#007BFF",
            },
          ]}
        >
          <Text style={styles.errorButtonText}>
            {lang === "ar" ? "رجوع←" : "← Go Back"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Success State
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "#00ff88";
      case "DROPOUT":
        return "#ff4444";
      case "AT_RISK":
        return "#ffaa00";
      case "RETURNED":
        return "#00aaff";
      default:
        return "#808080";
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: dark ? "#000000" : "#FFFFFF" },
      ]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <View
          style={[
            styles.backButtonInner,
            {
              backgroundColor: dark ? "#0a0a0a" : "#f8f8f8",
              borderColor: dark ? "#1a1a1a" : "#e0e0e0",
              flexDirection: isRTL ? "row-reverse" : "row",
            },
          ]}
        >
          <Text style={styles.backIcon}>{isRTL ? "→" : "←"}</Text>
          <Text style={[styles.backText, { color: "#007BFF" }]}>
            {lang === "ar" ? "رجوع" : "Back"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Header Section */}
      <View style={styles.headerSection}>
        {/* Avatar */}
        <Animated.View
          style={{
            transform: [{ scale: avatarScale }],
          }}
        >
          <LinearGradient
            colors={["#007BFF", "#0056b3"]}
            style={styles.largeAvatar}
          >
            <Text style={styles.largeAvatarText}>
              {student.fullName.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Name and Status */}
        <Animated.View
          style={{
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <Text
            style={[
              styles.studentName,
              {
                color: dark ? "#FFFFFF" : "#000000",
                textAlign: "center",
              },
            ]}
          >
            {student.fullName}
          </Text>

          <View
            style={[
              styles.statusContainer,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: dark ? "#0a0a0a" : "#f8f8f8",
                  flexDirection: isRTL ? "row-reverse" : "row",
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(student.status) },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: dark ? "#FFFFFF" : "#000000" },
                ]}
              >
                {translateBackend(student.status, lang)}
              </Text>
            </View>

            <View
              style={[
                styles.genderBadge,
                { backgroundColor: dark ? "#0a0a0a" : "#f8f8f8" },
              ]}
            >
              <Text
                style={[
                  styles.genderText,
                  { color: dark ? "#FFFFFF" : "#000000" },
                ]}
              >
                {translateBackend(student.gender, lang)}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Information Cards */}
      <View style={styles.infoSection}>
        <InfoCard
          label={t("nationalNumber")}
          value={student.nationalNumber}
          dark={dark}
          delay={200}
          isRTL={isRTL}
        />

        <InfoCard
          label={t("dateOfBirth") || "Date of Birth"}
          value={new Date(student.dateOfBirth).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          dark={dark}
          delay={300}
          isRTL={isRTL}
        />

        <InfoCard
          label={t("mainLanguage") || "Main Language"}
          value={translateBackend(student.mainLanguage, lang)}
          dark={dark}
          delay={400}
          isRTL={isRTL}
        />

        {student.acquiredLanguage && (
          <InfoCard
            label={t("acquiredLanguage") || "Acquired Language"}
            value={translateBackend(student.acquiredLanguage, lang)}
            dark={dark}
            delay={500}
            isRTL={isRTL}
          />
        )}

        {student.supportNeeds && (
          <InfoCard
            label={t("supportNeeds") || "Support Needs"}
            value={student.supportNeeds}
            dark={dark}
            delay={600}
            isRTL={isRTL}
          />
        )}
      </View>

      {/* Created Date */}
      <Text
        style={[
          styles.createdText,
          {
            color: dark ? "#666666" : "#999999",
            textAlign: "center",
          },
        ]}
      >
        {(t("studentSince") || "Student since") + " "}
        {new Date(student.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })}
      </Text>

      {/* Donate Button */}
      <TouchableOpacity
        style={styles.donateButton}
        onPress={() =>
          router.push(`/donor/donations/new?studentId=${student.id}` as any)
        }
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#007BFF", "#0056b3"]}
          style={styles.donateGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.donateButtonText}>
            {t("supportThisStudent") || "Support This Student"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  errorButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  errorButtonText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: "flex-start",
    gap: 8,
  },
  backIcon: {
    fontSize: 20,
    color: "#007BFF",
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  largeAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  largeAvatarText: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "700",
  },
  studentName: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -1,
  },
  statusContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
  },
  genderBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genderText: {
    fontSize: 14,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#007BFF",
    opacity: 0.2,
    marginBottom: 24,
  },
  infoSection: {
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  createdText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 32,
  },
  donateButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  donateGradient: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
  },
  donateButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
