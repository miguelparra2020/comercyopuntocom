import { Link } from 'react-router-dom'

interface StoreCardProps {
  image: string
  storeIcon: string
  storeName: string
  to?: string
  ariaLabel?: string
}

export function StoreCard({ image, storeIcon, storeName, to = '/search-stores', ariaLabel = 'Ver tiendas' }: StoreCardProps) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      style={{
        display: 'block',
        aspectRatio: '16 / 9',
        borderRadius: '14px',
        overflow: 'hidden',
        position: 'relative',
        textDecoration: 'none',
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
      }}
    >
      <img
        src={image}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '2px solid #646cff',
          overflow: 'hidden',
          background: '#222',
        }}
      >
        <img
          src={storeIcon}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <span
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '10px',
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: 600,
          textShadow: '0 1px 3px rgba(0,0,0,0.6)',
        }}
      >
        {storeName}
      </span>
    </Link>
  )
}
