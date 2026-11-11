import { Produto } from "../types";

const CORES = ["#2563EB", "#0F172A", "#DC2626", "#16A34A", "#F59E0B", "#FFFFFF"];

export const PRODUTOS: Produto[] = [
  { id: "1", nome: "Camisa Dry-Fit Athlex", descricao: "Camisa esportiva de secagem rápida, ideal para treinos e jogos. Tecido leve e respirável.", preco: 119.9, categoria: "Camisas", tamanhos: ["P", "M", "G", "GG"], cores: CORES, personalizavel: true },
  { id: "2", nome: "Chuteira Society Pro", descricao: "Chuteira society com travas de borracha e ótima aderência em grama sintética.", preco: 299.9, categoria: "Chuteiras", tamanhos: ["38", "39", "40", "41", "42", "43"], cores: ["#0F172A", "#2563EB", "#F59E0B"], personalizavel: false },
  { id: "3", nome: "Bola de Futsal Oficial", descricao: "Bola de futsal costurada à mão, com câmara de baixo quique.", preco: 149.9, categoria: "Bolas", tamanhos: ["Único"], cores: ["#FFFFFF", "#F59E0B"], personalizavel: false },
  { id: "4", nome: "Camisa de Time Personalizada", descricao: "Monte a camisa do seu time: escolha modelo, cor, nome e número.", preco: 139.9, categoria: "Camisas", tamanhos: ["P", "M", "G", "GG"], cores: CORES, personalizavel: true },
  { id: "5", nome: "Jaqueta Corta-Vento", descricao: "Jaqueta leve, impermeável, com bolsos com zíper e capuz ajustável.", preco: 219.9, categoria: "Agasalhos", tamanhos: ["P", "M", "G", "GG"], cores: ["#0F172A", "#2563EB", "#16A34A"], personalizavel: true },
  { id: "6", nome: "Mochila Esportiva 30L", descricao: "Mochila com compartimento para chuteira e bolso térmico.", preco: 129.9, categoria: "Acessórios", tamanhos: ["Único"], cores: ["#0F172A", "#DC2626"], personalizavel: false },
  { id: "7", nome: "Meião Antiderrapante", descricao: "Meião com sola antiderrapante e compressão leve.", preco: 39.9, categoria: "Acessórios", tamanhos: ["P", "M", "G"], cores: CORES, personalizavel: false },
  { id: "8", nome: "Calção Treino Flex", descricao: "Calção elástico com bolso lateral, perfeito para treinos intensos.", preco: 79.9, categoria: "Camisas", tamanhos: ["P", "M", "G", "GG"], cores: ["#0F172A", "#2563EB", "#DC2626"], personalizavel: false },
];

export const CATEGORIAS = ["Todos", "Camisas", "Chuteiras", "Bolas", "Acessórios", "Agasalhos"] as const;
