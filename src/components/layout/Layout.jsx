import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // સાઈડબાર ઓપન હોય ત્યારે 260px માર્જિન અને બંધ હોય ત્યારે 68px માર્જિન
  const mainMargin = sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-[68px]'

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      {/* ૧. Navbar */}
      <Navbar
        onMenuClick={() => setMobileSidebarOpen(true)}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* ૨. Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={false} />
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} isMobile={true} />

      {/* ૩. Main Content Area */}
      <div className={`transition-all duration-300 ease-out flex flex-col flex-1 pt-16 ${mainMargin}`}>
        
        <main className="p-5 lg:p-8 flex-1">
          <Outlet />
        </main>

  
      </div>
    </div>
  )
}