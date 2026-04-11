# Search Products Page — Design Spec

## Goal

Rediseñar `/search-products` como una página de búsqueda estilo e-commerce con filtros por nombre, categoría, región, ciudad, precio y tienda; cards de producto ricas; y paginación arriba y abajo del grid.

## Architecture

`SearchProductsPage` orquesta la página. La lógica de filtrado y paginación vive en el hook `useProductSearch`. Los componentes de UI son independientes y testeables por separado.

```
SearchProductsPage
  ├── StoriesCarousel          (existente, reutilizado)
  ├── título + descripción     (inline en la página)
  ├── ProductSearchBar         (filtros)
  ├── PaginationBar            (encima del grid)
  ├── grid de ProductCardFull  (resultados)
  ├── PaginationBar            (debajo del grid)
  └── FilterDrawer             (mobile only)
```

## Tech Stack

- React 18 + TypeScript
- React Router v6 (sin navegación adicional)
- `useWindowWidth` (hook existente en `shared/hooks`)
- Datos: array mock hardcodeado, filtrado en memoria
- Sin librerías de UI externas

---

## Data Model

```ts
interface ProductFull {
  id: string
  name: string
  description: string
  price: number            // en COP, ej: 99589000
  image: string            // URL picsum
  badge: 'NUEVO' | 'OFERTA' | null
  category: string         // 'Electrónica' | 'Ropa' | 'Hogar' | 'Deportes' | 'Belleza'
  region: string           // ej: 'Antioquia'
  city: string             // ej: 'Medellín'
  store: {
    name: string
    icon: string           // URL picsum 40x40
  }
  rating: number           // 0–5, un decimal
  reviewCount: number
}
```

### Mock data — 10 productos

Distribuidos así para que los filtros tengan efecto real:

| # | Nombre | Categoría | Región | Ciudad | Tienda | Badge |
|---|--------|-----------|--------|--------|--------|-------|
| 1 | Teclado Mecánico Pro | Electrónica | Antioquia | Medellín | TechStore | NUEVO |
| 2 | Camiseta Linen Oversize | Ropa | Cundinamarca | Bogotá | ModaUrbana | null |
| 3 | Lámpara de Escritorio LED | Hogar | Antioquia | Medellín | CasaViva | OFERTA |
| 4 | Zapatillas Running X200 | Deportes | Valle del Cauca | Cali | SportMax | NUEVO |
| 5 | Sérum Vitamina C | Belleza | Cundinamarca | Bogotá | GlowShop | null |
| 6 | Monitor Curvo 27" | Electrónica | Antioquia | Envigado | TechStore | null |
| 7 | Chaqueta Impermeable | Ropa | Antioquia | Medellín | ModaUrbana | OFERTA |
| 8 | Silla Ergonómica Mesh | Hogar | Valle del Cauca | Cali | CasaViva | NUEVO |
| 9 | Guantes de Boxeo | Deportes | Cundinamarca | Bogotá | SportMax | null |
| 10 | Kit Skincare Natural | Belleza | Valle del Cauca | Cali | GlowShop | OFERTA |

---

## Components

### `useProductSearch` hook

**Archivo:** `src/buyer/hooks/useProductSearch.ts`

Estado interno:
```ts
filters: {
  name: string          // '' = sin filtro
  category: string      // '' = todas
  region: string        // '' = todas
  city: string          // '' = todas
  priceSort: 'asc' | 'desc' | ''
  store: string         // '' = todas
}
currentPage: number     // empieza en 1
pageSize: number        // default 10; opciones: 5, 10, 20
```

Devuelve:
```ts
{
  filters,
  setFilter: (key: keyof filters, value: string) => void,
  filteredProducts: ProductFull[],   // después de aplicar todos los filtros
  paginatedProducts: ProductFull[],  // slice de filteredProducts para la página actual
  totalPages: number,
  currentPage: number,
  pageSize: number,
  setPage: (page: number) => void,
  setPageSize: (size: number) => void,
  activeFilterCount: number,         // filtros activos excluyendo `name`
  clearFilters: () => void,
  availableCategories: string[],     // valores únicos del mock
  availableRegions: string[],
  availableCities: string[],         // filtradas por region activa
  availableStores: string[],
}
```

