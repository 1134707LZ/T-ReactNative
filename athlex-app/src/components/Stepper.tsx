import React from "react";
import { Pressable, Text, View } from "react-native";
import Icon from "./Icon";
import { colors } from "../theme";

export default function Stepper({ value, onChange }: { value: number; onChange(v: number): void }) {
  const b = { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.border, alignItems: "center" as const, justifyContent: "center" as const, backgroundColor: colors.surface };
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Pressable style={b} onPress={() => onChange(Math.max(1, value - 1))} accessibilityLabel="Diminuir"><Icon name="minus" size={18} color={colors.text} /></Pressable>
      <Text style={{ minWidth: 40, textAlign: "center", fontSize: 16, fontWeight: "700" }}>{value}</Text>
      <Pressable style={b} onPress={() => onChange(value + 1)} accessibilityLabel="Aumentar"><Icon name="plus" size={18} color={colors.text} /></Pressable>
    </View>
  );
}
