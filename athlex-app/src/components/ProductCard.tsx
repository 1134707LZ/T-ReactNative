import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "./Icon";
import { brl, colors, radius, shadow } from "../theme";
import { Produto } from "../types";

export default function ProductCard({ produto, horizontal }: { produto: Produto; horizontal?: boolean }) {
  const nav = useNavigation<any>();
  const tint = produto.cores[0] === "#FFFFFF" ? colors.primarySoft : produto.cores[0] + "22";
  return (
    <Pressable
      onPress={() => nav.navigate("Detalhe", { id: produto.id })}
      style={[s.card, horizontal ? s.h : s.v]}
    >
      <View style={[s.img, { backgroundColor: tint }]}>
        {produto.imagem ? (
          <Image source={{ uri: produto.imagem }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <Icon name="tag" size={36} color={produto.cores[0] === "#FFFFFF" ? colors.primary : produto.cores[0]} />
        )}
      </View>
      <View style={{ padding: 12 }}>
        <Text numberOfLines={2} style={s.name}>{produto.nome}</Text>
        <Text style={s.cat}>{produto.categoria}{produto.personalizavel ? " · Personalizável" : ""}</Text>
        <Text style={s.price}>{brl(produto.preco)}</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, overflow: "hidden", ...shadow },
  h: { width: 160, marginRight: 12 },
  v: { flex: 1, margin: 6 },
  img: { height: 110, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 14, fontWeight: "600", color: colors.text, minHeight: 36 },
  cat: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  price: { fontSize: 16, fontWeight: "700", color: colors.primary, marginTop: 6 },
});
