import axios from 'axios';

const baseURL =
  import.meta.env.VITE_NOTICIAS_API_URL ?? 'http://localhost:3000';

export const noticiaClient = axios.create({
  baseURL,
  timeout: 8000,
});
