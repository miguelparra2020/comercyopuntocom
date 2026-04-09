import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../layout/AppShell'
import { AuthGuard } from '../auth/AuthGuard'
import { LoginPage } from '../auth/LoginPage'
import { HomePage } from '../../buyer/pages/HomePage'
import { ProjectsPage } from '../../saas/pages/ProjectsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      // Public buyer routes
      { index: true, element: <HomePage /> },

      // Auth
      { path: 'login', element: <LoginPage /> },

      // Protected SaaS routes
      {
        element: <AuthGuard />,
        children: [
          { path: 'saas/projects', element: <ProjectsPage /> },
        ],
      },
    ],
  },
])
