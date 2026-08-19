import { noticiaClient } from './noticiaHttpClient';
import type { Noticia, NoticiaInput } from '../types/noticia';

interface NoticiasResponse {
  data: Noticia[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedNoticias {
  items: Noticia[];
  totalItems: number;
  totalPages: number;
}

export async function listNoticias(
  page: number,
  pageSize: number,
): Promise<PaginatedNoticias> {
  const response = await noticiaClient.get<NoticiasResponse>('/noticias', {
    params: { page, limit: pageSize },
  });

  return {
    items: response.data.data,
    totalItems: response.data.meta.total,
    totalPages: response.data.meta.totalPages,
  };
}

export async function createNoticia(input: NoticiaInput): Promise<Noticia> {
  const response = await noticiaClient.post<Noticia>('/noticias', input);
  return response.data;
}

export async function updateNoticia(
  id: string,
  input: NoticiaInput,
): Promise<Noticia> {
  const response = await noticiaClient.patch<Noticia>(`/noticias/${id}`, input);
  return response.data;
}

export async function deleteNoticia(id: string): Promise<void> {
  await noticiaClient.delete(`/noticias/${id}`);
}
