import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { TabBar } from './TabBar'
import { Drawer } from './Drawer'

export function AppShell() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '56px', paddingBottom: '60px', minHeight: '100vh' }}>
        <Outlet />
      </main>
      <TabBar />
      <Drawer />
    </>
  )
}
