import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "../components/Icon";
import ProductCard from "../components/ProductCard";
import Screen from "../components/Screen";
import { Chip, Empty, SectionTitle } from "../components/ui";
import { CATEGORIAS } from "../data/mock";
import { api } from "../services/api";
import { colors, font, radius } from "../theme";
import { Produto } from "../types";

function SearchBar({ value, onChange, onSubmit }: { value: string; onChange(v: string): void; onSubmit?(): void }) {
  return (
    <View style={s.search}>
      <Icon name="search" size={20} />
      <TextInput
        value={value} onChangeText={onChange} onSubmitEditing={onSubmit} returnKeyType="search"
        placeholder="Buscar chuteiras, camisas, bolas…" placeholderTextColor={colors.textLight} style={s.searchInput}
      />
    </View>
  );
}

export function HomeScreen() {
  const nav = useNavigation<any>();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("Todos");
  const [produtos, setProdutos] = useState<Produto[] | null>(null);

  const load = useCallback(() => { api.listarProdutos("", cat).then(setProdutos).catch(() => setProdutos([])); }, [cat]);
  useFocusEffect(load);

  return (
    <Screen>
      <SearchBar value={q} onChange={setQ} onSubmit={() => nav.navigate("Buscar", { q })} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 16 }}>
        {CATEGORIAS.map((c) => <Chip key={c} label={c} active={c === cat} onPress={() => setCat(c)} />)}
      </ScrollView>
      <View style={s.banner}>
        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>NOVO</Text>
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700", marginTop: 4 }}>Monte a sua camisa</Text>
        <Text style={{ color: "#DBEAFE", marginTop: 2 }}>Escolha cor, modelo, nome e número.</Text>
      </View>
      <SectionTitle>{cat === "Todos" ? "Em destaque" : cat}</SectionTitle>
      {produtos === null ? <ActivityIndicator color={colors.primary} /> : produtos.length === 0 ? <Empty text="Nenhum produto." /> : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4, paddingBottom: 8 }}>
          {produtos.map((p) => <ProductCard key={p.id} produto={p} horizontal />)}
        </ScrollView>
      )}
      <SectionTitle>Personalizáveis</SectionTitle>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {(produtos ?? []).filter((p) => p.personalizavel).map((p) => (
          <View key={p.id} style={{ width: "50%" }}><ProductCard produto={p} /></View>
        ))}
      </View>
    </Screen>
  );
}

/** Tela "Resultado" (RF de pesquisa): busca por texto + filtro por categoria */
export function ResultadoScreen({ route }: any) {
  const [q, setQ] = useState<string>(route?.params?.q ?? "");
  const [cat, setCat] = useState<string>("Todos");
  const [res, setRes] = useState<Produto[] | null>(null);

  useEffect(() => {
    setRes(null);
    const t = setTimeout(() => api.listarProdutos(q, cat).then(setRes).catch(() => setRes([])), 250); // debounce
    return () => clearTimeout(t);
  }, [q, cat]);

  useEffect(() => { if (route?.params?.q !== undefined) setQ(route.params.q); }, [route?.params?.q]);

  return (
    <Screen scroll={false}>
      <SearchBar value={q} onChange={setQ} />
      <View style={{ height: 52 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          {CATEGORIAS.map((c) => <Chip key={c} label={c} active={c === cat} onPress={() => setCat(c)} />)}
        </ScrollView>
      </View>
      <Text style={[font.small, { marginVertical: 8 }]}>{res ? `${res.length} resultado(s)` : "Buscando…"}</Text>
      {res === null ? <ActivityIndicator color={colors.primary} /> : (
        <FlatList
          data={res} numColumns={2} keyExtractor={(p) => p.id}
          renderItem={({ item }) => <ProductCard produto={item} />}
          ListEmptyComponent={<Empty text="Nada encontrado. Tente outro termo." />}
          contentContainerStyle={{ paddingBottom: 24 }} columnWrapperStyle={undefined}
        />
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  search: {
    height: 48, flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: radius.md,
    paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: colors.text },
  banner: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: 20 },
});
