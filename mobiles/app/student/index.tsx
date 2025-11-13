import { useLanguage } from "@/contexts/LanguageContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDonorAuth } from "@/hooks/useDonorAuth";
import { useStudents, useStudentSearch } from "@/hooks/useStudents";
import { getToken } from "@/services/donorAuth.service";
import { Student } from "@/types/student";
import { translateBackend } from "@/utils/i18n";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Types
interface StudentCardProps {
  item: Student;
  index: number;
  dark: boolean;
  onPress: () => void;
  isRTL: boolean;
}

// Animated Card Component
const StudentCard: React.FC<StudentCardProps> = ({
  item,
  index,
  dark,
  onPress,
  isRTL,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const { t, lang } = useLanguage() as any;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
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
          {/* Accent Line */}
          <View
            style={[
              styles.accentLine,
              { left: isRTL ? undefined : 0, right: isRTL ? 0 : undefined },
            ]}
          />

          {/* Content */}
          <View
            style={[
              styles.cardContent,
              {
                flexDirection: isRTL ? "row-reverse" : "row",
                paddingLeft: isRTL ? 16 : 20,
                paddingRight: isRTL ? 20 : 16,
              },
            ]}
          >
            <View
              style={[
                styles.avatarContainer,
                {
                  marginRight: isRTL ? 0 : 16,
                  marginLeft: isRTL ? 16 : 0,
                },
              ]}
            >
              <LinearGradient
                colors={["#007BFF", "#0056b3"]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {item.fullName.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.infoContainer}>
              <Text
                style={[
                  styles.name,
                  {
                    color: dark ? "#FFFFFF" : "#000000",
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
                numberOfLines={1}
              >
                {item.fullName}
              </Text>

              <View
                style={[
                  styles.statusRow,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: dark ? "#1a1a1a" : "#f5f5f5",
                      flexDirection: isRTL ? "row-reverse" : "row",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          item.status === "ACTIVE"
                            ? "#00ff88"
                            : item.status === "DROPOUT"
                            ? "#ff4444"
                            : item.status === "AT_RISK"
                            ? "#ffaa00"
                            : "#00aaff",
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.badgeText,
                      { color: dark ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    {translateBackend(item.status, lang)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.badge,
                    { backgroundColor: dark ? "#1a1a1a" : "#f5f5f5" },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: dark ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    {translateBackend(item.gender, lang)}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.nationalNumber,
                  {
                    color: dark ? "#808080" : "#666666",
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {t("nationalNumber")}: {item.nationalNumber}
              </Text>
            </View>

            {/* Arrow Indicator */}
            <View
              style={[
                styles.arrowContainer,
                {
                  marginLeft: isRTL ? 0 : 12,
                  marginRight: isRTL ? 12 : 0,
                },
              ]}
            >
              <Text style={styles.arrow}>{isRTL ? "←" : "→"}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function StudentPage() {
  const [query, setQuery] = useState("");
  const dark = useColorScheme() === "dark";
  const { t, lang } = useLanguage() as any;
  const router = useRouter();
  const { donor, loading } = useDonorAuth();

  // Determine if current language is RTL
  const isRTL = lang === "ar";

  const headerAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) router.replace("/donor/signin");
    })();

    // Entrance animations
    Animated.sequence([
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(searchAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const {
    data: allStudents,
    isLoading: loadingAll,
    refetch,
    isError,
  } = useStudents(0, 20);

  const { data: searchedStudents, isLoading: loadingSearch } =
    useStudentSearch(query);

  const students =
    query.trim().length > 0 ? searchedStudents ?? [] : allStudents ?? [];

  const isLoading = loadingAll || loadingSearch;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dark ? "#000000" : "#FFFFFF" },
      ]}
    >
      {/* Animated Header */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-30, 0],
              }),
            },
          ],
        }}
      >
        <View style={styles.headerContainer}>
          <Text
            style={[
              styles.greeting,
              {
                color: dark ? "#808080" : "#666666",
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {t("donorPortal")}
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
            {t("students")}
          </Text>
          <View
            style={[
              styles.titleUnderline,
              { alignSelf: isRTL ? "flex-end" : "flex-start" },
            ]}
          />
        </View>
      </Animated.View>

      {/* Animated Search */}
      <Animated.View
        style={{
          opacity: searchAnim,
          transform: [
            {
              scale: searchAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        }}
      >
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: dark ? "#0a0a0a" : "#f8f8f8",
              borderColor: dark ? "#1a1a1a" : "#e0e0e0",
              flexDirection: isRTL ? "row-reverse" : "row",
            },
          ]}
        >
          <Text
            style={[
              styles.searchIcon,
              {
                marginRight: isRTL ? 0 : 12,
                marginLeft: isRTL ? 12 : 0,
              },
            ]}
          >
            🔍
          </Text>
          <TextInput
            placeholder={t("searchStudentsPlaceholder")}
            placeholderTextColor={dark ? "#666666" : "#999999"}
            value={query}
            onChangeText={setQuery}
            style={[
              styles.searchInput,
              {
                color: dark ? "#FFFFFF" : "#000000",
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text
            style={[
              styles.loadingText,
              { color: dark ? "#808080" : "#666666" },
            ]}
          >
            {t("loadingStudents")}
          </Text>
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text
            style={[styles.errorText, { color: dark ? "#ff4444" : "#cc0000" }]}
          >
            {t("failedToLoadStudents")}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>{t("retry")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={Array.isArray(students) ? students : []}
          keyExtractor={(item) => item.id.toString()}
          refreshing={isLoading}
          onRefresh={refetch}
          renderItem={({ item, index }) => (
            <StudentCard
              item={item}
              index={index}
              dark={dark}
              onPress={() => router.push(`/student/${item.id}`)}
              isRTL={isRTL}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📚</Text>
              <Text
                style={[
                  styles.emptyText,
                  { color: dark ? "#666666" : "#999999" },
                ]}
              >
                {t("noStudentsFound")}
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerContainer: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: "700",
    letterSpacing: -1,
    marginBottom: 8,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: "#007BFF",
    borderRadius: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
  },
  clearButton: {
    fontSize: 18,
    color: "#666666",
    paddingHorizontal: 8,
  },
  card: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  accentLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#007BFF",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatarContainer: {},
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  statusRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  nationalNumber: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "NotoNaskhArabicRegular",
  },
  arrowContainer: {},
  arrow: {
    fontSize: 24,
    color: "#007BFF",
    fontWeight: "300",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  errorIcon: {
    fontSize: 48,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
  },
  retryButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 16,
  },
  emptyIcon: {
    fontSize: 64,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 24,
  },
});
