# Comercyo — Documento de Diseño

**Fecha:** 2026-04-08  
**Estado:** Aprobado

---

## 1. Visión General

Comercyo es una plataforma unificada de dos mundos dentro de una sola aplicación React:

- **Modo Comprar** — Ecommerce multitenda público para usuarios compradores
- **Modo Crear** — SaaS privado con módulos ERP/CMS para dueños y equipos de negocios

Ambos mundos conviven en la misma app, navegables desde un **TabBar en el footer** (Explorar / Crear), sin cambio de dominio ni recarga de página.

---

## 2. Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Routing | React Router v6 |
| Estado UI | Zustand |
| Estado servidor | TanStack Query (React Query) |
| HTTP | Axios (dos instancias: pública y privada) |
| Autenticación | Google OAuth → JWT propio vía Hono backend |
| Backend | Hono.js serverless |
| Base de datos | PostgreSQL |

---

## 3. Arquitectura — Single App, Dos Mundos

### 3.1 Estructura de rutas

```
comercyo.com/                          → Buyer: explorar tiendas
comercyo.com/store/:slug               → Buyer: tienda individual
comercyo.com/store/:slug/product/:id   → Buyer: detalle de producto
comercyo.com/cart                      → Buyer: carrito multi-tienda (requiere auth)
comercyo.com/orders                    → Buyer: mis pedidos (requiere auth)

comercyo.com/saas                      → Auth gate
comercyo.com/saas/projects             → SaaS: mis proyectos
comercyo.com/saas/:businessId/dashboard
comercyo.com/saas/:businessId/store
comercyo.com/saas/:businessId/orders
comercyo.com/saas/:businessId/inventory
comercyo.com/saas/:businessId/clients
comercyo.com/saas/:businessId/suppliers
comercyo.com/saas/:businessId/invoices
comercyo.com/saas/:businessId/settings
```

### 3.2 Estructura de carpetas

```
src/
├── buyer/                    # Mundo comprador (público)
│   ├── pages/                # Home, Store, ProductDetail, Cart, Orders
│   ├── components/           # ProductCard, StoreCard, CartItem, CartDrawer
│   └── hooks/                # useStores, useProducts, useCart, useOrders
│
├── saas/                     # Mundo creador (privado)
│   ├── pages/                # Projects, Dashboard, Store, Orders, Inventory...
│   ├── components/           # DataTable, StatsCard, PermissionGate, ModuleView
│   └── hooks/                # useBusiness, usePermissions, useInventory...
│
├── core/                     # Shell de la aplicación
│   ├── auth/                 # GoogleAuthProvider, AuthGuard, authStore
│   ├── layout/               # AppShell, Navbar, TabBar, Drawer
│   └── router/               # Definición de rutas buyer + saas + guards
│
└── shared/                   # Reutilizable entre mundos
    ├── api/                  # Axios instances + interceptors
    ├── components/           # Button, Input, Modal, Avatar...
    ├── types/                # Tipos TypeScript globales
    └── utils/                # Helpers comunes
```

---

## 4. Autenticación

### 4.1 Flujo Google OAuth

1. Usuario intenta acción protegida (agregar al carrito, tab Crear) sin estar autenticado
2. `AuthGuard` intercepta → muestra pantalla de login
3. Clic en "Continuar con Google" → popup OAuth de Google
4. Google devuelve `id_token`
5. Frontend hace `POST /auth/google` con el `id_token` al backend Hono
6. Hono valida el token con Google → crea o actualiza usuario en PostgreSQL → devuelve **JWT propio**
7. JWT se almacena en `authStore (Zustand)` + `localStorage`
8. Axios interceptor inyecta el JWT en cada request privado
9. Al expirar el JWT (401) → interceptor de Axios hace logout automático y redirige al login

### 4.2 Qué requiere autenticación

| Acción | Auth requerida |
|---|---|
| Explorar tiendas / productos | No |
| Buscar | No |
| Ver detalle de producto | No |
| Agregar al carrito | Sí (Google) |
| Hacer un pedido | Sí (Google) |
| Ver mis pedidos | Sí (Google) |
| Tab Crear / SaaS | Sí (Google) |

---

## 5. Navegación — Navbar y Drawer

### 5.1 Navbar (Modo Comprar)

- **Izquierda:** Logo de Comercyo + nombre de la ruta actual
- **Derecha:** Avatar del usuario
  - Si no autenticado: ícono genérico → clic dispara login Google
  - Si autenticado: foto de perfil Google → clic abre drawer

### 5.2 Drawer lateral (Avatar → clic)

- Desliza de derecha a izquierda
- Ancho: 90% del viewport, máximo 350px
- Backdrop: oscuro semitransparente, clic fuera cierra el drawer
- Contenido:
  - Header: foto + nombre + email del usuario
  - Mi perfil
  - Carrito (con badge de cantidad de ítems)
  - Mis pedidos
  - Cerrar sesión

### 5.3 TabBar en footer

| Tab | Ícono | Destino |
|---|---|---|
| Explorar | 🔍 | `/` — modo comprar |
| Crear | ✨ | `/saas` — modo creador (requiere auth) |

---

## 6. Carrito de Compras

El carrito es **persistido en el backend** (no solo estado local), lo que habilita:

