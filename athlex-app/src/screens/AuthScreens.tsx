import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Logo from "../components/Logo";
import { Button, Input } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { mascaraTelefone } from "../domain/masks";
import { valido, validarCadastro, validarLogin } from "../domain/validators";
import { colors, font } from "../theme";

function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={s.c} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: "center", marginBottom: 32 }}><Logo height={34} /></View>
          <Text style={font.h1}>{title}</Text>
          <Text style={[font.small, { marginBottom: 24, marginTop: 4 }]}>{subtitle}</Text>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function LoginScreen() {
  const nav = useNavigation<any>();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [err, setErr] = useState<{ email?: string; senha?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const e = validarLogin({ email, senha });
    setErr(e);
    if (!valido(e)) return;
    setLoading(true);
    try {
      await login(email, senha);
    } catch (x: any) {
      Alert.alert("Não foi possível entrar", x.message);
    } finally { setLoading(false); }
  };

  return (
    <Shell title="Entrar" subtitle="Acesse sua conta para comprar e anunciar.">
      <Input label="E-mail" value={email} onChangeText={setEmail} error={err.email} autoCapitalize="none" keyboardType="email-address" placeholder="voce@email.com" />
      <Input label="Senha" value={senha} onChangeText={setSenha} error={err.senha} secureTextEntry placeholder="••••••" />
      <Button title="Entrar" onPress={submit} loading={loading} />
      <Button title="Criar conta" variant="outline" onPress={() => nav.navigate("Cadastro")} style={{ marginTop: 12 }} />
      <Pressable onPress={() => nav.navigate("Tabs")} style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ color: colors.primary, fontWeight: "600" }}>Continuar como visitante</Text>
      </Pressable>
      <Text style={[font.small, { textAlign: "center", marginTop: 24 }]}>Demo: demo@athlex.com / 123456</Text>
    </Shell>
  );
}

export function RegisterScreen() {
  const nav = useNavigation<any>();
  const { login } = useAuth();
  const [f, setF] = useState({ nome: "", email: "", telefone: "", senha: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    const e = validarCadastro(f);
    setErr(e);
    if (!valido(e)) return;
    setLoading(true);
    try {
      await api.register({ ...f, email: f.email.trim().toLowerCase() });
      await login(f.email, f.senha); // login automático -> JWT
    } catch (x: any) {
      Alert.alert("Não foi possível cadastrar", x.message);
    } finally { setLoading(false); }
  };

  return (
    <Shell title="Criar conta" subtitle="Leva menos de um minuto.">
      <Input label="Nome" value={f.nome} onChangeText={set("nome")} error={err.nome} placeholder="Seu nome completo" />
      <Input label="E-mail" value={f.email} onChangeText={set("email")} error={err.email} autoCapitalize="none" keyboardType="email-address" placeholder="voce@email.com" />
      <Input label="Telefone" value={f.telefone} onChangeText={(v) => set("telefone")(mascaraTelefone(v))} error={err.telefone} keyboardType="phone-pad" placeholder="(51) 99999-0000" />
      <Input label="Senha" value={f.senha} onChangeText={set("senha")} error={err.senha} secureTextEntry placeholder="Mínimo 6 caracteres" />
      <Button title="Cadastrar" onPress={submit} loading={loading} />
      <Pressable onPress={() => nav.goBack()} style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ color: colors.primary, fontWeight: "600" }}>Já tenho conta</Text>
      </Pressable>
    </Shell>
  );
}

const s = StyleSheet.create({ c: { padding: 24, paddingTop: 32 } });
