import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { TabBar } from './TabBar'
import { Drawer } from './Drawer'
import { ScrollToTop } from './ScrollToTop'

export function AppShell() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main style={{ paddingTop: '56px', paddingBottom: '60px', minHeight: '100vh' }}>
        <Outlet />
      </main>
      <TabBar />
      <Drawer />
    </>
  )
}
