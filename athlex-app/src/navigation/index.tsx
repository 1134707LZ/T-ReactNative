import React from "react";
import { Text, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon, { IconName } from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { LoginScreen, RegisterScreen } from "../screens/AuthScreens";
import { HomeScreen, ResultadoScreen } from "../screens/HomeScreens";
import { DetalheScreen, NovoItemScreen, PersonalizarScreen } from "../screens/ProductScreens";
import { CarrinhoScreen, CheckoutScreen, MeusItensScreen, PedidosScreen } from "../screens/OrderScreens";
import { MenuScreen, PerfilScreen } from "../screens/MenuScreens";
import { colors } from "../theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  const { quantidade } = useCart();
  const tab = (icon: IconName, label: string) => ({
    title: label,
    tabBarIcon: ({ color }: { color: string }) => <Icon name={icon} color={color} />,
  });
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={tab("home", "Início")} />
      <Tab.Screen name="Buscar" component={ResultadoScreen} options={tab("search", "Buscar")} />
      <Tab.Screen name="Cadastrar" component={NovoItemScreen} options={tab("plus", "Cadastrar")} />
      <Tab.Screen
        name="Carrinho"
        component={CarrinhoScreen}
        options={{ ...tab("cart", "Carrinho"), tabBarBadge: quantidade || undefined, tabBarBadgeStyle: { backgroundColor: colors.accent } }}
      />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={tab("user", "Perfil")} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { usuario, carregando } = useAuth();
  if (carregando) return <View style={{ flex: 1, backgroundColor: colors.surface }} />;
  return (
    <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg, primary: colors.primary } }}>
      {/* key força remontagem ao logar/deslogar */}
      <Stack.Navigator key={usuario ? "in" : "out"} initialRouteName={usuario ? "Tabs" : "Login"} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={RegisterScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Detalhe" component={DetalheScreen} />
        <Stack.Screen name="Personalizar" component={PersonalizarScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Pedidos" component={PedidosScreen} />
        <Stack.Screen name="MeusItens" component={MeusItensScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} options={{ presentation: "transparentModal", animation: "fade" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
