# Search Services Page — Design Spec

**Date:** 2026-04-11
**Route:** `/search-services`
**Goal:** Reemplazar el stub con una página de búsqueda de servicios completa: StoriesCarousel, filtros (nombre, categoría, región, ciudad, precio, tienda), grid de cards ricas y paginación arriba y abajo del grid.

---

## Architecture

Mirror exacto del patrón `/search-products`. Cada dominio tiene sus propios componentes aislados. Se reusan sin cambios: `StoriesCarousel`, `PaginationBar`, `useWindowWidth`.

```
SearchServicesPage
├── StoriesCarousel            (reuse)
├── ServiceSearchBar           (new) — desktop: input + 5 selects + limpiar
│                                      mobile: input + botón Filtros con badge
├── PaginationBar              (reuse)
├── grid de ServiceCardFull    (new)
├── PaginationBar              (reuse)
└── ServiceFilterDrawer        (new) — panel desde abajo mobile
```

Estado gestionado por `useServiceSearch` (new). La página orquesta, el hook filtra y pagina.

---

## Data Model — `ServiceFull`

Idéntico a `ProductFull`, con categorías de servicio:

```typescript
export interface ServiceFull {
  id: string
  name: string
  description: string
  price: number          // en COP, número entero
  image: string
  badge: 'NUEVO' | 'OFERTA' | null
  category: string       // 'Diseño' | 'Fotografía' | 'Programación' | 'Limpieza' | 'Plomería'
  region: string
  city: string
  store: {
    name: string
    icon: string
  }
  rating: number         // 0-5, un decimal
  reviewCount: number
}
```

**10 servicios mock** con variedad: 5 categorías (Diseño, Fotografía, Programación, Limpieza, Plomería), 3 regiones (Antioquia, Cundinamarca, Valle del Cauca), 4 ciudades (Medellín, Bogotá, Cali, Envigado), 4 proveedores.

---

## Hook — `useServiceSearch`

Idéntico a `useProductSearch` en estructura y comportamiento:

- Filtros: `name`, `category`, `region`, `city`, `priceSort` ('asc' | 'desc' | ''), `store`
- `setFilter(key, value)` — actualiza filtro, resetea página a 1; si cambia `region` limpia `city`
- `clearFilters()` — resetea todo, resetea página a 1
- `activeFilterCount` — cuenta: category, region, city, priceSort, store (no name)
- `availableCategories`, `availableRegions`, `availableCities` (dependiente de región activa), `availableStores`
- `filteredServices`, `paginatedServices`, `totalPages`, `currentPage`, `pageSize`
- `setPage`, `setPageSize`

---

## Components

### `ServiceCardFull`

Idéntico visualmente a `ProductCardFull` con una sola diferencia:

- Imagen `1:1` (misma que `ProductCardFull`)
- Badge `NUEVO` (verde lima `#a3e635`) / `OFERTA` (verde lima) — `null` = sin badge
- Nombre, precio formateado en COP, descripción, tienda (icon + nombre), ubicación 📍, rating ⭐ + reseñas
- Botón: **"Contratar"** (en lugar de "Ver producto") — fondo `#646cff`, ancho completo

### `ServiceSearchBar`

Idéntico a `ProductSearchBar`:
- **Desktop** (≥640px): input nombre + select Categoría + select Región + select Ciudad (disabled si no hay región) + select Precio + select Tienda + botón "Limpiar" condicional
- **Mobile** (<640px): input nombre + botón "Filtros" con badge numérico

### `ServiceFilterDrawer`

Idéntico a `FilterDrawer` de productos: 5 selects (Categoría, Región, Ciudad, Precio, Tienda) + backdrop + botones "Limpiar todo" y "Aplicar".

---

## Page — `SearchServicesPage`

```
<StoriesCarousel />
<div maxWidth="1240px">
  <h1>Bienvenido al área de búsqueda de servicios</h1>
  <p>subtítulo</p>
  <ServiceSearchBar ... />
  {filteredServices.length === 0
    ? <p>No encontramos servicios con esos filtros.</p>
    : <>
        <PaginationBar ... />
        <grid 2/3/4 cols>
          {paginatedServices.map(s => <ServiceCardFull key={s.id} {...s} />)}
        </grid>
        <PaginationBar ... />
      </>
  }
</div>
<ServiceFilterDrawer ... />
```

Grid responsivo: 2 cols mobile, 3 cols tablet (640–1023px), 4 cols desktop (≥1024px).

---

## Files

| Acción  | Archivo |
|---------|---------|
| Create  | `src/buyer/data/servicesMock.ts` |
| Create  | `src/buyer/hooks/useServiceSearch.ts` |
| Create  | `src/buyer/hooks/useServiceSearch.test.ts` |
| Create  | `src/buyer/components/ServiceCardFull.tsx` |
| Create  | `src/buyer/components/ServiceCardFull.test.tsx` |
| Create  | `src/buyer/components/ServiceSearchBar.tsx` |
| Create  | `src/buyer/components/ServiceSearchBar.test.tsx` |
| Create  | `src/buyer/components/ServiceFilterDrawer.tsx` |
| Create  | `src/buyer/components/ServiceFilterDrawer.test.tsx` |
| Modify  | `src/buyer/pages/SearchServicesPage.tsx` |
| Create  | `src/buyer/pages/SearchServicesPage.test.tsx` |

---

## Testing

Mismo enfoque TDD que `/search-products`:

- `useServiceSearch.test.ts` — sin filtros retorna 10, filtra por nombre/categoría/región/ciudad/priceSort/store, reset ciudad al cambiar región, reset página al filtrar, paginación, activeFilterCount (no cuenta name), clearFilters resetea todo incluyendo currentPage, availableCategories/Cities
- `ServiceCardFull.test.tsx` — nombre, precio COP, descripción, tienda, ubicación, rating, botón "Contratar", badge NUEVO, badge OFERTA, badge null
- `ServiceSearchBar.test.tsx` — desktop: input, 5 selects, no Filtros button, setFilter callback, Limpiar condicional; mobile: Filtros button, no selects, badge count, onOpenFilterDrawer
- `ServiceFilterDrawer.test.tsx` — visibilidad transform, 5 selects, backdrop cierra, Aplicar cierra, Limpiar todo llama clearFilters
- `SearchServicesPage.test.tsx` — título bienvenida, 10 cards con botón "Contratar", 2 PaginationBar, no empty-state inicial
