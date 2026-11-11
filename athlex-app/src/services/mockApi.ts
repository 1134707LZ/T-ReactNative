import { PRODUTOS } from "../data/mock";
import { Pedido, Produto, Usuario } from "../types";
import { precoComPersonalizacao } from "../domain/pricing";
import { ApiClient, ApiError } from "./types";

/** Implementação em memória (desenvolvimento/demonstração sem backend). */
const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms));

const users: (Usuario & { senha: string })[] = [
  { id: "u1", nome: "Cliente Demo", email: "demo@athlex.com", telefone: "(51) 99999-0000", senha: "123456", tipo: "CLIENTE" },
];
const produtos: Produto[] = [...PRODUTOS];
const pedidos: Pedido[] = [];

export const mockApi: ApiClient = {
  async register(d) {
    await wait();
    if (users.some((u) => u.email === d.email)) throw new ApiError(409, "E-mail já cadastrado.");
    users.push({ id: "u" + (users.length + 1), tipo: "CLIENTE", ...d });
  },

  async login(email, senha) {
    await wait();
    const u = users.find((x) => x.email === email && x.senha === senha);
    if (!u) throw new ApiError(401, "E-mail ou senha inválidos.");
    const { senha: _s, ...usuario } = u;
    return { token: "mock-jwt." + u.id, usuario };
  },

  async listarProdutos(busca = "", categoria = "Todos") {
    await wait(200);
    const b = busca.trim().toLowerCase();
    return produtos.filter(
      (p) => (categoria === "Todos" || p.categoria === categoria) &&
        (!b || p.nome.toLowerCase().includes(b) || p.descricao.toLowerCase().includes(b))
    );
  },

  async obterProduto(id) {
    await wait(150);
    const p = produtos.find((x) => x.id === id);
    if (!p) throw new ApiError(404, "Produto não encontrado.");
    return p;
  },

  async cadastrarProduto(p) {
    await wait();
    const novo = { ...p, id: String(Date.now()) };
    produtos.unshift(novo);
    return novo;
  },

  async meusProdutos(usuarioId) {
    await wait(200);
    return produtos.filter((p) => p.vendedorId === usuarioId);
  },

  async criarPedido(d) {
    await wait(700);
    const ped: Pedido = {
      id: "PED-" + String(pedidos.length + 1001),
      data: new Date().toISOString(),
      total: d.total,
      status: d.pagamento === "CARTAO" ? "EM_TRANSITO" : "AGUARDANDO_PAGAMENTO",
      itens: d.itens.map((i) => ({ nome: i.produto.nome, quantidade: i.quantidade, preco: precoComPersonalizacao(i.produto.preco, i.personalizacao) })),
    };
    pedidos.unshift(ped);
    return ped;
  },

  async listarPedidos() {
    await wait(200);
    return pedidos;
  },
};
