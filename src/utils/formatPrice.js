export function formatPrice(value) {
  const number = Number(value) || 0;
  const [integer, decimal] = number.toFixed(2).split('.');
  const integerWithDots = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${integerWithDots},${decimal}`;
}
