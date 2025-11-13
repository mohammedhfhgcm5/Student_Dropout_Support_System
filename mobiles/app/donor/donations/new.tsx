import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/contexts/ToastContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  useDonationPurposes,
  useSearchDonationPurposes,
} from "@/hooks/useDonationPurposes";
import { useSimulatePayment } from "@/hooks/useDonations";
import { useDonorAuth } from "@/hooks/useDonorAuth";
import { getToken } from "@/services/donorAuth.service";
import { translateBackend } from "@/utils/i18n";
import { fuzzyFilter } from "@/utils/search";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Keyboard,
  ScrollView,
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

export default function NewDonationPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { studentId: qStudentId } = useLocalSearchParams<{
    studentId?: string;
  }>();
  const { donor, loading } = useDonorAuth();
  const dark = useColorScheme() === "dark";
  const { t, lang, isRTL } = useLanguage();

  const { mutateAsync, isPending } = useSimulatePayment();
  const { data: purposes = [], isLoading: isLoadingPurposes } =
    useDonationPurposes();

  const [purposeId, setPurposeId] = useState("");
  const [purposeSearch, setPurposeSearch] = useState("");
  const [debouncedPurposeSearch, setDebouncedPurposeSearch] = useState("");
  const [isPurposeOpen, setIsPurposeOpen] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const studentLocked = !!qStudentId;

  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const dropdownAnim = useRef(new Animated.Value(0)).current;

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
    Animated.spring(dropdownAnim, {
      toValue: isPurposeOpen ? 1 : 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [isPurposeOpen]);

  const decodeDonorIdFromToken = async (): Promise<number | undefined> => {
    try {
      const token = await getToken();
      if (!token) return undefined;
      const middle = token.split(".")[1];
      if (!middle) return undefined;
      const b64 = middle.replace(/-/g, "+").replace(/_/g, "/");
      let json: string | undefined = undefined;
      try {
        // @ts-ignore atob may exist in some environments
        if (typeof atob === "function") json = atob(b64);
      } catch {}
      if (!json) {
        try {
          // @ts-ignore Buffer may be polyfilled by RN/Metro
          // eslint-disable-next-line no-undef
          if (typeof Buffer !== "undefined")
            json = Buffer.from(b64, "base64").toString("utf-8");
        } catch {}
      }
      if (!json) return undefined;
      const payload = JSON.parse(json as string);
      if (payload?.role && String(payload.role).toUpperCase() !== "DONOR")
        return undefined;
      const id =
        typeof payload?.id === "number"
          ? payload.id
          : payload?.sub
          ? Number(payload.sub)
          : undefined;
      return Number.isFinite(id as number) ? (id as number) : undefined;
    } catch {
      return undefined;
    }
  };

  useEffect(() => {
    if (qStudentId && typeof qStudentId === "string") {
      setStudentId(qStudentId);
    }
  }, [qStudentId]);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) router.replace("/donor/signin");
    })();
  }, []);

  const selectedPurposeName = useMemo(() => {
    if (!purposeId) return "";
    const p = purposes.find((x) => String(x.id) === String(purposeId));
    return p?.name ?? "";
  }, [purposeId, purposes]);

  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedPurposeSearch(purposeSearch.trim()),
      250
    );
    return () => clearTimeout(t);
  }, [purposeSearch]);

  const { data: purposeSearchResults = [], isLoading: loadingPurposeSearch } =
    useSearchDonationPurposes(debouncedPurposeSearch);

  const purposeOptions = useMemo(() => {
    if (!purposeSearch.trim()) return purposes;
    const local = fuzzyFilter(
      purposeSearch,
      purposes,
      (p: any) => p?.name ?? ""
    );
    const uniq = new Map<number, any>();
    for (const p of [...purposeSearchResults, ...local]) uniq.set(p.id, p);
    return Array.from(uniq.values());
  }, [purposeSearch, purposeSearchResults, purposes]);

  const handleSubmit = async () => {
    if (!purposeId || !amount) {
      Alert.alert(
        t("error"),
        lang === "ar"
          ? "يرجى اختيار الغرض وإدخال المبلغ."
          : "Please select a purpose and enter amount."
      );
      return;
    }

    try {
      let donorId = donor?.id;
      if (!donorId) {
        donorId = await decodeDonorIdFromToken();
      }
      if (!donorId) {
        const { getCurrentDonor } = await import(
          "@/services/donorAuth.service"
        );
        const me = await getCurrentDonor();
        donorId = me?.id ?? undefined;
      }
      if (!donorId) {
        Alert.alert(
          t("error"),
          lang === "ar"
            ? "يجب أن تكون مسجل الدخول كمتبرع."
            : "You must be logged in as a donor."
        );
        return;
      }
      const dto = {
        donorId: Number(donorId),
        purposeId: Number(purposeId),
        studentId: studentId ? Number(studentId) : undefined,
        amount: Number(amount),
        currency,
      };
      await mutateAsync(dto);
      Keyboard.dismiss();
      router.replace("/(tabs)/donations" as any);
      setTimeout(() => showToast(t("donationSuccess"), "success"), 0);
    } catch (err: any) {
      Alert.alert(
        t("error"),
        err?.response?.data?.message || t("donationFailed")
      );
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
      keyboardShouldPersistTaps="handled"
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { alignSelf: "flex-start" }]}
        >
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
            <Text
              style={[
                styles.backIcon,
                { transform: [{ scaleX: isRTL ? -1 : 1 }] },
              ]}
            >
              ←
            </Text>
            <Text style={[styles.backText, { color: "#007BFF" }]}>
              {lang === "ar" ? "رجوع" : "Back"}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text
            style={[
              styles.subtitle,
              {
                color: dark ? "#808080" : "#666666",
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {lang === "ar" ? "قدم" : "MAKE A"}
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
            {lang === "ar" ? "تبرع" : "Donation"}
          </Text>
          <View
            style={[
              styles.titleUnderline,
              { alignSelf: isRTL ? "flex-end" : "flex-start" },
            ]}
          />
        </View>
      </Animated.View>

      {/* Form */}
      <Animated.View
        style={{
          opacity: formAnim,
          transform: [
            {
              translateY: formAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        {/* Purpose Dropdown */}
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
            {lang === "ar" ? "الغرض من التبرع *" : "DONATION PURPOSE *"}
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdown,
              {
                backgroundColor: dark ? "#0a0a0a" : "#f8f8f8",
                borderColor: dark ? "#1a1a1a" : "#e0e0e0",
                flexDirection: isRTL ? "row-reverse" : "row",
              },
            ]}
            onPress={() => setIsPurposeOpen((v) => !v)}
            disabled={isLoadingPurposes}
          >
            <Text
              style={[
                styles.dropdownText,
                {
                  color: dark ? "#FFFFFF" : "#000000",
                  textAlign: isRTL ? "right" : "left",
                },
                !purposeId && { color: dark ? "#666666" : "#999999" },
              ]}
            >
              {isLoadingPurposes
                ? lang === "ar"
                  ? "جارٍ تحميل الأغراض..."
                  : "Loading purposes..."
                : selectedPurposeName
                ? translateBackend(selectedPurposeName as string, lang as any)
                : t("selectPurpose")}
            </Text>
            <Text
              style={[
                styles.dropdownIcon,
                {
                  transform: [{ rotate: isPurposeOpen ? "180deg" : "0deg" }],
                  [isRTL ? "marginRight" : "marginLeft"]: 12,
                },
              ]}
            >
              ▾
            </Text>
          </TouchableOpacity>

          {isPurposeOpen && (
            <Animated.View
              style={[
                styles.dropdownList,
                {
                  backgroundColor: dark ? "#0a0a0a" : "#FFFFFF",
                  borderColor: dark ? "#1a1a1a" : "#e0e0e0",
                  opacity: dropdownAnim,
                  transform: [
                    {
                      scaleY: dropdownAnim,
                    },
                  ],
                },
              ]}
            >
              <View
                style={[
                  styles.dropdownSearchContainer,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <Text
                  style={[
                    styles.searchIcon,
                    { [isRTL ? "marginLeft" : "marginRight"]: 8 },
                  ]}
                >
                  🔍
                </Text>
                <TextInput
                  placeholder={
                    lang === "ar" ? "ابحث عن الأغراض..." : "Search purposes..."
                  }
                  placeholderTextColor={dark ? "#666666" : "#999999"}
                  value={purposeSearch}
                  onChangeText={setPurposeSearch}
                  style={[
                    styles.dropdownSearchInput,
                    {
                      color: dark ? "#FFFFFF" : "#000000",
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                />
              </View>

              <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                {isLoadingPurposes || loadingPurposeSearch ? (
                  <View style={styles.dropdownLoading}>
                    <ActivityIndicator color="#007BFF" size="small" />
                  </View>
                ) : purposeOptions.length === 0 ? (
                  <Text
                    style={[
                      styles.dropdownEmpty,
                      {
                        color: dark ? "#666666" : "#999999",
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {lang === "ar"
                      ? "لم يتم العثور على أغراض"
                      : "No purposes found"}
                  </Text>
                ) : (
                  purposeOptions.map((p: DonationPurpose) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[
                        styles.dropdownItem,
                        {
                          backgroundColor:
                            String(p.id) === purposeId
                              ? "#007BFF15"
                              : "transparent",
                          flexDirection: isRTL ? "row-reverse" : "row",
                        },
                      ]}
                      onPress={() => {
                        setPurposeId(String(p.id));
                        setPurposeSearch("");
                        setIsPurposeOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          {
                            color: dark ? "#FFFFFF" : "#000000",
                            textAlign: isRTL ? "right" : "left",
                          },
                          String(p.id) === purposeId && { fontWeight: "700" },
                        ]}
                      >
                        {p.name}
                      </Text>
                      {String(p.id) === purposeId && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </Animated.View>
          )}
        </View>

        {/* Student ID */}
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
            {lang === "ar"
              ? `رقم الطالب ${studentLocked ? "(مقفل)" : "(اختياري)"}`
              : `STUDENT ID ${studentLocked ? "(LOCKED)" : "(OPTIONAL)"}`}
          </Text>
          <TextInput
            placeholder={lang === "ar" ? "أدخل رقم الطالب" : "Enter student ID"}
            placeholderTextColor={dark ? "#666666" : "#999999"}
            keyboardType="numeric"
            style={[
              styles.input,
              {
                backgroundColor: studentLocked
                  ? dark
                    ? "#0d0d0d"
                    : "#f0f0f0"
                  : dark
                  ? "#0a0a0a"
                  : "#f8f8f8",
                borderColor: dark ? "#1a1a1a" : "#e0e0e0",
                color: dark ? "#FFFFFF" : "#000000",
                textAlign: isRTL ? "right" : "left",
              },
            ]}
            value={studentId}
            onChangeText={setStudentId}
            editable={!studentLocked}
            selectTextOnFocus={false}
          />
        </View>

        {/* Amount */}
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
            {lang === "ar" ? "المبلغ *" : "AMOUNT *"}
          </Text>
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
                  color: dark ? "#FFFFFF" : "#000000",
                  [isRTL ? "marginLeft" : "marginRight"]: 12,
                },
              ]}
            >
              $
            </Text>
            <TextInput
              placeholder="0.00"
              placeholderTextColor={dark ? "#666666" : "#999999"}
              keyboardType="decimal-pad"
              style={[
                styles.amountInput,
                {
                  backgroundColor: dark ? "#0a0a0a" : "#f8f8f8",
                  borderColor: dark ? "#1a1a1a" : "#e0e0e0",
                  color: dark ? "#FFFFFF" : "#000000",
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Currency */}
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
            {lang === "ar" ? "العملة" : "CURRENCY"}
          </Text>
          <TextInput
            placeholder="USD"
            placeholderTextColor={dark ? "#666666" : "#999999"}
            style={[
              styles.input,
              {
                backgroundColor: dark ? "#0a0a0a" : "#f8f8f8",
                borderColor: dark ? "#1a1a1a" : "#e0e0e0",
                color: dark ? "#FFFFFF" : "#000000",
                textAlign: isRTL ? "right" : "left",
              },
            ]}
            value={currency}
            onChangeText={setCurrency}
            autoCapitalize="characters"
            maxLength={3}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          disabled={isPending}
          onPress={handleSubmit}
          style={styles.submitButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#007BFF", "#0056b3"]}
            style={styles.submitGradient}
          >
            {isPending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitText}>
                {lang === "ar" ? "معالجة التبرع" : "Process Donation"}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
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
  backButton: {
    marginBottom: 24,
    alignSelf: "flex-start", // Ensure it stays on the left side
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
  headerContainer: {
    marginBottom: 32,
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
    marginBottom: 8,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: "#007BFF",
    borderRadius: 2,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "700",
  },
  dropdownList: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    maxHeight: 240,
  },
  dropdownSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  searchIcon: {
    fontSize: 16,
  },
  dropdownSearchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
  },
  dropdownScroll: {
    maxHeight: 180,
  },
  dropdownLoading: {
    padding: 20,
    alignItems: "center",
  },
  dropdownEmpty: {
    padding: 16,
    textAlign: "center",
    fontSize: 14,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: "500",
  },
  checkmark: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "700",
  },
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: "700",
  },
  amountInput: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 24,
    fontWeight: "700",
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  submitGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
