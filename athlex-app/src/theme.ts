export const colors = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primarySoft: "#DBEAFE",
  accent: "#F59E0B",
  success: "#16A34A",
  danger: "#DC2626",
  text: "#0F172A",
  textMuted: "#475569",
  textLight: "#94A3B8",
  border: "#E2E8F0",
  bg: "#F8FAFC",
  surface: "#FFFFFF",
};

// grid de 8px
export const sp = (n: number) => n * 8;

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

export const font = {
  h1: { fontSize: 24, fontWeight: "700" as const, color: colors.text },
  h2: { fontSize: 18, fontWeight: "700" as const, color: colors.text },
  body: { fontSize: 14, color: colors.text },
  small: { fontSize: 12, color: colors.textMuted },
};

export const shadow = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

export const brl = (v: number) =>
  "R$ " + v.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
