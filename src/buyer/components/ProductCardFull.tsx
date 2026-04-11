// src/buyer/components/ProductCardFull.tsx
import type { ProductFull } from '../data/productsMock'

function formatPrice(price: number): string {
  return '$' + price.toLocaleString('es-CO')
}

export function ProductCardFull(props: ProductFull) {
  const { name, description, price, image, badge, region, city, store, rating, reviewCount } = props
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
      {/* Badge */}
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            zIndex: 1,
            background: '#a3e635',
            color: '#1a1a1a',
            fontWeight: 700,
            fontSize: '0.68rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '999px',
          }}
        >
          {badge}
        </span>
      )}

      {/* Imagen */}
      <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#f5f5f5' }}>
        <img
          src={image}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
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
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {name}
        </p>

        {/* Precio */}
        <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
          {formatPrice(price)}
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

        {/* Tienda */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <img
            src={store.icon}
            alt=""
            style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: '0.75rem', color: '#888' }}>{store.name}</span>
        </div>

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
          Ver producto
        </button>
      </div>
    </div>
  )
}
