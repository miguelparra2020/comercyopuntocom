import { StoriesCarousel } from '../components/StoriesCarousel'
import { ProductsSection } from '../components/ProductsSection'
import { StoresSection } from '../components/StoresSection'
import { ServicesSection } from '../components/ServicesSection'
import { LaboralOffersSection } from '../components/LaboralOffersSection'

export function HomePage() {
  return (
    <div>
      <StoriesCarousel />
      <ProductsSection />
      <StoresSection />
      <ServicesSection />
      <LaboralOffersSection />
    </div>
  )
}
