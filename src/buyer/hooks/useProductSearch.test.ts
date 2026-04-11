// src/buyer/hooks/useProductSearch.test.ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProductSearch } from './useProductSearch'

describe('useProductSearch', () => {
  it('returns all 10 products with no filters', () => {
    const { result } = renderHook(() => useProductSearch())
    expect(result.current.filteredProducts).toHaveLength(10)
  })

  it('filters by name (case insensitive)', () => {
    const { result } = renderHook(() => useProductSearch())
    act(() => { result.current.setFilter('name', 'teclado') })
    expect(result.current.filteredProducts).toHaveLength(1)
    expect(result.current.filteredProducts[0].name).toContain('Teclado')
  })

  it('filters by category', () => {
    const { result } = renderHook(() => useProductSearch())
    act(() => { result.current.setFilter('category', 'Belleza') })
    expect(result.current.filteredProducts).toHaveLength(2)
    expect(result.current.filteredProducts.every(p => p.category === 'Belleza')).toBe(true)
  })

  it('filters by region', () => {
    const { result } = renderHook(() => useProductSearch())
    act(() => { result.current.setFilter('region', 'Antioquia') })
    expect(result.current.filteredProducts).toHaveLength(4)
  })

  it('filters by city', () => {
    const { result } = renderHook(() => useProductSearch())
    act(() => { result.current.setFilter('city', 'Cali') })
    expect(result.current.filteredProducts).toHaveLength(3)
  })

  it('filters by store', () => {
    const { result } = renderHook(() => useProductSearch())
    act(() => { result.current.setFilter('store', 'TechStore') })
    expect(result.current.filteredProducts).toHaveLength(2)
  })

  it('sorts by price asc', () => {
    const { result } = renderHook(() => useProductSearch())
    act(() => { result.current.setFilter('priceSort', 'asc') })
    const prices = result.current.filteredProducts.map(p => p.price)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  it('sorts by price desc', () => {
    const { result } = renderHook(() => useProductSearch())
    act(() => { result.current.setFilter('priceSort', 'desc') })
    const prices = result.current.filteredProducts.map(p => p.price)
    expect(prices).toEqual([...prices].sort((a, b) => b - a))
  })

  it('resets city when region changes', () => {
    const { result } = renderHook(() => useProductSearch())
    act(() => {
      result.current.setFilter('region', 'Antioquia')
      result.current.setFilter('city', 'Medellín')
    })
    act(() => { result.current.setFilter('region', 'Cundinamarca') })
    expect(result.current.filters.city).toBe('')
  })

  it('resets currentPage to 1 when filter changes', () => {
    const { result } = renderHook(() => useProductSearch())
    act(() => { result.current.setPage(2) })
    act(() => { result.current.setFilter('category', 'Ropa') })
    expect(result.current.currentPage).toBe(1)
  })

  it('paginates correctly with pageSize 5', () => {
    const { result } = renderHook(() => useProductSearch())
    act(() => { result.current.setPageSize(5) })
    expect(result.current.paginatedProducts).toHaveLength(5)
    expect(result.current.totalPages).toBe(2)
  })

  it('activeFilterCount counts non-name active filters', () => {
    const { result } = renderHook(() => useProductSearch())
    act(() => {
      result.current.setFilter('name', 'algo')      // no cuenta
      result.current.setFilter('category', 'Ropa')  // cuenta
      result.current.setFilter('region', 'Antioquia') // cuenta
    })
    expect(result.current.activeFilterCount).toBe(2)
  })

  it('clearFilters resets everything', () => {
    const { result } = renderHook(() => useProductSearch())
    act(() => {
      result.current.setFilter('category', 'Ropa')
      result.current.setFilter('region', 'Antioquia')
    })
    act(() => { result.current.clearFilters() })
    expect(result.current.filteredProducts).toHaveLength(10)
    expect(result.current.activeFilterCount).toBe(0)
    expect(result.current.filters.name).toBe('')
  })

  it('availableCategories returns unique sorted categories', () => {
    const { result } = renderHook(() => useProductSearch())
    expect(result.current.availableCategories).toEqual([
      'Belleza', 'Deportes', 'Electrónica', 'Hogar', 'Ropa',
    ])
  })

  it('availableCities is filtered by active region', () => {
    const { result } = renderHook(() => useProductSearch())
    act(() => { result.current.setFilter('region', 'Antioquia') })
    expect(result.current.availableCities).toEqual(['Envigado', 'Medellín'])
  })
})
