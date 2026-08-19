import axios from 'axios';

const baseURL = import.meta.env.VITE_VIACEP_URL ?? 'https://viacep.com.br/ws';

export const viaCepClient = axios.create({
  baseURL,
  timeout: 8000,
});
