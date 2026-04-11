import { Link } from 'react-router-dom'

interface ProductCardProps {
  image: string
  storeIcon: string
}

export function ProductCard({ image, storeIcon }: ProductCardProps) {
  return (
    <Link
      to="/search-products"
      aria-label="Ver productos"
      style={{
        display: 'block',
        aspectRatio: '1 / 1.15',
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
          background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 45%)',
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
    </Link>
  )
}
