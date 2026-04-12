import { useState, useMemo } from 'react'
import { MOCK_SERVICES, type ServiceFull } from '../data/servicesMock'

export interface ServiceFilters {
  name: string
  category: string
  region: string
  city: string
  priceSort: 'asc' | 'desc' | ''
  store: string
}

const INITIAL_FILTERS: ServiceFilters = {
  name: '',
  category: '',
  region: '',
  city: '',
  priceSort: '',
  store: '',
}

export function useServiceSearch() {
  const [filters, setFilters] = useState<ServiceFilters>(INITIAL_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(10)

  function setFilter(key: keyof ServiceFilters, value: string) {
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

  const filteredServices = useMemo(() => {
    let result: ServiceFull[] = [...MOCK_SERVICES]

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
    if (filters.store) {
      result = result.filter(s => s.store.name === filters.store)
    }
    if (filters.priceSort === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (filters.priceSort === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize))

  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredServices.slice(start, start + pageSize)
  }, [filteredServices, currentPage, pageSize])

  const activeFilterCount = useMemo(() => {
    return (['category', 'region', 'city', 'priceSort', 'store'] as const)
      .filter(k => filters[k] !== '').length
  }, [filters])

  const availableCategories = useMemo(() =>
    [...new Set(MOCK_SERVICES.map(s => s.category))].sort(), [])

  const availableRegions = useMemo(() =>
    [...new Set(MOCK_SERVICES.map(s => s.region))].sort(), [])

  const availableCities = useMemo(() => {
    const source = filters.region
      ? MOCK_SERVICES.filter(s => s.region === filters.region)
      : MOCK_SERVICES
    return [...new Set(source.map(s => s.city))].sort()
  }, [filters.region])

  const availableStores = useMemo(() =>
    [...new Set(MOCK_SERVICES.map(s => s.store.name))].sort(), [])

  return {
    filters,
    setFilter,
    filteredServices,
    paginatedServices,
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
    availableStores,
  }
}
