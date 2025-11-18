import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/contexts/ToastContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDonorDonations } from "@/hooks/useDonations";
import { useDonorAuth } from "@/hooks/useDonorAuth";
import { getCurrentDonor, getToken } from "@/services/donorAuth.service";
import { translateBackend } from "@/utils/i18n";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Donation {
  id: number;
  amount: number;
  currency: string;
  status?: string;
  purpose?: {
    name?: string;
    title?: string;
  };
  student?: {
    fullName?: string;
  };
  paymentMethod?: string;
  transactionReference?: string;
  donationDate?: string;
  createdAt: string;
}

// Animated Donation Card
const DonationCard: React.FC<{
  item: Donation;
  index: number;
  dark: boolean;
  onPress: () => void;
}> = ({ item, index, dark, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { t, lang } = useLanguage() as any;
  const isRTL = lang === "ar";
  const locale = isRTL ? "ar-EG" : "en-US";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(rotateAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 80,
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

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
      case "SUCCESS":
      case "CONFIRMED":
        return "#00ff88";
      case "PENDING":
        return "#ffaa00";
      case "FAILED":
        return "#ff4444";
      default:
        return "#808080";
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isRTL ? "5deg" : "-5deg", "0deg"],
  });

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateX: slideAnim.interpolate({
              inputRange: [0, 50],
              outputRange: [0, isRTL ? -50 : 50],
            }),
          },
          { scale: scaleAnim },
          { rotate },
        ],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityLabel={`Donation of ${item.amount} ${item.currency}`}
        accessibilityRole="button"
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
          {/* Gradient Accent bar */}
          <LinearGradient
            colors={["#007BFF", "#0056b3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[
              styles.cardAccent,
              { left: isRTL ? undefined : 0, right: isRTL ? 0 : undefined },
            ]}
          />

          <View
            style={[
              styles.cardContent,
              {
                paddingLeft: isRTL ? 16 : 24,
                paddingRight: isRTL ? 24 : 16,
              },
            ]}
          >
            {/* Header with Icon */}
            <View
              style={[
                styles.cardHeader,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <View
                style={[
                  styles.amountSection,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
             
                <View>
                  <View
                    style={[
                      styles.amountContainer,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencySymbol,
                        {
                          color: "#007BFF",
                          marginRight: isRTL ? 0 : 4,
                          marginLeft: isRTL ? 4 : 0,
                        },
                      ]}
                    >
                      $
                    </Text>
                    <Text
                      style={[
                        styles.amount,
                        { color: dark ? "#FFFFFF" : "#000000" },
                      ]}
                    >
                      {Number(item.amount ?? 0).toLocaleString(locale, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.currency,
                      {
                        color: dark ? "#808080" : "#666666",
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {translateBackend(item.currency ?? "", lang)}
                  </Text>
                </View>
              </View>

              {item.status && (
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
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: dark ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    {translateBackend(item.status ?? "", lang)}
                  </Text>
                </View>
              )}
            </View>

            {/* Divider */}
            <View
              style={[
                styles.divider,
                { backgroundColor: dark ? "#1a1a1a" : "#f0f0f0" },
              ]}
            />

            {/* Details with Icons */}
            <View style={styles.detailsContainer}>
              <View
                style={[
                  styles.detailRow,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <View
                  style={[
                    styles.detailLabelContainer,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <Text
                    style={[
                      styles.detailLabel,
                      {
                        color: dark ? "#666666" : "#999999",
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {t("donationPurposeLabel")}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.detailValue,
                    {
                      color: dark ? "#FFFFFF" : "#000000",
                      textAlign: isRTL ? "left" : "right",
                    },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.purpose?.name ??
                    item.purpose?.title ??
                    t("notProvided")}
                </Text>
              </View>

              <View
                style={[
                  styles.detailRow,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <View
                  style={[
                    styles.detailLabelContainer,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <Text
                    style={[
                      styles.detailLabel,
                      {
                        color: dark ? "#666666" : "#999999",
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {t("donationStudentLabel")}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.detailValue,
                    {
                      color: dark ? "#FFFFFF" : "#000000",
                      textAlign: isRTL ? "left" : "right",
                    },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.student?.fullName ?? t("notAssigned")}
                </Text>
              </View>

              {item.paymentMethod && (
                <View
                  style={[
                    styles.detailRow,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <View
                    style={[
                      styles.detailLabelContainer,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.detailLabel,
                        {
                          color: dark ? "#666666" : "#999999",
                          textAlign: isRTL ? "right" : "left",
                        },
                      ]}
                    >
                      {t("paymentMethodLabel")}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color: dark ? "#FFFFFF" : "#000000",
                        textAlign: isRTL ? "left" : "right",
                      },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {translateBackend(item.paymentMethod, lang)}
                  </Text>
                </View>
              )}

              <View
                style={[
                  styles.detailRow,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <View
                  style={[
                    styles.detailLabelContainer,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <Text
                    style={[
                      styles.detailLabel,
                      {
                        color: dark ? "#666666" : "#999999",
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {t("dateLabel")}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.detailValue,
                    {
                      color: dark ? "#FFFFFF" : "#000000",
                      textAlign: isRTL ? "left" : "right",
                    },
                  ]}
                >
                  {new Date(
                    item.donationDate ?? item.createdAt
                  ).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>

              {item.transactionReference && (
                <View
                  style={[
                    styles.detailRow,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <View
                    style={[
                      styles.detailLabelContainer,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.detailLabel,
                        {
                          color: dark ? "#666666" : "#999999",
                          textAlign: isRTL ? "right" : "left",
                        },
                      ]}
                    >
                      {t("referenceLabel")}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.detailValue,
                      styles.referenceText,
                      {
                        color: dark ? "#808080" : "#666666",
                        textAlign: isRTL ? "left" : "right",
                      },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {item.transactionReference}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function DonorDonationsPage() {
  const router = useRouter();
  const { donor, loading } = useDonorAuth();
  const dark = useColorScheme() === "dark";
  const { t, lang } = useLanguage() as any;
  const isRTL = lang === "ar";
  const { showToast } = useToast();
  const [resolvedDonorId, setResolvedDonorId] = useState<number | null>(null);
  const [resolving, setResolving] = useState(true);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) router.replace("/donor/signin");
    })();

    // Advanced entrance animation
    Animated.parallel([
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (donor?.id) {
          setResolvedDonorId(donor.id);
          return;
        }
        const token = await getToken();
        if (token) {
          const mid = token.split(".")[1];
          if (mid) {
            const b64 = mid.replace(/-/g, "+").replace(/_/g, "/");
            let json: string | undefined;
            try {
              // @ts-ignore atob may exist
              if (typeof atob === "function") json = atob(b64);
            } catch {}
            if (!json && typeof Buffer !== "undefined") {
              // @ts-ignore Buffer may be polyfilled
              json = Buffer.from(b64, "base64").toString("utf-8");
            }
            if (json) {
              const payload = JSON.parse(json);
              const id =
                typeof payload?.id === "number"
                  ? payload.id
                  : payload?.sub
                  ? Number(payload.sub)
                  : undefined;
              if (id) {
                setResolvedDonorId(id);
                return;
              }
            }
          }
          const me = await getCurrentDonor();
          if (me?.id) {
            setResolvedDonorId(me.id);
            return;
          }
        }
        setResolvedDonorId(null);
      } finally {
        setResolving(false);
      }
    })();
  }, [donor?.id]);

  const {
    data: donations,
    isLoading,
    isError,
    error,
    refetch,
  } = useDonorDonations(resolvedDonorId ?? 0);

  // Poll for status updates when focused
  useFocusEffect(
    React.useCallback(() => {
      const id = setInterval(() => {
        if (resolvedDonorId) refetch();
      }, 5000);
      return () => clearInterval(id);
    }, [resolvedDonorId, refetch])
  );

  // Toast when any donation transitions to CONFIRMED
  const prevStatuses = useRef<Map<number, string>>(new Map());
  useEffect(() => {
    if (!Array.isArray(donations)) return;
    const prev = prevStatuses.current;
    let confirmedCount = 0;
    for (const d of donations) {
      const before = prev.get(d.id);
      const now = String(d.status ?? "");
      if (before && before !== "CONFIRMED" && now === "CONFIRMED")
        confirmedCount++;
    }
    prev.clear();
    for (const d of donations) prev.set(d.id, String(d.status ?? ""));
    if (confirmedCount === 1) {
      showToast(t("donationConfirmed"), "success");
    } else if (confirmedCount > 1) {
      showToast(
        t("donationsConfirmedMany").replace(
          "{count}",
          confirmedCount.toString()
        ),
        "success"
      );
    }
  }, [donations, showToast, t]);

  // Loading State
  if (loading || resolving || (resolvedDonorId && isLoading)) {
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
          {t("loadingDonations")}
        </Text>
      </View>
    );
  }

  // Error State
  if (isError) {
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
          {t("failedToLoadDonations")}
        </Text>
        {error instanceof Error && (
          <Text
            style={[
              styles.errorSubtext,
              { color: dark ? "#666666" : "#999999" },
            ]}
          >
            {error.message}
          </Text>
        )}
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
      {/* Advanced Header */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateX: slideAnim.interpolate({
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
              styles.headerContent,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
           
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: dark ? "#808080" : "#666666",
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {t("donationsHeaderSubtitle")}
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
                {t("donations")}
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

      {/* Donations List */}
      <FlatList
        data={Array.isArray(donations) ? donations : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <DonationCard
            item={item}
            index={index}
            dark={dark}
            onPress={() => {
              /* navigation disabled per request */
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💝</Text>
            <Text
              style={[
                styles.emptyText,
                {
                  color: dark ? "#666666" : "#999999",
                  textAlign: "center",
                },
              ]}
            >
              {t("noDonationsYet")}
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                {
                  color: dark ? "#4d4d4d" : "#cccccc",
                  textAlign: "center",
                },
              ]}
            >
              {t("startMakingDifference")}
            </Text>
          </View>
        }
        contentContainerStyle={[
          styles.listContent,
          donations?.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
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
    textAlign: "center",
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
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerContent: {
    alignItems: "center",
    marginBottom: 12,
  },
  headerIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcon: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -1,
  },
  titleUnderline: {
    width: 80,
    height: 4,
    backgroundColor: "#007BFF",
    borderRadius: 2,
  },
  listContent: {
    paddingBottom: 100,
  },
  listEmpty: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 80,
    opacity: 0.5,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: "400",
  },
  card: {
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 5,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  amountSection: {
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 24,
  },
  amountContainer: {
    alignItems: "baseline",
    marginBottom: 2,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: "700",
  },
  amount: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -1,
  },
  currency: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.7,
  },
  statusBadge: {
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginBottom: 16,
    opacity: 0.5,
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabelContainer: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  detailIcon: {
    fontSize: 16,
    opacity: 0.7,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1.5,
  },
  referenceText: {
    fontSize: 11,
    fontFamily: "monospace",
    opacity: 0.8,
  },
});
