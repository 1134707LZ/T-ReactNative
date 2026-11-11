import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "./Navbar";
import { colors } from "../theme";

export default function Screen({ children, back, scroll = true, footer, hideNavbar }: {
  children: React.ReactNode; back?: boolean; scroll?: boolean; footer?: React.ReactNode; hideNavbar?: boolean;
}) {
  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      {!hideNavbar && <Navbar back={back} />}
      {scroll ? (
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">{children}</ScrollView>
      ) : (
        <View style={[s.content, { flex: 1 }]}>{children}</View>
      )}
      {footer ? <View style={s.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 32 },
  footer: { padding: 16, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
