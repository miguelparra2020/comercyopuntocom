# Search Stores Page — Design Spec

**Date:** 2026-04-11
**Route:** `/search-stores`
**Goal:** Reemplazar el stub con una página de búsqueda de tiendas completa: StoriesCarousel, filtros (nombre, categoría, región, ciudad), grid de cards ricas y paginación arriba y abajo del grid.

---

## Architecture

Mirror exacto del patrón `/search-products`. Cada dominio tiene sus propios componentes aislados. Se reusan sin cambios: `StoriesCarousel`, `PaginationBar`, `useWindowWidth`.

```
SearchStoresPage
├── StoriesCarousel          (reuse)
├── StoreSearchBar           (new) — desktop: input + 3 selects + limpiar
│                                    mobile: input + botón Filtros con badge
├── PaginationBar            (reuse)
├── grid de StoreCardFull    (new)
├── PaginationBar            (reuse)
└── StoreFilterDrawer        (new) — panel desde abajo mobile
```

Estado gestionado por `useStoreSearch` (new). La página orquesta, el hook filtra y pagina.

---

## Data Model — `StoreFull`

```typescript
export interface StoreFull {
  id: string
  name: string
  description: string
  coverImage: string       // banner 16:9
  logo: string             // ícono circular
  badge: 'VERIFICADA' | 'NUEVA' | null
  category: string         // 'Ropa' | 'Electrónica' | 'Hogar' | 'Deportes' | 'Belleza'
  region: string
  city: string
  rating: number           // 0-5, un decimal
  reviewCount: number
}
```

**10 tiendas mock** con variedad: 5 categorías, 3 regiones (Antioquia, Cundinamarca, Valle del Cauca), 4 ciudades (Medellín, Bogotá, Cali, Envigado).

---

## Hook — `useStoreSearch`

Filtros disponibles: `name`, `category`, `region`, `city`. Sin `priceSort` ni `store`.

- `setFilter(key, value)` — actualiza filtro, resetea página a 1; si cambia `region` limpia `city`
- `clearFilters()` — resetea todo
- `activeFilterCount` — cuenta solo `category`, `region`, `city` (no `name`)
- `availableCategories`, `availableRegions`, `availableCities` (dependiente de región activa)
- `filteredStores`, `paginatedStores`, `totalPages`, `currentPage`, `pageSize`
- `setPage`, `setPageSize`

---

## Components

### `StoreCardFull`

Props: spread de `StoreFull`.

Layout vertical:
1. **Portada** — `aspectRatio: 16/9`, `objectFit: cover`
   - Logo circular (32px) esquina superior izquierda, borde `#646cff`
   - Badge `VERIFICADA` (verde lima) / `NUEVA` (azul) esquina superior derecha — `null` = sin badge
2. **Contenido** (padding `0.75rem`, flex column):
   - Nombre (bold, clamp 1 línea)
   - Descripción (color `#aaa`, clamp 2 líneas)
   - Ubicación: `📍 {city}, {region}` (color `#888`)
   - Rating: `⭐ {rating}` + `({reviewCount} reseñas)` (color `#f59e0b`)
   - Botón "Ver tienda" (ancho completo, fondo `#646cff`)

### `StoreSearchBar`

Props: `filters`, `setFilter`, `activeFilterCount`, `onOpenFilterDrawer`, `clearFilters`, `availableCategories`, `availableRegions`, `availableCities`.

- **Desktop** (≥640px): input nombre + select Categoría + select Región + select Ciudad (disabled si no hay región) + botón "Limpiar" (visible si `activeFilterCount > 0` o nombre no vacío)
- **Mobile** (<640px): input nombre + botón "Filtros" con badge numérico si `activeFilterCount > 0`

### `StoreFilterDrawer`

Props: `isOpen`, `onClose`, `filters`, `setFilter`, `clearFilters`, `availableCategories`, `availableRegions`, `availableCities`.

Panel bottom-sheet: 3 selects (Categoría, Región, Ciudad) + botones "Limpiar todo" y "Aplicar". Backdrop clickeable cierra el drawer. Mismo comportamiento visual que `FilterDrawer` de productos.

---

## Page — `SearchStoresPage`

```
<StoriesCarousel />
<div maxWidth="1240px">
  <h1>Bienvenido al área de búsqueda de tiendas</h1>
  <p>subtítulo</p>
  <StoreSearchBar ... />
  {filteredStores.length === 0
    ? <p>No encontramos tiendas con esos filtros.</p>
    : <>
        <PaginationBar ... />
        <grid 2/3/4 cols>
          {paginatedStores.map(s => <StoreCardFull key={s.id} {...s} />)}
        </grid>
        <PaginationBar ... />
      </>
  }
</div>
<StoreFilterDrawer ... />
```

Grid responsivo: 2 cols mobile, 3 cols tablet (640–1023px), 4 cols desktop (≥1024px).

---

## Files

| Acción  | Archivo |
|---------|---------|
| Create  | `src/buyer/data/storesMock.ts` |
| Create  | `src/buyer/hooks/useStoreSearch.ts` |
| Create  | `src/buyer/hooks/useStoreSearch.test.ts` |
| Create  | `src/buyer/components/StoreCardFull.tsx` |
| Create  | `src/buyer/components/StoreCardFull.test.tsx` |
| Create  | `src/buyer/components/StoreSearchBar.tsx` |
| Create  | `src/buyer/components/StoreSearchBar.test.tsx` |
| Create  | `src/buyer/components/StoreFilterDrawer.tsx` |
| Create  | `src/buyer/components/StoreFilterDrawer.test.tsx` |
| Modify  | `src/buyer/pages/SearchStoresPage.tsx` |
| Create  | `src/buyer/pages/SearchStoresPage.test.tsx` |

---

## Testing

Mismo enfoque TDD que `/search-products`:

- `useStoreSearch.test.ts` — sin filtros retorna 10, filtra por nombre/categoría/región/ciudad, reset ciudad al cambiar región, paginación, activeFilterCount, clearFilters, availableCities dependiente de región
- `StoreCardFull.test.tsx` — nombre, descripción, badge, ubicación, rating, botón "Ver tienda"
- `StoreSearchBar.test.tsx` — desktop muestra selects, mobile muestra botón Filtros con badge, Limpiar condicional
- `StoreFilterDrawer.test.tsx` — visibilidad transform, 3 selects, backdrop cierra, Aplicar cierra, Limpiar todo llama clearFilters
- `SearchStoresPage.test.tsx` — título bienvenida, 10 cards, 2 PaginationBar, no empty-state inicial
