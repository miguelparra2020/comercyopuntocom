import { Link } from 'react-router-dom'
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'
import { BannerCarousel } from './BannerCarousel'
import { StoreCard } from './StoreCard'

interface LaboralOfferItem {
  id: string
  image: string
  storeIcon: string
  storeName: string
}

const MOCK_OFFERS: LaboralOfferItem[] = [
  { id: '1', image: 'https://picsum.photos/seed/job1/400/225', storeIcon: 'https://picsum.photos/seed/jb1/40/40', storeName: 'Tienda Empleo Uno' },
  { id: '2', image: 'https://picsum.photos/seed/job2/400/225', storeIcon: 'https://picsum.photos/seed/jb2/40/40', storeName: 'Tienda Empleo Dos' },
  { id: '3', image: 'https://picsum.photos/seed/job3/400/225', storeIcon: 'https://picsum.photos/seed/jb3/40/40', storeName: 'Tienda Empleo Tres' },
  { id: '4', image: 'https://picsum.photos/seed/job4/400/225', storeIcon: 'https://picsum.photos/seed/jb4/40/40', storeName: 'Tienda Empleo Cuatro' },
]

export function LaboralOffersSection() {
  const width = useWindowWidth()
  const isTablet = width >= 640 && width < 1024
  const isMobile = width < 640
  const isDesktop = width >= 1024

  const visibleOffers = isTablet ? MOCK_OFFERS.slice(0, 3) : MOCK_OFFERS

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
              Encuentra tu próxima oportunidad laboral
            </h2>
            <p
              style={{
                margin: '0.2rem 0 0',
                fontSize: isMobile ? '0.72rem' : '0.78rem',
                color: '#aaa',
              }}
            >
              Las mejores tiendas buscan talento como el tuyo.
            </p>
          </div>
          <Link
            to="/search-laboral-oferts"
            aria-label="Ver ofertas laborales"
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
            Ver ofertas laborales
          </Link>
        </div>

        {/* Banner carousel */}
        <BannerCarousel />

        {/* Offer cards grid */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: '0.75rem',
            marginTop: '0.25rem',
          }}
        >
          {visibleOffers.map((offer) => (
            <StoreCard
              key={offer.id}
              image={offer.image}
              storeIcon={offer.storeIcon}
              storeName={offer.storeName}
              to="/search-laboral-oferts"
              ariaLabel="Ver ofertas laborales"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
