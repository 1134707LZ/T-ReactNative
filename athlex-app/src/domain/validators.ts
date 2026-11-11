import { Endereco } from "../types";
import { somenteDigitos } from "./masks";

/** Cada validador é uma função pura: recebe dados e devolve { campo: mensagem } (vazio = válido). */
export type Erros = Record<string, string>;
export const valido = (e: Erros) => Object.keys(e).length === 0;

export const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function validarLogin(f: { email: string; senha: string }): Erros {
  const e: Erros = {};
  if (!emailValido(f.email)) e.email = "E-mail inválido";
  if (f.senha.length < 6) e.senha = "Mínimo de 6 caracteres";
  return e;
}

export function validarCadastro(f: { nome: string; email: string; telefone: string; senha: string }): Erros {
  const e: Erros = {};
  if (f.nome.trim().length < 3) e.nome = "Informe seu nome";
  if (!emailValido(f.email)) e.email = "E-mail inválido";
  if (somenteDigitos(f.telefone).length < 10) e.telefone = "Telefone inválido";
  if (f.senha.length < 6) e.senha = "Mínimo de 6 caracteres";
  return e;
}

export function validarEndereco(end: Endereco): Erros {
  const e: Erros = {};
  if (somenteDigitos(end.cep).length !== 8) e.cep = "CEP inválido";
  if (!end.rua.trim()) e.rua = "Obrigatório";
  if (!end.numero.trim()) e.numero = "Obrigatório";
  if (!end.cidade.trim()) e.cidade = "Obrigatório";
  if (end.uf.trim().length !== 2) e.uf = "UF";
  return e;
}

export function validarCartao(c: { numero: string; validade: string; cvv: string }): Erros {
  const e: Erros = {};
  if (somenteDigitos(c.numero).length < 13) e.cnum = "Número inválido";
  if (!/^\d{2}\/\d{2}$/.test(c.validade)) e.cval = "MM/AA";
  if (c.cvv.length < 3) e.ccvv = "CVV";
  return e;
}

export function validarItem(f: { nome: string; descricao: string; preco: string }): Erros {
  const e: Erros = {};
  if (f.nome.trim().length < 3) e.nome = "Informe o título";
  if (f.descricao.trim().length < 10) e.descricao = "Descreva o item (mín. 10 caracteres)";
  if (!(parseFloat(f.preco.replace(",", ".")) > 0)) e.preco = "Preço inválido";
  return e;
}
