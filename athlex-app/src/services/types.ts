import { Endereco, FormaPagamento, ItemCarrinho, Pedido, Produto, Usuario } from "../types";

export interface AuthResult { token: string; usuario: Usuario }

export interface NovoCadastro { nome: string; email: string; telefone: string; senha: string }

export interface NovoPedido { itens: ItemCarrinho[]; endereco: Endereco; pagamento: FormaPagamento; total: number }

/**
 * Contrato da camada de dados. Telas e contextos dependem APENAS desta interface
 * (Dependency Inversion): quem fala com a rede (HttpApi) ou com dados locais (MockApi)
 * é decidido em um único lugar (services/api.ts).
 */
export interface ApiClient {
  register(d: NovoCadastro): Promise<void>;
  login(email: string, senha: string): Promise<AuthResult>;
  listarProdutos(busca?: string, categoria?: string): Promise<Produto[]>;
  obterProduto(id: string): Promise<Produto>;
  cadastrarProduto(p: Omit<Produto, "id">): Promise<Produto>;
  meusProdutos(usuarioId: string): Promise<Produto[]>;
  criarPedido(d: NovoPedido): Promise<Pedido>;
  listarPedidos(): Promise<Pedido[]>;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
