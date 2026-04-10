import { Link } from 'react-router-dom'

interface StoryItem {
  slug: string
  name: string
  logo: string
  bgImage: string
}

const MOCK_STORIES: StoryItem[] = [
  { slug: 'zara',      name: 'Zara',      logo: 'https://picsum.photos/seed/zara/40/40',      bgImage: 'https://picsum.photos/seed/zarabg/200/300' },
  { slug: 'nike',      name: 'Nike',      logo: 'https://picsum.photos/seed/nike/40/40',      bgImage: 'https://picsum.photos/seed/nikebg/200/300' },
  { slug: 'adidas',    name: 'Adidas',    logo: 'https://picsum.photos/seed/adidas/40/40',    bgImage: 'https://picsum.photos/seed/adidasbg/200/300' },
  { slug: 'levis',     name: "Levi's",    logo: 'https://picsum.photos/seed/levis/40/40',     bgImage: 'https://picsum.photos/seed/levisbg/200/300' },
  { slug: 'mango',     name: 'Mango',     logo: 'https://picsum.photos/seed/mango/40/40',     bgImage: 'https://picsum.photos/seed/mangobg/200/300' },
  { slug: 'hm',        name: 'H&M',       logo: 'https://picsum.photos/seed/hm/40/40',        bgImage: 'https://picsum.photos/seed/hmbg/200/300' },
  { slug: 'pull-bear', name: 'Pull&Bear', logo: 'https://picsum.photos/seed/pullbear/40/40',  bgImage: 'https://picsum.photos/seed/pullbearbg/200/300' },
]

export function StoriesCarousel() {
  return (
    /* Franja full-width con fondo */
    <div style={{ width: '100%', backgroundColor: 'black' }}>
      {/* Contenedor centrado a máximo 1240px */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', overflow: 'hidden' }}>
        {/* Carrusel scrolleable a la derecha */}
        <div
          style={{
            display: 'flex',
            gap: '0.6rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            padding: '0.75rem 1rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {MOCK_STORIES.map((story) => (
            <Link
              key={story.slug}
              to={`/store/${story.slug}`}
              aria-label={story.name}
              style={{
                flexShrink: 0,
                scrollSnapAlign: 'start',
                width: '80px',
                height: '130px',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                display: 'block',
                textDecoration: 'none',
                backgroundImage: `url(${story.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <img
                src={story.logo}
                alt=""
                style={{
                  position: 'absolute',
                  top: '6px',
                  left: '6px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '2px solid #646cff',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '50px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  padding: '0 4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {story.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
