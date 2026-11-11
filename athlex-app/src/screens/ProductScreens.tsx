import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, Switch, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Icon from "../components/Icon";
import Screen from "../components/Screen";
import ShirtPreview from "../components/ShirtPreview";
import { Button, Card, Chip, Input, SectionTitle, Swatch } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";
import NeedLogin from "../components/NeedLogin";
import Stepper from "../components/Stepper";
import { acrescimoPersonalizacao, PRECO_NOME, PRECO_NUMERO } from "../domain/pricing";
import { valido, validarItem } from "../domain/validators";
import { brl, colors, font, radius } from "../theme";
import { Categoria, Produto } from "../types";

function useProduto(id: string) {
  const [p, setP] = useState<Produto | null>(null);
  useEffect(() => { api.obterProduto(id).then(setP).catch(() => Alert.alert("Erro", "Produto não encontrado.")); }, [id]);
  return p;
}

export function DetalheScreen({ route }: any) {
  const nav = useNavigation<any>();
  const { adicionar } = useCart();
  const p = useProduto(route.params.id);
  const [tamanho, setTamanho] = useState<string>("");
  const [cor, setCor] = useState<string>("");
  const [qtd, setQtd] = useState(1);

  useEffect(() => { if (p) { setTamanho(p.tamanhos[0]); setCor(p.cores[0]); } }, [p]);
  if (!p) return <Screen back><ActivityIndicator color={colors.primary} style={{ marginTop: 64 }} /></Screen>;

  const add = () => {
    adicionar(p, { tamanho, cor, quantidade: qtd });
    Alert.alert("Adicionado", `${p.nome} foi para o carrinho.`, [
      { text: "Continuar" }, { text: "Ver carrinho", onPress: () => nav.navigate("Tabs", { screen: "Carrinho" }) },
    ]);
  };

  return (
    <Screen back footer={<Button title={`Adicionar · ${brl(p.preco * qtd)}`} onPress={add} />}>
      <View style={{ height: 220, borderRadius: radius.lg, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {p.imagem ? <Image source={{ uri: p.imagem }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
          : p.categoria === "Camisas" ? <ShirtPreview cor={cor || p.cores[0]} modelo="Gola redonda" size={190} />
          : <Icon name="tag" size={64} color={colors.primary} />}
      </View>
      <Text style={[font.h1, { marginTop: 16 }]}>{p.nome}</Text>
      <Text style={{ fontSize: 22, fontWeight: "700", color: colors.primary, marginVertical: 4 }}>{brl(p.preco)}</Text>
      <Text style={[font.body, { color: colors.textMuted, lineHeight: 20 }]}>{p.descricao}</Text>

      <SectionTitle>Tamanho</SectionTitle>
      <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: 8 }}>
        {p.tamanhos.map((t) => <Chip key={t} label={t} active={t === tamanho} onPress={() => setTamanho(t)} />)}
      </View>

      <SectionTitle>Cor</SectionTitle>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {p.cores.map((c) => <Swatch key={c} color={c} active={c === cor} onPress={() => setCor(c)} />)}
      </View>

      <SectionTitle>Quantidade</SectionTitle>
      <Stepper value={qtd} onChange={setQtd} />

      {p.personalizavel && (
        <Pressable onPress={() => nav.navigate("Personalizar", { id: p.id, tamanho, cor })} style={{ marginTop: 24 }}>
          <Card style={{ flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: colors.accent }}>
            <Icon name="tag" color={colors.accent} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontWeight: "700", color: colors.text }}>Personalizar este produto</Text>
              <Text style={font.small}>Modelo, cor, nome e número</Text>
            </View>
            <Text style={{ color: colors.primary, fontWeight: "700" }}>Personalizar ›</Text>
          </Card>
        </Pressable>
      )}
    </Screen>
  );
}

const MODELOS = ["Gola redonda", "Gola V", "Polo"];
/** Tela de Personalização de Produto (RF03) */
export function PersonalizarScreen({ route }: any) {
  const nav = useNavigation<any>();
  const { adicionar } = useCart();
  const p = useProduto(route.params.id);
  const [modelo, setModelo] = useState(MODELOS[0]);
  const [cor, setCor] = useState<string>(route.params.cor);
  const [tamanho, setTamanho] = useState<string>(route.params.tamanho);
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");

  if (!p) return <Screen back><ActivityIndicator color={colors.primary} style={{ marginTop: 64 }} /></Screen>;
  const acrescimo = acrescimoPersonalizacao(nome, numero);

  const add = () => {
    adicionar(p, { tamanho, cor, personalizacao: { modelo, cor, nome: nome || undefined, numero: numero || undefined, acrescimo } });
    nav.navigate("Tabs", { screen: "Carrinho" });
  };

  return (
    <Screen back footer={<Button title={`Adicionar ao carrinho · ${brl(p.preco + acrescimo)}`} onPress={add} />}>
      <View style={{ alignItems: "center", backgroundColor: colors.surface, borderRadius: radius.lg, paddingVertical: 12 }}>
        <ShirtPreview cor={cor} modelo={modelo} nome={nome} numero={numero} size={240} />
      </View>
      <Text style={[font.h1, { marginTop: 16 }]}>Personalizar {p.nome}</Text>

      <SectionTitle>Modelo</SectionTitle>
      <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: 8 }}>
        {MODELOS.map((m) => <Chip key={m} label={m} active={m === modelo} onPress={() => setModelo(m)} />)}
      </View>

      <SectionTitle>Cor</SectionTitle>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {p.cores.map((c) => <Swatch key={c} color={c} active={c === cor} onPress={() => setCor(c)} />)}
      </View>

      <SectionTitle>Tamanho</SectionTitle>
      <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: 8, marginBottom: 8 }}>
        {p.tamanhos.map((t) => <Chip key={t} label={t} active={t === tamanho} onPress={() => setTamanho(t)} />)}
      </View>

      <SectionTitle>Elementos personalizados</SectionTitle>
      <Input label={`Nome (+${brl(PRECO_NOME)})`} value={nome} onChangeText={(v) => setNome(v.slice(0, 12))} placeholder="Ex.: SILVA" autoCapitalize="characters" />
      <Input label={`Número (+${brl(PRECO_NUMERO)})`} value={numero} onChangeText={(v) => setNumero(v.replace(/\D/g, "").slice(0, 2))} placeholder="10" keyboardType="number-pad" />
    </Screen>
  );
}