- Sincronización entre dispositivos del mismo usuario
- Trazabilidad completa de ítems añadidos vs comprados
- Detección de **carritos abandonados**: la tienda ve qué productos dejaron sin comprar
- La tienda puede enviar ofertas a usuarios con carrito abandonado pasado un tiempo configurable

### Flujo del carrito

1. Usuario autenticado agrega producto → mutation `POST /cart/items`
2. TanStack Query invalida y refetch de `GET /cart`
3. Backend guarda en PostgreSQL: `userId`, `productId`, `storeId`, `quantity`, `addedAt`
4. En el dashboard SaaS, la tienda ve carritos abandonados bajo el módulo de Pedidos

---

## 7. Capa de Datos

### 7.1 Responsabilidades

| Librería | Responsabilidad |
|---|---|
| **Zustand** | Estado UI: usuario autenticado, tab activo, drawer abierto, negocio seleccionado |
| **TanStack Query** | Todo lo que viene del backend: fetch, cache, refetch, mutaciones |
| **Axios** | Transporte HTTP: dos instancias, interceptores de auth y error |

### 7.2 Zustand stores

| Store | Estado que maneja |
|---|---|
| `authStore` | `user`, `jwt`, `isAuthenticated` |
| `uiStore` | `activeTab`, `isDrawerOpen`, `activeBusinessId` |

### 7.3 Axios instances

```
apiPublic  → base URL del backend, sin auth (buyer browsing)
apiPrivate → base URL del backend + interceptor JWT (saas + buyer auth actions)
```

---

## 8. SaaS — Módulos del Negocio

### 8.1 Pantalla de proyectos (`/saas/projects`)

Al autenticarse, el usuario ve:

```
Mis negocios (owner)
├── La Tienda Co.
└── Mi Negocio 2

Negocios donde participo
├── Tienda XYZ  →  rol: Vendedor
└── Empresa ABC →  rol: Empleado
```

### 8.2 Subproyectos y módulos del SaaS

La navegación del SaaS se organiza en **subproyectos** (grupos de funcionalidad), cada uno con **rutas** y dentro de cada ruta **módulos** con permisos individuales. Esta estructura es fija y está definida en base de datos.

Ejemplo de subproyectos del sistema:

| Subproyecto | Rutas de ejemplo | Módulos dentro de cada ruta |
|---|---|---|
| **Dashboard** | Resumen general | KPIs, carritos abandonados, alertas de stock |
| **Mi Tienda** | Perfil, Productos, Categorías | Info del negocio, gestión de productos, URL pública |
| **Gestión de Pedidos** | Pedidos recibidos, Carritos abandonados | Lista, detalle, cambio de estado |
| **Inventario** | Stock, Movimientos | Entradas/salidas, alertas, vinculación proveedores |
| **Gestión de Clientes** | Mis Clientes, Ranking de Vendedores, KPIs y Notas | Mis Clientes, Cartera, Prospectos |
| **Proveedores** | Directorio, Órdenes de compra | Ficha proveedor, historial |
| **Facturación** | Facturas | Generación, estados, descarga PDF |
| **Ajustes** | Equipo, Permisos, Config | Gestión de usuarios del negocio |

### 8.3 Sistema de permisos (RBAC granular)

La jerarquía de navegación del SaaS es **fija y definida en base de datos**:

```
Proyecto
└── Subproyecto  (ej: "Gestión de Clientes")
    └── Ruta      (ej: "Mis Clientes", "Ranking de Vendedores", "KPIs y Notas")
        └── Módulo (ej: "Mis Clientes", "Cartera", "Prospectos")
            └── Permisos por módulo: ver · crear · editar · eliminar
```

**Comportamiento:**
- Cada usuario (empleado, vendedor) ve solo los subproyectos, rutas y módulos a los que tiene acceso
- Los permisos se asignan por el owner desde Ajustes del negocio
- El frontend usa un componente `<PermissionGate>` que oculta o deshabilita elementos según los permisos del usuario autenticado
- Los permisos se cargan al entrar al negocio vía TanStack Query y se cachean en sesión

**Roles en un negocio:**
- `owner` — acceso total, puede gestionar usuarios y permisos
- `employee` — acceso según permisos configurados por el owner
- `seller` — acceso según permisos configurados por el owner

---

## 9. Decisiones de Diseño Clave

1. **Single App sobre Monorepo** — el TabBar unificado requiere transición fluida entre mundos; un monorepo con apps separadas implicaría cambio de dominio y rompería la UX.

2. **Carrito en backend** — la trazabilidad y el feature de carritos abandonados son parte del valor de negocio de Comercyo para las tiendas, no un detalle técnico.

3. **RBAC definido en BD** — los subproyectos/rutas/módulos son fijos del sistema; el owner solo configura quién accede a qué. Esto simplifica el frontend (no genera nav dinámico arbitrario) y garantiza consistencia.

4. **Dos instancias de Axios** — `apiPublic` para el mundo comprador (sin auth, mejor para SEO futuro y CDN) y `apiPrivate` con JWT para acciones autenticadas y SaaS.

5. **TanStack Query como única fuente de verdad del servidor** — Zustand no duplica datos del backend; solo maneja estado UI efímero.
