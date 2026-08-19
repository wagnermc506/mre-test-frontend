import { useCallback, useEffect, useState } from 'react'
import {
  listNoticias,
  createNoticia as createNoticiaRequest,
  updateNoticia as updateNoticiaRequest,
  deleteNoticia as deleteNoticiaRequest,
} from '../services/noticiaService'
import { extractErrorMessage } from '../utils/httpError'
import type { Noticia, NoticiaInput } from '../types/noticia'

type Status = 'idle' | 'loading' | 'error'

export function useNoticias(initialPageSize = 5) {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const fetchPage = useCallback(async () => {
    setStatus('loading')
    setErrorMessage(null)

    try {
      const result = await listNoticias(page, pageSize)
      setNoticias(result.items)
      setTotalItems(result.totalItems)
      setTotalPages(result.totalPages)
      setStatus('idle')
    } catch (error) {
      setStatus('error')
      setErrorMessage(extractErrorMessage(error, 'Erro ao carregar as notícias. Tente novamente.'))
    }
  }, [page, pageSize])

  useEffect(() => {
    void fetchPage()
  }, [fetchPage])

  const goToPage = useCallback(
    (nextPage: number) => {
      setPage(Math.min(Math.max(nextPage, 1), totalPages))
    },
    [totalPages],
  )

  const changePageSize = useCallback((size: number) => {
    setPage(1)
    setPageSize(size)
  }, [])

  const createNoticia = useCallback(
    async (input: NoticiaInput) => {
      await createNoticiaRequest(input)
      await fetchPage()
    },
    [fetchPage],
  )

  const updateNoticia = useCallback(
    async (id: string, input: NoticiaInput) => {
      await updateNoticiaRequest(id, input)
      await fetchPage()
    },
    [fetchPage],
  )

  const removeNoticia = useCallback(
    async (id: string) => {
      await deleteNoticiaRequest(id)
      const isLastItemOnPage = noticias.length === 1 && page > 1
      if (isLastItemOnPage) {
        setPage(page - 1)
      } else {
        await fetchPage()
      }
    },
    [fetchPage, noticias.length, page],
  )

  return {
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
  }
}