/** Cadastro de item pelo usuário: imagem, título, descrição (+ preço/categoria) */
export function NovoItemScreen() {
  const { usuario } = useAuth();
  const nav = useNavigation<any>();
  const [imagem, setImagem] = useState<string>();
  const [f, setF] = useState({ nome: "", descricao: "", preco: "", tamanhos: "Único" });
  const [categoria, setCategoria] = useState<Categoria>("Camisas");
  const [personalizavel, setPersonalizavel] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!usuario) return <NeedLogin msg="Faça login para anunciar seus itens." />;

  const pick = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert("Permissão", "Autorize o acesso às fotos para escolher uma imagem.");
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.4, allowsEditing: true, aspect: [4, 3], base64: true });
    if (!r.canceled) {
      const a = r.assets[0];
      setImagem(a.base64 ? `data:${a.mimeType ?? "image/jpeg"};base64,${a.base64}` : a.uri);   // backend guarda data URI
    }
  };

  const submit = async () => {
    const e = validarItem(f);
    setErr(e);
    if (!valido(e)) return;
    const preco = parseFloat(f.preco.replace(",", "."));
    setLoading(true);
    try {
      await api.cadastrarProduto({
        nome: f.nome.trim(), descricao: f.descricao.trim(), preco, categoria, imagem, personalizavel,
        tamanhos: f.tamanhos.split(",").map((t) => t.trim()).filter(Boolean),
        cores: ["#0F172A", "#2563EB", "#FFFFFF"], vendedorId: usuario.id,
      });
      setF({ nome: "", descricao: "", preco: "", tamanhos: "Único" }); setImagem(undefined);
      Alert.alert("Pronto!", "Item anunciado com sucesso.", [{ text: "Ver meus itens", onPress: () => nav.navigate("MeusItens") }, { text: "OK" }]);
    } catch (x: any) { Alert.alert("Erro", x.message); } finally { setLoading(false); }
  };

  const cats: Categoria[] = ["Camisas", "Chuteiras", "Bolas", "Acessórios", "Agasalhos"];
  return (
    <Screen>
      <Text style={font.h1}>Cadastrar item</Text>
      <Pressable onPress={pick} style={{ height: 160, marginVertical: 16, borderRadius: radius.lg, borderWidth: 1.5, borderStyle: "dashed", borderColor: colors.primary, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {imagem ? <Image source={{ uri: imagem }} style={{ width: "100%", height: "100%" }} /> : (<>
          <Icon name="image" size={36} color={colors.primary} />
          <Text style={{ color: colors.primary, fontWeight: "600", marginTop: 8 }}>Adicionar imagem</Text>
        </>)}
      </Pressable>
      <Input label="Título" value={f.nome} onChangeText={(v) => setF({ ...f, nome: v })} error={err.nome} placeholder="Ex.: Chuteira Society Pro" />
      <Input label="Descrição do item" value={f.descricao} onChangeText={(v) => setF({ ...f, descricao: v })} error={err.descricao} multiline style={{ minHeight: 80 }} placeholder="Estado, material, medidas…" />
      <Input label="Preço (R$)" value={f.preco} onChangeText={(v) => setF({ ...f, preco: v })} error={err.preco} keyboardType="decimal-pad" placeholder="0,00" />
      <Input label="Tamanhos (separados por vírgula)" value={f.tamanhos} onChangeText={(v) => setF({ ...f, tamanhos: v })} placeholder="P, M, G" />
      <Text style={{ fontSize: 13, fontWeight: "600", marginBottom: 6 }}>Categoria</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: 8, marginBottom: 16 }}>
        {cats.map((c) => <Chip key={c} label={c} active={c === categoria} onPress={() => setCategoria(c)} />)}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <Text style={{ fontWeight: "600" }}>Permitir personalização</Text>
        <Switch value={personalizavel} onValueChange={setPersonalizavel} trackColor={{ true: colors.primary }} />
      </View>
      <Button title="Publicar item" onPress={submit} loading={loading} />
    </Screen>
  );
}
