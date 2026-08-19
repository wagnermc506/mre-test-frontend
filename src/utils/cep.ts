export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidCep(cep: string): boolean {
  return /^\d{8}$/.test(onlyDigits(cep));
}

export function formatCep(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
