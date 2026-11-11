import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "../components/Icon";
import Screen from "../components/Screen";
import ProductCard from "../components/ProductCard";
import { Button, Card, Chip, Empty, Input, SectionTitle } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { precoUnitario } from "../domain/pricing";
import { mascaraValidade, somenteDigitos } from "../domain/masks";
import { valido, validarCartao, validarEndereco } from "../domain/validators";
import NeedLogin from "../components/NeedLogin";
import Stepper from "../components/Stepper";
import { api } from "../services/api";
import { brl, colors, font, radius } from "../theme";
import { Endereco, FormaPagamento, Pedido, Produto } from "../types";

export function CarrinhoScreen() {
  const nav = useNavigation<any>();
  const { itens, total, alterarQuantidade, remover } = useCart();
  const { usuario } = useAuth();

  if (itens.length === 0)
    return (
      <Screen>
        <View style={{ alignItems: "center", marginTop: 64 }}>
          <Icon name="cart" size={48} color={colors.textLight} />
          <Text style={[font.h2, { marginTop: 16 }]}>Seu carrinho está vazio</Text>
          <Button title="Explorar produtos" onPress={() => nav.navigate("Tabs", { screen: "Home" })} style={{ marginTop: 24, alignSelf: "stretch" }} />
        </View>
      </Screen>
    );

  return (
    <Screen
      footer={
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={font.h2}>Total</Text>
            <Text style={[font.h2, { color: colors.primary }]}>{brl(total)}</Text>
          </View>
          <Button title="Finalizar compra" onPress={() => nav.navigate(usuario ? "Checkout" : "Login")} />
        </View>
      }
    >
      <Text style={[font.h1, { marginBottom: 12 }]}>Carrinho</Text>
      {itens.map((i) => (
        <Card key={i.key} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: 56, height: 56, borderRadius: radius.md, backgroundColor: i.cor, borderWidth: 1, borderColor: colors.border }} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontWeight: "700", color: colors.text }} numberOfLines={2}>{i.produto.nome}</Text>
              <Text style={font.small}>
                Tam. {i.tamanho}{i.personalizacao ? ` · ${i.personalizacao.modelo}` : ""}
                {i.personalizacao?.nome ? ` · ${i.personalizacao.nome}` : ""}{i.personalizacao?.numero ? ` #${i.personalizacao.numero}` : ""}
              </Text>
              <Text style={{ color: colors.primary, fontWeight: "700", marginTop: 4 }}>{brl(precoUnitario(i))}</Text>
            </View>
            <Pressable hitSlop={12} onPress={() => remover(i.key)} accessibilityLabel="Remover"><Icon name="trash" size={20} color={colors.danger} /></Pressable>
          </View>
          <View style={{ marginTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Stepper value={i.quantidade} onChange={(v) => alterarQuantidade(i.key, v - i.quantidade)} />
            <Text style={{ fontWeight: "700" }}>{brl(precoUnitario(i) * i.quantidade)}</Text>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const PAGAMENTOS: { k: FormaPagamento; l: string }[] = [
  { k: "CARTAO", l: "Cartão" }, { k: "PIX", l: "Pix" }, { k: "BOLETO", l: "Boleto" },
];

export function CheckoutScreen() {
  const nav = useNavigation<any>();
  const { usuario } = useAuth();
  const { itens, total, limpar } = useCart();
  const [end, setEnd] = useState<Endereco>({ cep: "", rua: "", numero: "", cidade: "", uf: "" });
  const [pag, setPag] = useState<FormaPagamento>("PIX");
  const [card, setCard] = useState({ numero: "", validade: "", cvv: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!usuario) return <NeedLogin msg="Faça login para finalizar a compra." />;

  const submit = async () => {
    const e = { ...validarEndereco(end), ...(pag === "CARTAO" ? validarCartao(card) : {}) };
    setErr(e);
    if (!valido(e)) return;
    setLoading(true);
    try {
      // dados do cartão NÃO são enviados ao backend; em produção use tokenização do provedor de pagamento
      const ped = await api.criarPedido({ itens, endereco: end, pagamento: pag, total });
      limpar();
      Alert.alert("Pedido confirmado!", `Pedido ${ped.id} · ${brl(ped.total)}`, [
        { text: "Ver pedidos", onPress: () => nav.reset({ index: 1, routes: [{ name: "Tabs" }, { name: "Pedidos" }] }) },
        { text: "Início", onPress: () => nav.reset({ index: 0, routes: [{ name: "Tabs" }] }) },
      ]);
    } catch (x: any) { Alert.alert("Erro ao finalizar", x.message); } finally { setLoading(false); }
  };

  const e = (k: keyof Endereco) => (v: string) => setEnd((p) => ({ ...p, [k]: v }));
  return (
    <Screen back footer={<Button title={`Confirmar pedido · ${brl(total)}`} onPress={submit} loading={loading} />}>
      <Text style={font.h1}>Checkout</Text>
      <SectionTitle>Endereço de entrega</SectionTitle>
      <Input label="CEP" value={end.cep} onChangeText={(v) => e("cep")(somenteDigitos(v).slice(0, 8))} error={err.cep} keyboardType="number-pad" placeholder="00000000" />
      <Input label="Rua" value={end.rua} onChangeText={e("rua")} error={err.rua} />
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Input label="Número" value={end.numero} onChangeText={e("numero")} error={err.numero} style={{ flex: 1 }} />
        <Input label="UF" value={end.uf} onChangeText={(v) => e("uf")(v.toUpperCase().slice(0, 2))} error={err.uf} autoCapitalize="characters" style={{ width: 80 }} />
      </View>
      <Input label="Cidade" value={end.cidade} onChangeText={e("cidade")} error={err.cidade} />

      <SectionTitle>Pagamento</SectionTitle>
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        {PAGAMENTOS.map((p) => <Chip key={p.k} label={p.l} active={p.k === pag} onPress={() => setPag(p.k)} />)}
      </View>
      {pag === "CARTAO" && (<>
        <Input label="Número do cartão" value={card.numero} onChangeText={(v) => setCard({ ...card, numero: v.replace(/\D/g, "").slice(0, 16) })} error={err.cnum} keyboardType="number-pad" />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Input label="Validade" value={card.validade} onChangeText={(v) => setCard({ ...card, validade: mascaraValidade(v) })} error={err.cval} keyboardType="number-pad" placeholder="MM/AA" style={{ flex: 1 }} />
          <Input label="CVV" value={card.cvv} onChangeText={(v) => setCard({ ...card, cvv: v.replace(/\D/g, "").slice(0, 4) })} error={err.ccvv} keyboardType="number-pad" secureTextEntry style={{ flex: 1 }} />
        </View>
      </>)}
      {pag === "PIX" && <Text style={font.small}>O código Pix será gerado após a confirmação do pedido.</Text>}
      {pag === "BOLETO" && <Text style={font.small}>O boleto será gerado após a confirmação (vence em 3 dias).</Text>}

      <SectionTitle>Resumo</SectionTitle>
      <Card>
        {itens.map((i) => (
          <View key={i.key} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
            <Text style={{ flex: 1 }} numberOfLines={1}>{i.quantidade}× {i.produto.nome}</Text>
            <Text>{brl(precoUnitario(i) * i.quantidade)}</Text>
          </View>
        ))}
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "700" }}>Total</Text><Text style={{ fontWeight: "700", color: colors.primary }}>{brl(total)}</Text>
        </View>
      </Card>
    </Screen>
  );
}

const STATUS: Record<Pedido["status"], string> = {
  AGUARDANDO_PAGAMENTO: "Aguardando pagamento", EM_TRANSITO: "Em transporte", ENTREGUE: "Entregue",
};

export function PedidosScreen() {
  const { usuario } = useAuth();
  const [list, setList] = useState<Pedido[] | null>(null);
  useEffect(() => { if (usuario) api.listarPedidos().then(setList).catch(() => setList([])); }, [usuario]);
  if (!usuario) return <NeedLogin msg="Faça login para ver seus pedidos." />;
  return (
    <Screen back>
      <Text style={[font.h1, { marginBottom: 12 }]}>Meus pedidos</Text>
      {list === null ? <ActivityIndicator color={colors.primary} /> : list.length === 0 ? <Empty text="Você ainda não fez pedidos." /> : list.map((p) => (
        <Card key={p.id} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontWeight: "700" }}>{p.id}</Text>
            <Text style={{ color: p.status === "ENTREGUE" ? colors.success : colors.accent, fontWeight: "600" }}>{STATUS[p.status]}</Text>
          </View>
          {p.itens.map((i, k) => <Text key={k} style={font.small}>{i.quantidade}× {i.nome}</Text>)}
          <Text style={{ fontWeight: "700", color: colors.primary, marginTop: 6 }}>{brl(p.total)}</Text>
        </Card>
      ))}
    </Screen>
  );
}

export function MeusItensScreen() {
  const { usuario } = useAuth();
  const [list, setList] = useState<Produto[] | null>(null);
  useEffect(() => { if (usuario) api.meusProdutos(usuario.id).then(setList).catch(() => setList([])); }, [usuario]);
  if (!usuario) return <NeedLogin msg="Faça login para ver seus anúncios." />;
  return (
    <Screen back>
      <Text style={[font.h1, { marginBottom: 12 }]}>Itens anunciados</Text>
      {list === null ? <ActivityIndicator color={colors.primary} /> : list.length === 0 ? <Empty text="Você ainda não anunciou itens." /> : (
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {list.map((p) => <View key={p.id} style={{ width: "50%" }}><ProductCard produto={p} /></View>)}
        </View>
      )}
    </Screen>
  );
}
