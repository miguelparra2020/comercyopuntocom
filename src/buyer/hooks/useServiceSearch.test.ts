import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useServiceSearch } from './useServiceSearch'

describe('useServiceSearch', () => {
  it('returns all 10 services with no filters', () => {
    const { result } = renderHook(() => useServiceSearch())
    expect(result.current.filteredServices).toHaveLength(10)
  })

  it('filters by name (case insensitive)', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('name', 'diseño') })
    expect(result.current.filteredServices).toHaveLength(2)
    expect(result.current.filteredServices.every(s => s.name.toLowerCase().includes('diseño'))).toBe(true)
  })

  it('filters by category', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('category', 'Fotografía') })
    expect(result.current.filteredServices).toHaveLength(2)
    expect(result.current.filteredServices.every(s => s.category === 'Fotografía')).toBe(true)
  })

  it('filters by region', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('region', 'Antioquia') })
    expect(result.current.filteredServices).toHaveLength(4)
  })

  it('filters by city', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('city', 'Cali') })
    expect(result.current.filteredServices).toHaveLength(3)
  })

  it('filters by store', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('store', 'TechSolutions') })
    expect(result.current.filteredServices).toHaveLength(2)
  })

  it('sorts by price asc', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('priceSort', 'asc') })
    const prices = result.current.filteredServices.map(s => s.price)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  it('sorts by price desc', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('priceSort', 'desc') })
    const prices = result.current.filteredServices.map(s => s.price)
    expect(prices).toEqual([...prices].sort((a, b) => b - a))
  })

  it('resets city when region changes', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => {
      result.current.setFilter('region', 'Antioquia')
      result.current.setFilter('city', 'Medellín')
    })
    act(() => { result.current.setFilter('region', 'Cundinamarca') })
    expect(result.current.filters.city).toBe('')
  })

  it('resets currentPage to 1 when filter changes', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setPage(2) })
    act(() => { result.current.setFilter('category', 'Diseño') })
    expect(result.current.currentPage).toBe(1)
  })

  it('paginates correctly with pageSize 5', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setPageSize(5) })
    expect(result.current.paginatedServices).toHaveLength(5)
    expect(result.current.totalPages).toBe(2)
  })

  it('activeFilterCount counts non-name active filters', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => {
      result.current.setFilter('name', 'algo')
      result.current.setFilter('category', 'Diseño')
      result.current.setFilter('region', 'Antioquia')
    })
    expect(result.current.activeFilterCount).toBe(2)
  })

  it('clearFilters resets everything', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setPageSize(5) })
    act(() => { result.current.setPage(2) })
    act(() => {
      result.current.setFilter('category', 'Diseño')
      result.current.setFilter('region', 'Antioquia')
    })
    act(() => { result.current.clearFilters() })
    expect(result.current.filteredServices).toHaveLength(10)
    expect(result.current.activeFilterCount).toBe(0)
    expect(result.current.filters.name).toBe('')
    expect(result.current.currentPage).toBe(1)
  })

  it('availableCategories returns unique sorted categories', () => {
    const { result } = renderHook(() => useServiceSearch())
    expect(result.current.availableCategories).toEqual([
      'Diseño', 'Fotografía', 'Limpieza', 'Plomería', 'Programación',
    ])
  })

  it('availableCities is filtered by active region', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('region', 'Antioquia') })
    expect(result.current.availableCities).toEqual(['Envigado', 'Medellín'])
  })
})