Reglas:
- Al cambiar cualquier filtro, `currentPage` vuelve a 1 automáticamente.
- `city` se resetea a `''` cuando cambia `region`.
- Los filtros se aplican en cadena: name → category → region → city → store → priceSort.
- `activeFilterCount` cuenta cuántos de {category, region, city, priceSort, store} son distintos de `''`.

---

### `ProductCardFull`

**Archivo:** `src/buyer/components/ProductCardFull.tsx`

Props: `ProductFull` (spread completo).

Layout (de arriba a abajo):
1. **Badge** top-left — `NUEVO` o `OFERTA` en pill amarillo-verde (`#a3e635` bg, `#1a1a1a` text). Oculto si `badge === null`.
2. **Imagen** — aspect ratio 3/4, `object-fit: cover`, fondo `#f5f5f5`.
3. **Nombre** — máx 2 líneas, `overflow: hidden`, `text-overflow: ellipsis`, `display: -webkit-box`, `-webkit-line-clamp: 2`.
4. **Precio** — formateado como `$XX.XXX.XXX` usando `toLocaleString('es-CO')`, color blanco, `font-weight: 700`.
5. **Descripción** — máx 2 líneas, truncado igual que nombre, color `#aaa`, `font-size: 0.78rem`.
6. **Tienda** — fila: `<img>` icono 20x20 redondeado + nombre de tienda, color `#888`.
7. **Ubicación** — fila: 📍 `city`, `region`, color `#888`, `font-size: 0.75rem`.
8. **Rating** — fila: ⭐ `rating` `(reviewCount reseñas)`, color `#f59e0b`.
9. **Botón** — `Ver producto`, full-width, fondo `#646cff`, color blanco, `border-radius: 8px`.

Fondo de la card: `#1e1e1e`, `border-radius: 12px`, `border: 1px solid #2a2a2a`.

---

### `ProductSearchBar`

**Archivo:** `src/buyer/components/ProductSearchBar.tsx`

Props:
```ts
{
  filters: filters,
  setFilter: (key, value) => void,
  activeFilterCount: number,
  onOpenFilterDrawer: () => void,
  clearFilters: () => void,
  availableCategories: string[],
  availableRegions: string[],
  availableCities: string[],     // ya filtradas por región activa
  availableStores: string[],
}
```

**Desktop** (`width >= 640`): fila horizontal con gap, todos inline:
- `input` tipo texto con placeholder "Buscar por nombre..."
- `select` Categoría (con opción "Todas las categorías")
- `select` Región (con opción "Todas las regiones")
- `select` Ciudad (con opción "Todas las ciudades"; deshabilitado si no hay región)
- `select` Precio ("Sin ordenar / Menor a mayor / Mayor a menor")
- `select` Tienda (con opción "Todas las tiendas")
- Botón "Limpiar" (visible solo si `activeFilterCount > 0` o `filters.name !== ''`)

**Mobile** (`width < 640`): fila de dos elementos:
- `input` texto full-width
- Botón "⚙ Filtros" con badge circular morado si `activeFilterCount > 0`

Estilos: fondo `#1a1a1a`, `border: 1px solid #2a2a2a`, `border-radius: 8px` por campo. Coherente con el resto de la app.

---

### `FilterDrawer`

**Archivo:** `src/buyer/components/FilterDrawer.tsx`

Props:
```ts
{
  isOpen: boolean,
  onClose: () => void,
  filters: filters,
  setFilter: (key, value) => void,
  clearFilters: () => void,
  availableCategories: string[],
  availableRegions: string[],
  availableCities: string[],
  availableStores: string[],
}
```

