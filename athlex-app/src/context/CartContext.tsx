import React, { createContext, useContext, useMemo, useState } from "react";
import { ItemCarrinho, Personalizacao, Produto } from "../types";
import { totalDoCarrinho } from "../domain/pricing";

interface CartCtx {
  itens: ItemCarrinho[];
  quantidade: number;
  total: number;
  adicionar(p: Produto, o: { tamanho: string; cor: string; quantidade?: number; personalizacao?: Personalizacao }): void;
  alterarQuantidade(key: string, delta: number): void;
  remover(key: string): void;
  limpar(): void;
}

const Ctx = createContext<CartCtx>(null as unknown as CartCtx);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  const value = useMemo<CartCtx>(() => ({
    itens,
    quantidade: itens.reduce((s, i) => s + i.quantidade, 0),
    total: totalDoCarrinho(itens),
    adicionar: (produto, { tamanho, cor, quantidade = 1, personalizacao }) =>
      setItens((cur) => {
        const key = [produto.id, tamanho, cor, JSON.stringify(personalizacao ?? null)].join("|");
        const ex = cur.find((i) => i.key === key);
        if (ex) return cur.map((i) => (i.key === key ? { ...i, quantidade: i.quantidade + quantidade } : i));
        return [...cur, { key, produto, quantidade, tamanho, cor, personalizacao }];
      }),
    alterarQuantidade: (key, delta) =>
      setItens((cur) => cur.map((i) => (i.key === key ? { ...i, quantidade: Math.max(1, i.quantidade + delta) } : i))),
    remover: (key) => setItens((cur) => cur.filter((i) => i.key !== key)),
    limpar: () => setItens([]),
  }), [itens]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
