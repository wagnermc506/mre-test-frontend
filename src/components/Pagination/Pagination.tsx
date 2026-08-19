import './Pagination.css'

interface PaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  isLoading: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const PAGE_SIZE_OPTIONS = [5, 10, 20]

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  isLoading,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Paginação de notícias">
      <div className="pagination__info">
        Página {page} de {totalPages} · {totalItems} notícia(s)
      </div>

      <div className="pagination__controls">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={isLoading || page <= 1}
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={isLoading || page >= totalPages}
        >
          Próxima
        </button>

        <label className="pagination__page-size">
          Itens por página
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            disabled={isLoading}
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </nav>
  )
}
