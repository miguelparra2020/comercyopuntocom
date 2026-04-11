import { StoriesCarousel } from '../components/StoriesCarousel'
import { ProductsSection } from '../components/ProductsSection'
import { StoresSection } from '../components/StoresSection'

export function HomePage() {
  return (
    <div>
      <StoriesCarousel />
      <ProductsSection />
      <StoresSection />
    </div>
  )
}
