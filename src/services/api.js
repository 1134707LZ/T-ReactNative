import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 15000,
});

function normalizeProduct(p) {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    category: p.category,
    description: p.description,
    image: p.images?.[0] || p.thumbnail,
    thumbnail: p.thumbnail || p.images?.[0],
  };
}

export async function getUsers() {
  const { data } = await api.get('/users', {
    params: { limit: 0, select: 'username,password' },
  });
  return data.users;
}

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  return { ...data, token: data.accessToken };
}

export async function getProducts() {
  const { data } = await api.get('/products', { params: { limit: 0 } });
  return data.products.map(normalizeProduct);
}

export async function getCategories() {
  const { data } = await api.get('/products/category-list');
  return data;
}

export async function getProductsByCategory(category) {
  const { data } = await api.get(
    `/products/category/${encodeURIComponent(category)}`,
    { params: { limit: 0 } }
  );
  return data.products.map(normalizeProduct);
}

export async function getProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return normalizeProduct(data);
}

export function formatCategory(category = '') {
  return category.replace(/-/g, ' ');
}

export function getErrorMessage(error, fallback = 'Ocorreu um erro inesperado.') {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Falha de rede. Verifique sua conexão com a internet.';
    }
    const { status } = error.response;
    if (status === 400 || status === 401) {
      return 'Usuário ou senha inválidos.';
    }
    if (status === 404) {
      return 'Recurso não encontrado.';
    }
    return `Erro do servidor (${status}). Tente novamente.`;
  }
  return fallback;
}

export default api;
