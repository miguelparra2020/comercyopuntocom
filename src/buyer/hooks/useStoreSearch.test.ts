import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStoreSearch } from './useStoreSearch'

describe('useStoreSearch', () => {
  it('returns all 10 stores with no filters', () => {
    const { result } = renderHook(() => useStoreSearch())
    expect(result.current.filteredStores).toHaveLength(10)
  })

  it('filters by name (case insensitive)', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setFilter('name', 'tech') })
    expect(result.current.filteredStores).toHaveLength(2)
    expect(result.current.filteredStores.every(s => s.name.toLowerCase().includes('tech'))).toBe(true)
  })

  it('filters by category', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setFilter('category', 'Belleza') })
    expect(result.current.filteredStores).toHaveLength(2)
    expect(result.current.filteredStores.every(s => s.category === 'Belleza')).toBe(true)
  })

  it('filters by region', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setFilter('region', 'Antioquia') })
    expect(result.current.filteredStores).toHaveLength(4)
  })

  it('filters by city', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setFilter('city', 'Cali') })
    expect(result.current.filteredStores).toHaveLength(3)
  })

  it('resets city when region changes', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => {
      result.current.setFilter('region', 'Antioquia')
      result.current.setFilter('city', 'Medellín')
    })
    act(() => { result.current.setFilter('region', 'Cundinamarca') })
    expect(result.current.filters.city).toBe('')
  })

  it('resets currentPage to 1 when filter changes', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setPage(2) })
    act(() => { result.current.setFilter('category', 'Ropa') })
    expect(result.current.currentPage).toBe(1)
  })

  it('paginates correctly with pageSize 5', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setPageSize(5) })
    expect(result.current.paginatedStores).toHaveLength(5)
    expect(result.current.totalPages).toBe(2)
  })

  it('activeFilterCount counts only category, region and city', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => {
      result.current.setFilter('name', 'algo')       // no cuenta
      result.current.setFilter('category', 'Ropa')   // cuenta
      result.current.setFilter('region', 'Antioquia') // cuenta
    })
    expect(result.current.activeFilterCount).toBe(2)
  })

  it('clearFilters resets everything', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setPageSize(5) })
    act(() => { result.current.setPage(2) })
    act(() => {
      result.current.setFilter('category', 'Ropa')
      result.current.setFilter('region', 'Antioquia')
    })
    act(() => { result.current.clearFilters() })
    expect(result.current.filteredStores).toHaveLength(10)
    expect(result.current.activeFilterCount).toBe(0)
    expect(result.current.filters.name).toBe('')
    expect(result.current.currentPage).toBe(1)
  })

  it('availableCategories returns unique sorted categories', () => {
    const { result } = renderHook(() => useStoreSearch())
    expect(result.current.availableCategories).toEqual([
      'Belleza', 'Deportes', 'Electrónica', 'Hogar', 'Ropa',
    ])
  })

  it('availableCities is filtered by active region', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setFilter('region', 'Antioquia') })
    expect(result.current.availableCities).toEqual(['Envigado', 'Medellín'])
  })
})
