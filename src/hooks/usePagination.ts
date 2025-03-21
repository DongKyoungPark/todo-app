import { useState, useMemo, useCallback } from 'react'

interface PaginationOptions<T> {
  totalItems: T[]
  initialPageSize?: number
  initialPage?: number
}

interface PaginationResult<T> {
  currentPage: number
  pageSize: number
  totalPages: number
  paginatedItems: T[]
  pageButtons: number[]
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
}

export const usePagination = <T>({
  totalItems,
  initialPageSize = 5,
  initialPage = 1,
}: PaginationOptions<T>): PaginationResult<T> => {
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize)
  const [currentPage, setCurrentPageState] = useState<number>(initialPage)

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems.length / pageSize))
  }, [totalItems.length, pageSize])

  const safeCurrentPage = useMemo(() => {
    return Math.min(Math.max(1, currentPage), totalPages)
  }, [currentPage, totalPages])

  if (safeCurrentPage !== currentPage) {
    setCurrentPageState(safeCurrentPage)
  }

  const paginatedItems = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return totalItems.slice(startIndex, endIndex)
  }, [totalItems, safeCurrentPage, pageSize])

  const pageButtons = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }, [totalPages])

  const setPageSize = useCallback((newSize: number) => {
    setPageSizeState(newSize)
    setCurrentPageState(1)
  }, [])

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPageState(Math.min(Math.max(1, page), totalPages))
    },
    [totalPages]
  )

  const goToNextPage = useCallback(() => {
    if (safeCurrentPage < totalPages) {
      setCurrentPageState(safeCurrentPage + 1)
    }
  }, [safeCurrentPage, totalPages])

  const goToPreviousPage = useCallback(() => {
    if (safeCurrentPage > 1) {
      setCurrentPageState(safeCurrentPage - 1)
    }
  }, [safeCurrentPage])

  return {
    currentPage: safeCurrentPage,
    pageSize,
    totalPages,
    paginatedItems,
    pageButtons,
    setCurrentPage: goToPage,
    setPageSize,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  }
}
