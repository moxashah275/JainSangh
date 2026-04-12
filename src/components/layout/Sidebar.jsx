import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, MapPin, Building2, UserCog, Users2, Hotel, 
  CalendarDays, ClipboardList, Briefcase, Receipt, HandHeart, 
  Users, BarChart3, Bell, Settings, X
} from 'lucide-react'

const menuItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/locations', icon: MapPin, label: 'Locations' },
  { to: '/organizations', icon: Building2, label: 'Organization' },
  { to: '/user-management', icon: UserCog, label: 'User Management' },
  { to: '/members', icon: Users2, label: 'Members' },
  { to: '/institutions', icon: Hotel, label: 'Institutions' },
  { to: '/activities', icon: CalendarDays, label: 'Activities' },
  { to: '/leave-management', icon: ClipboardList, label: 'Leave Management' },
  { to: '/daily-work', icon: Briefcase, label: 'Daily Work' },
  { to: '/finance', icon: Receipt, label: 'Finance' },
  { to: '/donations', icon: HandHeart, label: 'Donations' },
  { to: '/staff', icon: Users, label: 'Departments & Staff' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'System Settings' },
]

export default function Sidebar({ isOpen: isSidebarOpen, onClose, isMobile }) {
  const { pathname } = useLocation()
  const showLabels = isMobile || isSidebarOpen

  const isRouteActive = (to) => {
    if (to === '/dashboard' && pathname === '/') return true
    return pathname === to || pathname.startsWith(to + '/')
  }

  const content = (
    <div className="flex flex-col h-full bg-white select-none overflow-hidden font-sans">
      <nav className={`flex-1 px-3 ${isMobile ? 'py-6' : 'py-3'} space-y-1 
        overflow-y-auto overflow-x-hidden 
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
        
        {menuItems.map((item) => {
          const active = isRouteActive(item.to)
          
          return (
            <NavLink 
              key={item.to} 
              to={item.to} 
              onClick={isMobile ? onClose : undefined} 
              className="block group"
            >
              <div className={`relative flex items-center px-4 py-[10px] rounded-xl transition-all duration-200
                ${active ? 'bg-teal-50/60' : 'hover:bg-emerald-50/50'}
                ${!showLabels ? 'justify-center' : 'gap-3.5'}`}>
                
                {/* ICON with Gradient on Active */}
                <div className={`transition-all duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                    <item.icon 
                      className={`w-[19px] h-[19px] shrink-0 transition-all duration-300
                        ${active 
                          ? 'stroke-teal-600' 
                          : 'text-slate-400 group-hover:text-emerald-600'}`}
                      {...(active && { stroke: "url(#teal-gradient)" })}
                    />
                    <svg width="0" height="0" className="absolute">
                      <linearGradient id="teal-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0d9488" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </svg>
                </div>
                
                {showLabels && (
                  <span className={`text-[14.5px] whitespace-nowrap overflow-hidden tracking-wide transition-all duration-300
                    ${active 
                      ? 'font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent' 
                      : 'font-semibold text-slate-500 group-hover:text-emerald-700'}`}>
                    {item.label}
                  </span>
                )}
              </div>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={onClose} />}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-out bg-white ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
             <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent uppercase tracking-wider font-sans">Jain Sangh</span>
             <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><X className="w-6 h-6"/></button>
          </div>
          {content}
        </div>
      </>
    )
  }

  return (
    <aside className={`fixed top-16 bottom-0 left-0 z-10 transition-all duration-300 ease-in-out bg-white border-r border-slate-100 
      ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      {content}
    </aside>
  )
}