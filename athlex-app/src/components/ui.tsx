import React from "react";
import {
  ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle,
} from "react-native";
import { colors, font, radius, shadow } from "../theme";

export function Button({ title, onPress, variant = "primary", loading, disabled, style }: {
  title: string; onPress(): void; variant?: "primary" | "outline" | "ghost" | "accent";
  loading?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle>;
}) {
  const bg = variant === "primary" ? colors.primary : variant === "accent" ? colors.accent : "transparent";
  const fg = variant === "primary" || variant === "accent" ? "#fff" : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        variant === "outline" && { borderWidth: 1.5, borderColor: colors.primary },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[s.btnText, { color: fg }]}>{title}</Text>}
    </Pressable>
  );
}

export function Input({ label, error, style, ...rest }: TextInputProps & { label?: string; error?: string }) {
  return (
    <View style={[{ marginBottom: 16 }, style]}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textLight}
        {...rest}
        style={[s.input, !!error && { borderColor: colors.danger }]}
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress(): void }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
      <Text style={[s.chipText, active && { color: "#fff" }]}>{label}</Text>
    </Pressable>
  );
}

export function Swatch({ color, active, onPress }: { color: string; active?: boolean; onPress(): void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[s.swatchOuter, active && { borderColor: colors.primary }]}
      accessibilityLabel={`Cor ${color}`}
    >
      <View style={[s.swatch, { backgroundColor: color, borderColor: colors.border }]} />
    </Pressable>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={[font.h2, { marginBottom: 12, marginTop: 8 }]}>{children}</Text>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Empty({ text }: { text: string }) {
  return <Text style={{ textAlign: "center", color: colors.textMuted, marginTop: 48 }}>{text}</Text>;
}

const s = StyleSheet.create({
  btn: { height: 48, borderRadius: radius.md, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  btnText: { fontSize: 16, fontWeight: "600" },
  label: { fontSize: 13, fontWeight: "600", color: colors.text, marginBottom: 6 },
  input: {
    height: 48, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14,
    backgroundColor: colors.surface, fontSize: 15, color: colors.text,
  },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
  chip: {
    paddingHorizontal: 14, height: 36, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", marginRight: 8,
  },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.textMuted },
  swatchOuter: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: "transparent", alignItems: "center", justifyContent: "center", marginRight: 8 },
  swatch: { width: 30, height: 30, borderRadius: 15, borderWidth: 1 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, ...shadow },
});
