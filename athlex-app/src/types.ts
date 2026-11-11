export type Categoria = "Camisas" | "Chuteiras" | "Bolas" | "Acessórios" | "Agasalhos";

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: Categoria;
  tamanhos: string[];
  cores: string[]; // hex
  imagem?: string; // uri
  personalizavel: boolean;
  vendedorId?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  tipo: "CLIENTE" | "ADMINISTRADOR";
}

export interface Personalizacao {
  modelo: string;
  cor: string;
  nome?: string;
  numero?: string;
  acrescimo: number;
}

export interface ItemCarrinho {
  key: string;
  produto: Produto;
  quantidade: number;
  tamanho: string;
  cor: string;
  personalizacao?: Personalizacao;
}

export interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  cidade: string;
  uf: string;
}

export type FormaPagamento = "CARTAO" | "PIX" | "BOLETO";

export interface Pedido {
  id: string;
  data: string;
  total: number;
  status: "AGUARDANDO_PAGAMENTO" | "EM_TRANSITO" | "ENTREGUE";
  itens: { nome: string; quantidade: number; preco: number }[];
}
