export const somenteDigitos = (v: string) => v.replace(/\D/g, "");

export function mascaraTelefone(v: string) {
  const d = somenteDigitos(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function mascaraValidade(v: string) {
  const d = somenteDigitos(v).slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}
