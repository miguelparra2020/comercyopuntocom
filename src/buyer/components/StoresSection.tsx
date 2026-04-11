import { Link } from 'react-router-dom'
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'
import { BannerCarousel } from './BannerCarousel'
import { StoreCard } from './StoreCard'

interface StoreItem {
  id: string
  image: string
  storeIcon: string
  storeName: string
}

const MOCK_STORES: StoreItem[] = [
  { id: '1', image: 'https://picsum.photos/seed/store1/400/225', storeIcon: 'https://picsum.photos/seed/si1/40/40', storeName: 'Tienda Uno' },
  { id: '2', image: 'https://picsum.photos/seed/store2/400/225', storeIcon: 'https://picsum.photos/seed/si2/40/40', storeName: 'Tienda Dos' },
  { id: '3', image: 'https://picsum.photos/seed/store3/400/225', storeIcon: 'https://picsum.photos/seed/si3/40/40', storeName: 'Tienda Tres' },
  { id: '4', image: 'https://picsum.photos/seed/store4/400/225', storeIcon: 'https://picsum.photos/seed/si4/40/40', storeName: 'Tienda Cuatro' },
]

export function StoresSection() {
  const width = useWindowWidth()
  const isTablet = width >= 640 && width < 1024
  const isMobile = width < 640
  const isDesktop = width >= 1024

  const visibleStores = isTablet ? MOCK_STORES.slice(0, 3) : MOCK_STORES

  const gridColumns = isDesktop ? 4 : isTablet ? 3 : 2

  return (
    <div style={{ width: '100%', backgroundColor: '#111' }}>
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: isMobile ? '0.75rem 1rem 1rem' : '1rem 1.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Header row */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            gap: '0.75rem',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              Las tiendas más cerca de lo que buscas
            </h2>
            <p
              style={{
                margin: '0.2rem 0 0',
                fontSize: isMobile ? '0.72rem' : '0.78rem',
                color: '#aaa',
              }}
            >
              Las mejores tiendas, verificadas y listas para ti.
            </p>
          </div>
          <Link
            to="/search-stores"
            style={{
              flexShrink: 0,
              background: 'transparent',
              border: '1.5px solid #646cff',
              color: '#646cff',
              borderRadius: '20px',
              padding: isMobile ? '0.35rem 0.75rem' : '0.4rem 1rem',
              fontSize: isMobile ? '0.72rem' : '0.78rem',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Explorar tiendas
          </Link>
        </div>

        {/* Banner carousel */}
        <BannerCarousel />

        {/* Store cards grid */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: '0.75rem',
            marginTop: '0.25rem',
          }}
        >
          {visibleStores.map((store) => (
            <StoreCard
              key={store.id}
              image={store.image}
              storeIcon={store.storeIcon}
              storeName={store.storeName}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