Comportamiento:
- Se renderiza siempre; si `isOpen === false` → `transform: translateY(100%)` con `transition: transform 0.25s ease`. Si `isOpen === true` → `transform: translateY(0)`.
- Backdrop oscuro al tocar → `onClose()`.
- Panel desde abajo: `position: fixed`, `bottom: 0`, `left: 0`, `right: 0`, `max-height: 80vh`, `overflow-y: auto`.
- Contiene: título "Filtros", los 5 selects apilados (Categoría, Región, Ciudad, Precio, Tienda), botón "Limpiar todo", botón "Aplicar" (cierra el drawer).
- `data-testid="filter-drawer"` en el panel y `data-testid="filter-drawer-backdrop"` en el backdrop.

---

### `PaginationBar`

**Archivo:** `src/buyer/components/PaginationBar.tsx`

Props:
```ts
{
  currentPage: number,
  totalPages: number,
  pageSize: number,
  onPageChange: (page: number) => void,
  onPageSizeChange: (size: number) => void,
}
```

Layout: `‹` — [página actual resaltada] — `de N` — `›` — `por página` — `select (5/10/20)`

- Botón `‹`: deshabilitado si `currentPage === 1`.
- Botón `›`: deshabilitado si `currentPage === totalPages` o `totalPages === 0`.
- Página actual: fondo `#646cff`, color blanco, `border-radius: 6px`, padding `0.2rem 0.6rem`.
- Select `por página`: opciones `[5, 10, 20]`; al cambiar → `onPageSizeChange` y vuelve a página 1 (manejado en el hook).
- Si `totalPages === 0`: muestra `1 de 1` con botones deshabilitados.
- `data-testid="pagination-bar"` en el contenedor.

---

### `SearchProductsPage` (actualizada)

**Archivo:** `src/buyer/pages/SearchProductsPage.tsx`

Estado local: `isFilterDrawerOpen: boolean` (solo para móvil).

```tsx
const { filters, setFilter, paginatedProducts, totalPages,
        currentPage, pageSize, setPage, setPageSize,
        activeFilterCount, clearFilters, filteredProducts,
        availableCategories, availableRegions, availableCities, availableStores
      } = useProductSearch()

return (
  <>
    <StoriesCarousel />
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1rem' }}>
      <h1>Bienvenido al área de búsqueda de productos</h1>
      <p>Encuentra exactamente lo que buscas entre miles de productos verificados.</p>
      <ProductSearchBar ... />
      {filteredProducts.length === 0
        ? <p>No encontramos productos con esos filtros.</p>
        : <>
            <PaginationBar ... />
            <div style={{ display: 'grid', gridTemplateColumns: ... }}>
              {paginatedProducts.map(p => <ProductCardFull key={p.id} {...p} />)}
            </div>
            <PaginationBar ... />
          </>
      }
    </div>
    <FilterDrawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} ... />
  </>
)
```

---

## Testing

Cada componente/hook tiene su propio archivo de test:

| Archivo | Qué cubre |
|---------|-----------|
| `useProductSearch.test.ts` | filtrado por cada campo, cadena de filtros, reset de página al filtrar, reset de city al cambiar region, paginación, clearFilters |
| `ProductCardFull.test.tsx` | badge visible/oculto, nombre truncado, precio formateado, botón presente, store name, ubicación, rating |
| `ProductSearchBar.test.tsx` | render desktop vs mobile (mockeando `useWindowWidth`), badge de activeFilterCount en mobile, botón limpiar visible/oculto |
| `FilterDrawer.test.tsx` | oculto cuando cerrado, visible cuando abierto, backdrop click llama onClose, selects presentes |
| `PaginationBar.test.tsx` | botón anterior deshabilitado en página 1, botón siguiente deshabilitado en última página, cambio de página, cambio de pageSize |
| `SearchProductsPage.test.tsx` | mensaje vacío cuando no hay resultados, PaginationBar renderizada dos veces, StoriesCarousel presente |
