# Athlex App (React Native + Expo)

Marketplace de material esportivo e peças personalizáveis. Implementa as 10 telas do protótipo Figma.

## Rodar
```bash
npm install
npx expo start        # abrir no Expo Go (Android/iOS) ou emulador
```
Login demo (mock): `demo@athlex.com` / `123456`

## Telas → Requisitos
| Tela | Arquivo | RF |
|---|---|---|
| Login / Criar conta | `screens/AuthScreens.tsx` | RF01 |
| Home / Resultado (busca) | `screens/HomeScreens.tsx` | RF02 |
| Detalhe do item | `screens/ProductScreens.tsx` | RF02 |
| Personalização | `screens/ProductScreens.tsx` | RF03 |
| Cadastro de item | `screens/ProductScreens.tsx` | – |
| Carrinho | `screens/OrderScreens.tsx` | RF04 |
| Checkout / Pedidos | `screens/OrderScreens.tsx` | RF05 |
| Menu (drawer) / Perfil | `screens/MenuScreens.tsx` | – |

## Integração com o backend
Backend em `athlex-backend/` (gateway + auth + product + order). Por padrão o app usa **mock**; para o backend real:
```bash
cp .env.example .env     # EXPO_PUBLIC_USE_MOCK=false ; EXPO_PUBLIC_API_URL=http://<ip-da-máquina>:8080
```
O contrato de produtos/pedidos é idêntico ao dos DTOs do backend (ver `athlex-backend/README.md`). 401 com sessão ativa desloga automaticamente.

## Estrutura
```
src/theme.ts          tokens (cores, grid 8px)
src/components/       Logo (SVG), Icon, Navbar, ui (Button/Input/Chip…), ShirtPreview
src/context/          AuthContext (JWT), CartContext
src/services/api.ts   cliente HTTP + mock
src/navigation/       Stack + Bottom Tabs + Menu (modal)
```
