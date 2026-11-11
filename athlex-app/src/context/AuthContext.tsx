import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { api, setToken, setUnauthorizedHandler } from "../services/api";
import { Usuario } from "../types";

interface AuthCtx {
  usuario: Usuario | null;
  carregando: boolean;
  login(email: string, senha: string): Promise<void>;
  logout(): Promise<void>;
}

const Ctx = createContext<AuthCtx>(null as unknown as AuthCtx);
export const useAuth = () => useContext(Ctx);

const KEY = "athlex.session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  // restaura sessão (JWT) salva no armazenamento seguro
  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(KEY);
        if (raw) {
          const s = JSON.parse(raw);
          setToken(s.token);
          setUsuario(s.usuario);
        }
      } catch {}
      setCarregando(false);
    })();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => { setToken(null); setUsuario(null); SecureStore.deleteItemAsync(KEY).catch(() => {}); });
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = async (email: string, senha: string) => {
    const r = await api.login(email.trim().toLowerCase(), senha);
    setToken(r.token);
    setUsuario(r.usuario);
    await SecureStore.setItemAsync(KEY, JSON.stringify(r)).catch(() => {});
  };

  const logout = async () => {
    setToken(null);
    setUsuario(null);
    await SecureStore.deleteItemAsync(KEY).catch(() => {});
  };

  return <Ctx.Provider value={{ usuario, carregando, login, logout }}>{children}</Ctx.Provider>;
}
