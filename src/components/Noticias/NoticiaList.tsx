import type { Noticia } from '../../types/noticia'
import './Noticias.css'

interface NoticiaListProps {
  noticias: Noticia[]
  isLoading: boolean
  onEdit: (noticia: Noticia) => void
  onDelete: (noticia: Noticia) => void
}

export function NoticiaList({ noticias, isLoading, onEdit, onDelete }: NoticiaListProps) {
  if (isLoading) {
    return <p className="noticia-list__status">Carregando notícias...</p>
  }

  if (noticias.length === 0) {
    return <p className="noticia-list__status">Nenhuma notícia cadastrada.</p>
  }

  return (
    <ul className="noticia-list">
      {noticias.map((noticia) => (
        <li key={noticia.id} className="noticia-list__item">
          <div>
            <h3>{noticia.titulo}</h3>
            <p>{noticia.descricao}</p>
          </div>
          <div className="noticia-list__actions">
            <button type="button" onClick={() => onEdit(noticia)}>
              Editar
            </button>
            <button type="button" className="danger" onClick={() => onDelete(noticia)}>
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}