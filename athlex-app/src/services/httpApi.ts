import { decodeJwt, http } from "./http";
import { ApiClient, AuthResult } from "./types";

/** Implementação real: fala com o API Gateway (JWT validado lá; autorização nos microservices). */
export const httpApi: ApiClient = {
  register: (d) =>
    http("/auth/signup", { method: "POST", body: JSON.stringify({ name: d.nome, email: d.email, phone: d.telefone, password: d.senha }) }),

  async login(email, senha): Promise<AuthResult> {
    const r: any = await http("/auth/signin", { method: "POST", body: JSON.stringify({ email, password: senha }) });
    const jwt: string = r.token ?? r.jwt;
    const c = decodeJwt(jwt);
    const u = r.user ?? r.usuario ?? {};
    return {
      token: jwt,
      usuario: {
        id: String(u.id ?? c.id), nome: u.name ?? u.nome ?? c.name ?? email, email: u.email ?? c.email ?? email,
        tipo: (u.type ?? c.type) === 0 ? "ADMINISTRADOR" : "CLIENTE",
      },
    };
  },

  listarProdutos(busca = "", categoria = "Todos") {
    const q = new URLSearchParams({ busca, ...(categoria !== "Todos" ? { categoria } : {}) });
    return http(`/products?${q}`);
  },
  obterProduto: (id) => http(`/products/${id}`),
  cadastrarProduto: (p) => http("/ws/products", { method: "POST", body: JSON.stringify(p) }),
  meusProdutos: () => http("/ws/products/mine"),

  criarPedido: (d) =>
    http("/ws/orders", {
      method: "POST",
      body: JSON.stringify({
        endereco: d.endereco,
        pagamento: d.pagamento,
        itens: d.itens.map((i) => ({
          produtoId: i.produto.id, quantidade: i.quantidade, tamanho: i.tamanho, cor: i.cor, personalizacao: i.personalizacao,
        })),
      }),
    }),
  listarPedidos: () => http("/ws/orders"),
};
