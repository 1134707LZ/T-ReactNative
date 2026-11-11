import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon, { IconName } from "../components/Icon";
import Logo from "../components/Logo";
import Screen from "../components/Screen";
import { Button, Card } from "../components/ui";
import NeedLogin from "../components/NeedLogin";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { colors, font } from "../theme";

/** Menu lateral (drawer) apresentado como modal transparente */
export function MenuScreen() {
  const nav = useNavigation<any>();
  const { usuario, logout } = useAuth();
  const { quantidade } = useCart();
  const go = (name: string, params?: object) => { nav.goBack(); setTimeout(() => nav.navigate(name, params), 0); };

  const Item = ({ icon, label, onPress, badge }: { icon: IconName; label: string; onPress(): void; badge?: number }) => (
    <Pressable onPress={onPress} style={s.item}>
      <Icon name={icon} color={colors.text} />
      <Text style={s.itemText}>{label}</Text>
      {badge ? <View style={s.badge}><Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{badge}</Text></View> : null}
    </Pressable>
  );

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <SafeAreaView style={s.panel}>
        <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}><Logo height={24} /></View>
        <View style={s.user}>
          <View style={s.avatar}><Icon name="user" color={colors.primary} /></View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontWeight: "700", color: colors.text }}>{usuario?.nome ?? "Visitante"}</Text>
            <Text style={font.small}>{usuario?.email ?? "Entre para comprar e anunciar"}</Text>
          </View>
        </View>
        <Item icon="home" label="Início" onPress={() => go("Tabs", { screen: "Home" })} />
        <Item icon="user" label="Meu perfil" onPress={() => go("Tabs", { screen: "Perfil" })} />
        <Item icon="tag" label="Itens anunciados" onPress={() => go("MeusItens")} />
        <Item icon="plus" label="Anunciar item" onPress={() => go("Tabs", { screen: "Cadastrar" })} />
        <Item icon="truck" label="Pedidos" onPress={() => go("Pedidos")} />
        <Item icon="cart" label="Carrinho" badge={quantidade} onPress={() => go("Tabs", { screen: "Carrinho" })} />
        <View style={{ flex: 1 }} />
        <View style={{ padding: 20 }}>
          {usuario ? (
            <Button title="Sair" variant="outline" onPress={async () => { await logout(); nav.goBack(); }} />
          ) : (
            <Button title="Entrar" onPress={() => go("Login")} />
          )}
        </View>
      </SafeAreaView>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(15,23,42,0.45)" }} onPress={() => nav.goBack()} accessibilityLabel="Fechar menu" />
    </View>
  );
}

export function PerfilScreen() {
  const nav = useNavigation<any>();
  const { usuario, logout } = useAuth();
  if (!usuario) return <NeedLogin msg="Entre para ver seu perfil." />;
  return (
    <Screen>
      <View style={{ alignItems: "center", marginVertical: 16 }}>
        <View style={[s.avatar, { width: 72, height: 72, borderRadius: 36 }]}><Icon name="user" size={36} color={colors.primary} /></View>
        <Text style={[font.h1, { marginTop: 12 }]}>{usuario.nome}</Text>
        <Text style={font.small}>{usuario.email}</Text>
        {usuario.telefone ? <Text style={font.small}>{usuario.telefone}</Text> : null}
      </View>
      <Card>
        <Row icon="tag" label="Itens anunciados" onPress={() => nav.navigate("MeusItens")} />
        <Row icon="truck" label="Pedidos" onPress={() => nav.navigate("Pedidos")} />
        <Row icon="box" label="Anunciar novo item" onPress={() => nav.navigate("Cadastrar")} />
      </Card>
      <Button title="Sair" variant="outline" onPress={logout} style={{ marginTop: 24 }} />
    </Screen>
  );
}

function Row({ icon, label, onPress }: { icon: IconName; label: string; onPress(): void }) {
  return (
    <Pressable onPress={onPress} style={[s.item, { paddingHorizontal: 0 }]}>
      <Icon name={icon} color={colors.text} /><Text style={s.itemText}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  panel: { width: "78%", backgroundColor: colors.surface },
  user: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, marginBottom: 8, backgroundColor: colors.bg },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  item: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, height: 52 },
  itemText: { marginLeft: 16, fontSize: 15, fontWeight: "500", color: colors.text, flex: 1 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", paddingHorizontal: 5 },
});
