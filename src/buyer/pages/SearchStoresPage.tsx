import { useState } from 'react'
import { StoriesCarousel } from '../components/StoriesCarousel'
import { StoreSearchBar } from '../components/StoreSearchBar'
import { StoreFilterDrawer } from '../components/StoreFilterDrawer'
import { StoreCardFull } from '../components/StoreCardFull'
import { PaginationBar } from '../components/PaginationBar'
import { useStoreSearch } from '../hooks/useStoreSearch'
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'

export function SearchStoresPage() {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const width = useWindowWidth()
  const isMobile = width < 640
  const isTablet = width >= 640 && width < 1024
  const gridColumns = width >= 1024 ? 4 : isTablet ? 3 : 2

  const {
    filters, setFilter, filteredStores, paginatedStores,
    totalPages, currentPage, pageSize, setPage, setPageSize,
    activeFilterCount, clearFilters,
    availableCategories, availableRegions, availableCities,
  } = useStoreSearch()

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
        <h1
          style={{
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            fontWeight: 700,
            color: '#fff',
            margin: '0 0 0.4rem',
          }}
        >
          Bienvenido al área de búsqueda de tiendas
        </h1>
        <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 1rem' }}>
          Encuentra las mejores tiendas verificadas cerca de ti.
        </p>

        <StoreSearchBar
          filters={filters}
          setFilter={setFilter}
          activeFilterCount={activeFilterCount}
          onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
          clearFilters={clearFilters}
          availableCategories={availableCategories}
          availableRegions={availableRegions}
          availableCities={availableCities}
        />

        {filteredStores.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem 0' }}>
            No encontramos tiendas con esos filtros.
          </p>
        ) : (
          <>
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                gap: '0.75rem',
                margin: '0.5rem 0',
              }}
            >
              {paginatedStores.map(store => (
                <StoreCardFull key={store.id} {...store} />
              ))}
            </div>

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

      <StoreFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        availableCategories={availableCategories}
        availableRegions={availableRegions}
        availableCities={availableCities}
      />
    </>
  )
}
