import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'

interface BannerItem {
  id: string
  label: string
  image: string
}

const MOCK_BANNERS: BannerItem[] = [
  {
    id: '1',
    label: '✦ Nuevas tiendas esta semana — Explóralas ahora ✦',
    image: 'https://picsum.photos/seed/banner1/1240/200',
  },
  {
    id: '2',
    label: '✦ Los mejores productos al mejor precio ✦',
    image: 'https://picsum.photos/seed/banner2/1240/200',
  },
  {
    id: '3',
    label: '✦ Descuentos exclusivos en tiendas seleccionadas ✦',
    image: 'https://picsum.photos/seed/banner3/1240/200',
  },
]

export function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const width = useWindowWidth()
  const isDesktop = width >= 1024

  function goTo(index: number) {
    const next = Math.max(0, Math.min(MOCK_BANNERS.length - 1, index))
    setActiveIndex(next)
    if (scrollRef.current) {
      const child = scrollRef.current.children[next] as HTMLElement
      child?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    }
  }

  return (
    <div style={{ width: '100%', position: 'relative', marginBottom: '0.5rem' }}>
      {/* Arrow left — desktop only */}
      {isDesktop && (
        <button
          aria-label="Banner anterior"
          onClick={() => goTo(activeIndex - 1)}
          style={{
            position: 'absolute',
            left: '10px',
            top: '45%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid #555',
            background: 'rgba(255,255,255,0.12)',
            color: '#fff',
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ‹
        </button>
      )}

      {/* Scrollable banner track */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          borderRadius: '14px',
        }}
      >
        {MOCK_BANNERS.map((banner) => (
          <Link
            key={banner.id}
            to="/search-products"
            aria-label={banner.label}
            style={{
              flexShrink: 0,
              width: '100%',
              height: '130px',
              scrollSnapAlign: 'start',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              borderRadius: '14px',
              overflow: 'hidden',
              background: 'linear-gradient(120deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              border: '1px solid #333',
            }}
          >
            <img
              src={banner.image}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.2,
              }}
            />
            <span
              style={{
                position: 'relative',
                zIndex: 1,
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 500,
                letterSpacing: '0.04em',
                textAlign: 'center',
                padding: '0 3rem',
              }}
            >
              {banner.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Arrow right — desktop only */}
      {isDesktop && (
        <button
          aria-label="Banner siguiente"
          onClick={() => goTo(activeIndex + 1)}
          style={{
            position: 'absolute',
            right: '10px',
            top: '45%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid #555',
            background: 'rgba(255,255,255,0.12)',
            color: '#fff',
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ›
        </button>
      )}

      {/* Dot indicators */}
      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '6px' }}>
        {MOCK_BANNERS.map((banner, i) => (
          <button
            key={banner.id}
            data-testid="banner-dot"
            data-active={i === activeIndex ? 'true' : 'false'}
            aria-label={`Ir al banner ${i + 1}`}
            onClick={() => goTo(i)}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              background: i === activeIndex ? '#646cff' : '#444',
            }}
          />
        ))}
      </div>
    </div>
  )
}
