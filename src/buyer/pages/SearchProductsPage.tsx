import { useState } from 'react'
import { StoriesCarousel } from '../components/StoriesCarousel'
import { ProductSearchBar } from '../components/ProductSearchBar'
import { FilterDrawer } from '../components/FilterDrawer'
import { ProductCardFull } from '../components/ProductCardFull'
import { PaginationBar } from '../components/PaginationBar'
import { useProductSearch } from '../hooks/useProductSearch'
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'

export function SearchProductsPage() {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const width = useWindowWidth()
  const isMobile = width < 640
  const isTablet = width >= 640 && width < 1024
  const gridColumns = width >= 1024 ? 4 : isTablet ? 3 : 2

  const {
    filters, setFilter, filteredProducts, paginatedProducts,
    totalPages, currentPage, pageSize, setPage, setPageSize,
    activeFilterCount, clearFilters,
    availableCategories, availableRegions, availableCities, availableStores,
  } = useProductSearch()

  return (
    <>
      <StoriesCarousel />

      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: isMobile ? '1rem' : '1.5rem',
        }}
      >
        {/* Bienvenida */}
        <h1
          style={{
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            fontWeight: 700,
            color: '#fff',
            margin: '0 0 0.4rem',
          }}
        >
          Bienvenido al área de búsqueda de productos
        </h1>
        <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 1rem' }}>
          Encuentra exactamente lo que buscas entre miles de productos verificados.
        </p>

        {/* Barra de filtros */}
        <ProductSearchBar
          filters={filters}
          setFilter={setFilter}
          activeFilterCount={activeFilterCount}
          onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
          clearFilters={clearFilters}
          availableCategories={availableCategories}
          availableRegions={availableRegions}
          availableCities={availableCities}
          availableStores={availableStores}
        />

        {filteredProducts.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem 0' }}>
            No encontramos productos con esos filtros.
          </p>
        ) : (
          <>
            {/* Paginación arriba */}
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />

            {/* Grid de productos */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                gap: '0.75rem',
                margin: '0.5rem 0',
              }}
            >
              {paginatedProducts.map(product => (
                <ProductCardFull key={product.id} {...product} />
              ))}
            </div>

            {/* Paginación abajo */}
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </>
        )}
      </div>

      {/* Drawer de filtros mobile */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        availableCategories={availableCategories}
        availableRegions={availableRegions}
        availableCities={availableCities}
        availableStores={availableStores}
      />
    </>
  )
}
