import { useState, useMemo } from 'react'
import { MOCK_STORES, type StoreFull } from '../data/storesMock'

export interface StoreFilters {
  name: string
  category: string
  region: string
  city: string
}

const INITIAL_FILTERS: StoreFilters = {
  name: '',
  category: '',
  region: '',
  city: '',
}

export function useStoreSearch() {
  const [filters, setFilters] = useState<StoreFilters>(INITIAL_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(10)

  function setFilter(key: keyof StoreFilters, value: string) {
    setFilters(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'region') next.city = ''
      return next
    })
    setCurrentPage(1)
  }

  function setPage(page: number) {
    setCurrentPage(page)
  }

  function setPageSize(size: number) {
    setPageSizeState(size)
    setCurrentPage(1)
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS)
    setCurrentPage(1)
  }

  const filteredStores = useMemo(() => {
    let result: StoreFull[] = [...MOCK_STORES]

    if (filters.name.trim()) {
      const term = filters.name.trim().toLowerCase()
      result = result.filter(s => s.name.toLowerCase().includes(term))
    }
    if (filters.category) {
      result = result.filter(s => s.category === filters.category)
    }
    if (filters.region) {
      result = result.filter(s => s.region === filters.region)
    }
    if (filters.city) {
      result = result.filter(s => s.city === filters.city)
    }

    return result
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filteredStores.length / pageSize))

  const paginatedStores = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredStores.slice(start, start + pageSize)
  }, [filteredStores, currentPage, pageSize])

  const activeFilterCount = useMemo(() => {
    return (['category', 'region', 'city'] as const)
      .filter(k => filters[k] !== '').length
  }, [filters])

  const availableCategories = useMemo(() =>
    [...new Set(MOCK_STORES.map(s => s.category))].sort(), [])

  const availableRegions = useMemo(() =>
    [...new Set(MOCK_STORES.map(s => s.region))].sort(), [])

  const availableCities = useMemo(() => {
    const source = filters.region
      ? MOCK_STORES.filter(s => s.region === filters.region)
      : MOCK_STORES
    return [...new Set(source.map(s => s.city))].sort()
  }, [filters.region])

  return {
    filters,
    setFilter,
    filteredStores,
    paginatedStores,
    totalPages,
    currentPage,
    pageSize,
    setPage,
    setPageSize,
    activeFilterCount,
    clearFilters,
    availableCategories,
    availableRegions,
    availableCities,
  }
}
