import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PaginationBar } from './PaginationBar'

function renderBar(overrides = {}) {
  const props = {
    currentPage: 1,
    totalPages: 5,
    pageSize: 10,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
    ...overrides,
  }
  render(<PaginationBar {...props} />)
  return props
}

describe('PaginationBar', () => {
  it('renders current page and total pages', () => {
    renderBar({ currentPage: 2, totalPages: 29 })
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText(/de 29/)).toBeInTheDocument()
  })

  it('previous button is disabled on page 1', () => {
    renderBar({ currentPage: 1 })
    expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled()
  })

  it('next button is disabled on last page', () => {
    renderBar({ currentPage: 5, totalPages: 5 })
    expect(screen.getByRole('button', { name: /siguiente/i })).toBeDisabled()
  })

  it('calls onPageChange with page - 1 when previous is clicked', async () => {
    const onPageChange = vi.fn()
    renderBar({ currentPage: 3, onPageChange })
    await userEvent.click(screen.getByRole('button', { name: /anterior/i }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with page + 1 when next is clicked', async () => {
    const onPageChange = vi.fn()
    renderBar({ currentPage: 3, onPageChange })
    await userEvent.click(screen.getByRole('button', { name: /siguiente/i }))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('calls onPageSizeChange when select changes', async () => {
    const onPageSizeChange = vi.fn()
    renderBar({ onPageSizeChange })
    await userEvent.selectOptions(screen.getByRole('combobox'), '5')
    expect(onPageSizeChange).toHaveBeenCalledWith(5)
  })

  it('renders page size options 5, 10, 20', () => {
    renderBar()
    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('10')
    expect(screen.getByRole('option', { name: '5' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '20' })).toBeInTheDocument()
  })
})
