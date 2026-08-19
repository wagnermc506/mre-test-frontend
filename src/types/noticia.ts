export interface Noticia {
  id: string;
  titulo: string;
  descricao: string;
}

export type NoticiaInput = Pick<Noticia, 'titulo' | 'descricao'>;
