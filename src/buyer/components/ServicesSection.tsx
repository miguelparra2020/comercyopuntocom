import { Link } from 'react-router-dom'
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'
import { BannerCarousel } from './BannerCarousel'
import { ProductCard } from './ProductCard'

interface ServiceItem {
  id: string
  image: string
  storeIcon: string
}

const MOCK_SERVICES: ServiceItem[] = [
  { id: '1', image: 'https://picsum.photos/seed/svc1/300/345', storeIcon: 'https://picsum.photos/seed/sv1/40/40' },
  { id: '2', image: 'https://picsum.photos/seed/svc2/300/345', storeIcon: 'https://picsum.photos/seed/sv2/40/40' },
  { id: '3', image: 'https://picsum.photos/seed/svc3/300/345', storeIcon: 'https://picsum.photos/seed/sv3/40/40' },
  { id: '4', image: 'https://picsum.photos/seed/svc4/300/345', storeIcon: 'https://picsum.photos/seed/sv4/40/40' },
]

export function ServicesSection() {
  const width = useWindowWidth()
  const isTablet = width >= 640 && width < 1024
  const isMobile = width < 640
  const isDesktop = width >= 1024

  const visibleServices = isTablet ? MOCK_SERVICES.slice(0, 3) : MOCK_SERVICES

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
              Los servicios que necesitas, cuando los necesitas
            </h2>
            <p
              style={{
                margin: '0.2rem 0 0',
                fontSize: isMobile ? '0.72rem' : '0.78rem',
                color: '#aaa',
              }}
            >
              Profesionales verificados, listos para ayudarte.
            </p>
          </div>
          <Link
            to="/search-services"
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
            Explorar servicios
          </Link>
        </div>

        {/* Banner carousel */}
        <BannerCarousel />

        {/* Service cards grid */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: '0.75rem',
            marginTop: '0.25rem',
          }}
        >
          {visibleServices.map((service) => (
            <ProductCard
              key={service.id}
              image={service.image}
              storeIcon={service.storeIcon}
              to="/search-services"
              ariaLabel="Ver servicios"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
