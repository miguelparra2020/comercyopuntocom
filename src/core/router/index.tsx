import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../layout/AppShell'
import { AuthGuard } from '../auth/AuthGuard'
import { LoginPage } from '../auth/LoginPage'
import { HomePage } from '../../buyer/pages/HomePage'
import { ProfilePage } from '../../buyer/pages/ProfilePage'
import { CartPage } from '../../buyer/pages/CartPage'
import { OrdersPage } from '../../buyer/pages/OrdersPage'
import { NotificationsPage } from '../../buyer/pages/NotificationsPage'
import { ChatPage } from '../../buyer/pages/ChatPage'
import { ProjectsPage } from '../../saas/pages/ProjectsPage'
import { SearchProductsPage } from '../../buyer/pages/SearchProductsPage'
import { SearchStoresPage } from '../../buyer/pages/SearchStoresPage'
import { SearchServicesPage } from '../../buyer/pages/SearchServicesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      // Public buyer routes
      { index: true, element: <HomePage /> },
      { path: 'search-products', element: <SearchProductsPage /> },
      { path: 'search-stores', element: <SearchStoresPage /> },
      { path: 'search-services', element: <SearchServicesPage /> },

      // Auth
      { path: 'login', element: <LoginPage /> },

      // Protected routes
      {
        element: <AuthGuard />,
        children: [
          { path: 'profile', element: <ProfilePage /> },
          { path: 'cart', element: <CartPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'chat', element: <ChatPage /> },
          { path: 'saas/projects', element: <ProjectsPage /> },
        ],
      },
    ],
  },
])
