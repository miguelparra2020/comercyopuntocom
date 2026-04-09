export interface User {
  id: string
  email: string
  name: string
  avatar: string
}

export interface Business {
  id: string
  name: string
  slug: string
  logo: string | null
  role: 'owner' | 'employee' | 'seller'
}

export interface CartItem {
  id: string
  productId: string
  storeId: string
  storeSlug: string
  storeName: string
  productName: string
  price: number
  quantity: number
  addedAt: string
}

export interface SubProject {
  id: string
  name: string
  slug: string
}

export interface Route {
  id: string
  name: string
  slug: string
  subProjectId: string
}

export interface Module {
  id: string
  name: string
  slug: string
  routeId: string
  permissions: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
  }
}

export interface UserPermissions {
  subProjects: SubProject[]
  routes: Route[]
  modules: Module[]
}
