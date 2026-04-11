// src/buyer/hooks/useProductSearch.ts
import { useState, useMemo } from 'react'
import { MOCK_PRODUCTS, type ProductFull } from '../data/productsMock'

export interface ProductFilters {
  name: string
  category: string
  region: string
  city: string
  priceSort: 'asc' | 'desc' | ''
  store: string
}

const INITIAL_FILTERS: ProductFilters = {
  name: '',
  category: '',
  region: '',
  city: '',
  priceSort: '',
  store: '',
}

export function useProductSearch() {
  const [filters, setFilters] = useState<ProductFilters>(INITIAL_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(10)

  function setFilter(key: keyof ProductFilters, value: string) {
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

  const filteredProducts = useMemo(() => {
    let result: ProductFull[] = [...MOCK_PRODUCTS]

    if (filters.name.trim()) {
      const term = filters.name.trim().toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(term))
    }
    if (filters.category) {
      result = result.filter(p => p.category === filters.category)
    }
    if (filters.region) {
      result = result.filter(p => p.region === filters.region)
    }
    if (filters.city) {
      result = result.filter(p => p.city === filters.city)
    }
    if (filters.store) {
      result = result.filter(p => p.store.name === filters.store)
    }
    if (filters.priceSort === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (filters.priceSort === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, currentPage, pageSize])

  const activeFilterCount = useMemo(() => {
    return (['category', 'region', 'city', 'priceSort', 'store'] as const)
      .filter(k => filters[k] !== '').length
  }, [filters])

  const availableCategories = useMemo(() =>
    [...new Set(MOCK_PRODUCTS.map(p => p.category))].sort(), [])

  const availableRegions = useMemo(() =>
    [...new Set(MOCK_PRODUCTS.map(p => p.region))].sort(), [])

  const availableCities = useMemo(() => {
    const source = filters.region
      ? MOCK_PRODUCTS.filter(p => p.region === filters.region)
      : MOCK_PRODUCTS
    return [...new Set(source.map(p => p.city))].sort()
  }, [filters.region])

  const availableStores = useMemo(() =>
    [...new Set(MOCK_PRODUCTS.map(p => p.store.name))].sort(), [])

  return {
    filters,
    setFilter,
    filteredProducts,
    paginatedProducts,
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
