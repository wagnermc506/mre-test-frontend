import { useState } from 'react'
import { useNoticias } from '../../hooks/useNoticias'
import { NoticiaForm } from './NoticiaForm'
import { NoticiaList } from './NoticiaList'
import { Pagination } from '../Pagination/Pagination'
import type { Noticia } from '../../types/noticia'
import './Noticias.css'

export function NoticiaPage() {
  const {
    noticias,
    status,
    errorMessage,
    page,
    pageSize,
    totalPages,
    totalItems,
    goToPage,
    changePageSize,
    createNoticia,
    updateNoticia,
    removeNoticia,
  } = useNoticias()

  const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null)

  async function handleDelete(noticia: Noticia) {
    const confirmed = window.confirm(`Excluir a notícia "${noticia.titulo}"?`)
    if (!confirmed) return

    await removeNoticia(noticia.id)
    if (editingNoticia?.id === noticia.id) {
      setEditingNoticia(null)
    }
  }

  return (
    <section className="noticia-page">
      <h1>Notícias</h1>

      <NoticiaForm
        editingNoticia={editingNoticia}
        onCreate={createNoticia}
        onUpdate={async (id, input) => {
          await updateNoticia(id, input)
          setEditingNoticia(null)
        }}
        onCancelEdit={() => setEditingNoticia(null)}
      />

      {status === 'error' && errorMessage && (
        <p className="noticia-page__error" role="alert">
          {errorMessage}
        </p>
      )}

      <NoticiaList
        noticias={noticias}
        isLoading={status === 'loading'}
        onEdit={setEditingNoticia}
        onDelete={handleDelete}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        isLoading={status === 'loading'}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
      />
    </section>
  )
}