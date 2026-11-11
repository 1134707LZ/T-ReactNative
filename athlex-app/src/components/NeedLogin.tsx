import React from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "./Icon";
import Screen from "./Screen";
import { Button } from "./ui";
import { colors, font } from "../theme";

/** Estado vazio reutilizável para telas que exigem login. */
export default function NeedLogin({ msg }: { msg: string }) {
  const nav = useNavigation<any>();
  return (
    <Screen>
      <View style={{ alignItems: "center", marginTop: 64 }}>
        <Icon name="user" size={48} color={colors.textLight} />
        <Text style={[font.h2, { marginTop: 16 }]}>Entre para continuar</Text>
        <Text style={[font.small, { textAlign: "center", marginVertical: 8 }]}>{msg}</Text>
        <Button title="Entrar" onPress={() => nav.navigate("Login")} style={{ alignSelf: "stretch", marginTop: 16 }} />
        <Button title="Criar conta" variant="outline" onPress={() => nav.navigate("Cadastro")} style={{ alignSelf: "stretch", marginTop: 12 }} />
      </View>
    </Screen>
  );
}
