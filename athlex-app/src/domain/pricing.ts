import { ItemCarrinho, Personalizacao } from "../types";

/** Regras de preço do domínio (iguais às aplicadas no order-api do backend). */
export const PRECO_NOME = 10;
export const PRECO_NUMERO = 10;

export const acrescimoPersonalizacao = (nome?: string, numero?: string) =>
  (nome?.trim() ? PRECO_NOME : 0) + (numero?.trim() ? PRECO_NUMERO : 0);

export const precoComPersonalizacao = (base: number, p?: Personalizacao) => base + (p?.acrescimo ?? 0);

export const precoUnitario = (i: ItemCarrinho) => precoComPersonalizacao(i.produto.preco, i.personalizacao);

export const totalDoCarrinho = (itens: ItemCarrinho[]) =>
  itens.reduce((s, i) => s + precoUnitario(i) * i.quantidade, 0);
