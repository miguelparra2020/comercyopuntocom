import type { StoreFull } from '../data/storesMock'

const BADGE_COLORS: Record<'VERIFICADA' | 'NUEVA', { bg: string; color: string }> = {
  VERIFICADA: { bg: '#a3e635', color: '#1a1a1a' },
  NUEVA:      { bg: '#646cff', color: '#fff' },
}

export function StoreCardFull({
  name, description, coverImage, logo, badge,
  region, city, rating, reviewCount,
}: StoreFull) {
  return (
    <div
      style={{
        background: '#1e1e1e',
        borderRadius: '12px',
        border: '1px solid #2a2a2a',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Portada */}
      <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#111', position: 'relative' }}>
        <img
          src={coverImage}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Logo */}
        <img
          src={logo}
          alt=""
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '2px solid #646cff',
            objectFit: 'cover',
            background: '#222',
          }}
        />

        {/* Badge */}
        {badge && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: BADGE_COLORS[badge].bg,
              color: BADGE_COLORS[badge].color,
              fontWeight: 700,
              fontSize: '0.65rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '999px',
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        {/* Nombre */}
        <p
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: '0.9rem',
            color: '#fff',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </p>

        {/* Descripción */}
        <p
          style={{
            margin: 0,
            fontSize: '0.75rem',
            color: '#aaa',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </p>

        {/* Ubicación */}
        <p style={{ margin: 0, fontSize: '0.73rem', color: '#888' }}>
          📍 {city}, {region}
        </p>

        {/* Rating */}
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#f59e0b' }}>
          ⭐ {rating} <span style={{ color: '#888' }}>({reviewCount} reseñas)</span>
        </p>

        {/* Botón */}
        <button
          style={{
            marginTop: 'auto',
            width: '100%',
            padding: '0.5rem',
            background: '#646cff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          Ver tienda
        </button>
      </div>
    </div>
  )
}
