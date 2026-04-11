import { Link } from 'react-router-dom'
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'
import { BannerCarousel } from './BannerCarousel'
import { ProductCard } from './ProductCard'

interface ProductItem {
  id: string
  image: string
  storeIcon: string
}

const MOCK_PRODUCTS: ProductItem[] = [
  { id: '1', image: 'https://picsum.photos/seed/prod1/300/345', storeIcon: 'https://picsum.photos/seed/s1/40/40' },
  { id: '2', image: 'https://picsum.photos/seed/prod2/300/345', storeIcon: 'https://picsum.photos/seed/s2/40/40' },
  { id: '3', image: 'https://picsum.photos/seed/prod3/300/345', storeIcon: 'https://picsum.photos/seed/s3/40/40' },
  { id: '4', image: 'https://picsum.photos/seed/prod4/300/345', storeIcon: 'https://picsum.photos/seed/s4/40/40' },
]

export function ProductsSection() {
  const width = useWindowWidth()
  const isTablet = width >= 640 && width < 1024
  const isMobile = width < 640
  const isDesktop = width >= 1024

  const visibleProducts = isTablet ? MOCK_PRODUCTS.slice(0, 3) : MOCK_PRODUCTS

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
              Descubre lo que el mundo tiene para ti
            </h2>
            <p
              style={{
                margin: '0.2rem 0 0',
                fontSize: isMobile ? '0.72rem' : '0.78rem',
                color: '#aaa',
              }}
            >
              Miles de productos de las mejores tiendas, en un solo lugar.
            </p>
          </div>
          <Link
            to="/search-products"
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
            Buscar productos
          </Link>
        </div>

        {/* Banner carousel */}
        <BannerCarousel />

        {/* Product cards grid */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: '0.75rem',
            marginTop: '0.25rem',
          }}
        >
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              storeIcon={product.storeIcon}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
