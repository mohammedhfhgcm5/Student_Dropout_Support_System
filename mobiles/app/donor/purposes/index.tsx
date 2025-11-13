import { useLanguage } from "@/contexts/LanguageContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  useCreateDonationPurpose,
  useDonationPurposes,
  useSearchDonationPurposes,
} from "@/hooks/useDonationPurposes";
import { fuzzyFilter } from "@/utils/search";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DonationPurpose {
  id: number;
  name: string;
}

// Animated Purpose Card
const PurposeCard: React.FC<{
  item: DonationPurpose;
  index: number;
  dark: boolean;
  isRTL: boolean;
}> = ({ item, index, dark, isRTL }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isRTL ? -30 : 30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      }}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: dark ? "#000000" : "#FFFFFF",
            borderColor: dark ? "#1a1a1a" : "#f0f0f0",
          },
          isRTL ? styles.rtl : styles.ltr,
        ]}
      >
        <View
          style={[
            styles.cardAccent,
            isRTL ? styles.cardAccentRtl : styles.cardAccentLtr,
          ]}
        />
        <View
          style={[
            styles.cardContent,
            isRTL ? styles.cardContentRtl : styles.cardContentLtr,
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              isRTL ? styles.iconCircleRtl : styles.iconCircleLtr,
            ]}
          >
            <Text style={styles.iconText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text
            style={[
              styles.purposeName,
              { color: dark ? "#FFFFFF" : "#000000" },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default function DonationPurposesPage() {
  const [newPurpose, setNewPurpose] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const dark = useColorScheme() === "dark";
  const { t, lang } = useLanguage() as any;
  const isRTL = lang === "ar";
  const directionStyle = isRTL ? styles.rtl : styles.ltr;

  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  const { data: purposes = [], isLoading } = useDonationPurposes();
  const { data: searchResults = [], isLoading: loadingSearch } =
    useSearchDonationPurposes(debouncedQ);
  const { mutateAsync, isPending } = useCreateDonationPurpose();

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(formAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const combinedData = useMemo(() => {
    if (!query.trim()) return purposes;
    const local = fuzzyFilter(query, purposes, (p: any) => p?.name ?? "");
    const uniq = new Map<number, any>();
    for (const p of [...searchResults, ...local]) uniq.set(p.id, p);
    return Array.from(uniq.values());
  }, [query, purposes, searchResults]);

  const handleAdd = async () => {
    if (!newPurpose.trim())
      return Alert.alert(t("error"), t("enterPurposeName"));
    try {
      await mutateAsync({ name: newPurpose });
      setNewPurpose("");
      Keyboard.dismiss();
      Alert.alert(t("success"), t("purposeAddedSuccess"));
    } catch (err: any) {
      Alert.alert(
        t("error"),
        err?.response?.data?.message || t("failedToAddPurpose")
      );
    }
  };

  // RTL/LTR text alignment helpers
  const getTextAlign = () => (isRTL ? "right" : "left");
  const getFlexAlign = () => (isRTL ? "flex-end" : "flex-start");

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dark ? "#000000" : "#FFFFFF" },
        directionStyle,
      ]}
    >
      {/* Header */}
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
        <View style={[styles.headerContainer, directionStyle]}>
          <Text
            style={[
              styles.subtitle,
              {
                color: dark ? "#808080" : "#666666",
                textAlign: getTextAlign(),
                writingDirection: isRTL ? "rtl" : "ltr",
              },
            ]}
          >
            {t("manage")?.toUpperCase() || "MANAGE"}
          </Text>
          <Text
            style={[
              styles.title,
              {
                color: dark ? "#FFFFFF" : "#000000",
                textAlign: getTextAlign(),
                writingDirection: isRTL ? "rtl" : "ltr",
              },
            ]}
          >
            {t("donationPurposes") || "Donation Purposes"}
          </Text>
          <View
            style={[
              styles.titleUnderline,
              isRTL ? styles.titleUnderlineRtl : styles.titleUnderlineLtr,
            ]}
          />
        </View>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View
        style={{
          opacity: formAnim,
          transform: [
            {
              scale: formAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
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
            },
            isRTL ? styles.searchContainerRtl : styles.searchContainerLtr,
          ]}
        >
          <Text
            style={[
              styles.searchIcon,
              isRTL ? styles.searchIconRtl : styles.searchIconLtr,
            ]}
          >
            🔍
          </Text>
          <TextInput
            placeholder={t("searchPurposes") || "Search purposes..."}
            placeholderTextColor={dark ? "#666666" : "#999999"}
            value={query}
            onChangeText={setQuery}
            style={[
              styles.searchInput,
              {
                color: dark ? "#FFFFFF" : "#000000",
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              },
            ]}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Text
                style={[
                  styles.clearButton,
                  isRTL ? styles.clearButtonRtl : styles.clearButtonLtr,
                ]}
              >
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Add New Purpose Form */}
        <View
          style={[
            styles.formContainer,
            {
              backgroundColor: dark ? "#0a0a0a" : "#f8f8f8",
              borderColor: dark ? "#1a1a1a" : "#e0e0e0",
            },
            directionStyle,
          ]}
        >
          <Text
            style={[
              styles.formLabel,
              {
                color: dark ? "#808080" : "#666666",
                textAlign: getTextAlign(),
                writingDirection: isRTL ? "rtl" : "ltr",
              },
            ]}
          >
            {t("addNewPurpose")?.toUpperCase() || "ADD NEW PURPOSE"}
          </Text>
          <View
            style={[
              styles.inputRow,
              isRTL ? styles.inputRowRtl : styles.inputRowLtr,
            ]}
          >
            <TextInput
              placeholder={t("enterPurposeName") || "Enter purpose name"}
              placeholderTextColor={dark ? "#666666" : "#999999"}
              value={newPurpose}
              onChangeText={setNewPurpose}
              style={[
                styles.input,
                {
                  backgroundColor: dark ? "#000000" : "#FFFFFF",
                  borderColor: dark ? "#1a1a1a" : "#e0e0e0",
                  color: dark ? "#FFFFFF" : "#000000",
                  textAlign: isRTL ? "right" : "left",
                  writingDirection: isRTL ? "rtl" : "ltr",
                },
              ]}
            />
            <TouchableOpacity
              disabled={isPending}
              onPress={handleAdd}
              style={styles.addButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#007BFF", "#0056b3"]}
                style={styles.addGradient}
              >
                {isPending ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.addText}>{t("add") || "Add"}</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Content */}
      {isLoading || loadingSearch ? (
        <View style={[styles.loadingContainer, directionStyle]}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text
            style={[
              styles.loadingText,
              {
                color: dark ? "#808080" : "#666666",
                textAlign: "center",
                writingDirection: isRTL ? "rtl" : "ltr",
              },
            ]}
          >
            {t("loadingPurposes") || "Loading purposes..."}
          </Text>
        </View>
      ) : combinedData.length === 0 ? (
        <View style={[styles.emptyContainer, directionStyle]}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text
            style={[
              styles.emptyText,
              {
                color: dark ? "#666666" : "#999999",
                textAlign: "center",
                writingDirection: isRTL ? "rtl" : "ltr",
              },
            ]}
          >
            {query.trim()
              ? t("noPurposesFound") || "No purposes found"
              : t("noPurposesYet") || "No purposes yet"}
          </Text>
          {!query.trim() && (
            <Text
              style={[
                styles.emptySubtext,
                {
                  color: dark ? "#4d4d4d" : "#cccccc",
                  textAlign: "center",
                  writingDirection: isRTL ? "rtl" : "ltr",
                },
              ]}
            >
              {t("addFirstPurpose") || "Add your first donation purpose above"}
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={combinedData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <PurposeCard item={item} index={index} dark={dark} isRTL={isRTL} />
          )}
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
  rtl: {
    direction: "rtl",
    writingDirection: "rtl",
  },
  ltr: {
    direction: "ltr",
    writingDirection: "ltr",
  },
  headerContainer: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
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
  titleUnderlineLtr: {
    alignSelf: "flex-start",
  },
  titleUnderlineRtl: {
    alignSelf: "flex-end",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  searchContainerLtr: {
    flexDirection: "row",
  },
  searchContainerRtl: {
    flexDirection: "row-reverse",
  },
  searchIcon: {
    fontSize: 18,
  },
  searchIconLtr: {
    marginRight: 12,
  },
  searchIconRtl: {
    marginLeft: 12,
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
  clearButtonLtr: {
    marginLeft: 0,
  },
  clearButtonRtl: {
    marginRight: 0,
  },
  formContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  inputRow: {
    gap: 12,
  },
  inputRowLtr: {
    flexDirection: "row",
  },
  inputRowRtl: {
    flexDirection: "row-reverse",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: "400",
  },
  addButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addGradient: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  addText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 64,
    opacity: 0.5,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: "400",
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    overflow: "hidden",
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
  cardAccentLtr: {
    left: 0,
    right: undefined,
  },
  cardAccentRtl: {
    left: undefined,
    right: 0,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  cardContentLtr: {
    paddingLeft: 20,
  },
  cardContentRtl: {
    paddingRight: 20,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007BFF15",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleLtr: {
    marginRight: 16,
  },
  iconCircleRtl: {
    marginLeft: 16,
  },
  iconText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007BFF",
  },
  purposeName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
});
