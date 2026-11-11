import { ApiError } from "./types";

/** Infra de rede: base URL, token JWT e tratamento padronizado de erros HTTP. */
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:8080";

let token: string | null = null;
export const setToken = (t: string | null) => { token = t; };

// chamado quando o gateway responde 401 com sessão ativa (JWT expirado/inválido)
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: (() => void) | null) => { onUnauthorized = fn; };

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE_URL + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = (await res.json()).message ?? msg; } catch {}
    if (res.status === 401) {
      if (token && onUnauthorized) onUnauthorized();
      msg = token ? "Sessão expirada. Entre novamente." : msg || "Credenciais inválidas.";
    }
    if (res.status === 403) msg = "Você não tem permissão para esta operação.";
    throw new ApiError(res.status, msg);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export function decodeJwt(t: string): any {
  try {
    const b = t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(b))));
  } catch { return {}; }
}
