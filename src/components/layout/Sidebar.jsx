import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MapPin, Building2, UserCog, Users2, Hotel,
  CalendarDays, Receipt, Users, BarChart3, Bell, Settings, X, ChevronDown, FileText
} from 'lucide-react';

const menuItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  
  
  { to: '/locations', icon: MapPin, label: 'Location Management' },

  {
  label: 'Organization',
  icon: Building2,
  children: [
    { to: '/organizations/all', label: 'All Organizations' },
    { to: '/organizations/sanghs', label: 'All Sanghs' },
    { to: '/organizations/trusts', label: 'All Trusts' },
    { to: '/organizations/linked', label: 'Linked Sangh & Trust' },
  ]
},
  {
    label: 'User Management',
    icon: UserCog,
    children: [
      { to: '/users/all', label: 'All Users' },
      { to: '/users/roles', label: 'Roles & Permissions' },
    ]
  },
  {
    label: 'Members',
    icon: Users2,
    children: [
      { to: '/members/families', label: 'Families' },
      { to: '/members/individual', label: 'Individual' },
      { to: '/members/committee', label: 'Committee Members' },
    ]
  },
  {
    label: 'Institutions',
    icon: Hotel,
    children: [
      { to: '/institutions/derasar', label: 'Derasar' },
      { to: '/institutions/pathshala', label: 'Pathshala' },
      { to: '/institutions/aayambil', label: 'Aayambil Shala' },
      { to: '/institutions/upasray', label: 'Upasray' },
    ]
  },
  {
    label: 'Activities',
    icon: CalendarDays,
    children: [
      { to: '/activities/events', label: 'Events' },
      { to: '/activities/meetings', label: 'Meetings' },
      { to: '/activities/attendance', label: 'Attendance' },
      { to: '/activities/leave', label: 'Leave' },
      { to: '/activities/work', label: 'Daily Work' },
    ]
  },
  {
    label: 'Finance',
    icon: Receipt,
    children: [
      { to: '/finance/donations', label: 'Donations' },
      { to: '/finance/expenses', label: 'Expenses & Bills' },
      { to: '/finance/receipts', label: 'Donation Receipts' },
    ]
  },
  {
    label: 'Departments & Staff',
    icon: Users,
    children: [
      { to: '/staff/dept', label: 'Departments' },
      { to: '/staff/members', label: 'Staff Members' },
    ]
  },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'System Settings' },
];

export default function Sidebar({ isOpen: isSidebarOpen, onClose, isMobile }) {
  const { pathname } = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const showLabels = isMobile || isSidebarOpen;

  useEffect(() => {
    setOpenMenus((prev) => {
      const nextMenus = { ...prev };

      menuItems.forEach((item) => {
        if (!item.children) return;

        const hasActiveChild = item.children.some(
          (child) => pathname === child.to || pathname.startsWith(child.to + '/')
        );

        if (hasActiveChild) {
          nextMenus[item.label] = true;
        }
      });

      return nextMenus;
    });
  }, [pathname]);

  const toggleMenu = (label) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isRouteActive = (to) => {
    if (!to) return false;
    if (to === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) return true;
    return pathname === to || pathname.startsWith(to + '/');
  };

  const isParentActive = (children) => {
    return children?.some(child => isRouteActive(child.to));
  };

  const NavItem = ({ item }) => {
    const hasChildren = !!item.children;
    const parentActive = hasChildren && isParentActive(item.children);
    const active = isRouteActive(item.to) || parentActive;
    const isOpen = openMenus[item.label];

    const itemStyle = `relative flex items-center px-4 py-[11px] rounded-xl transition-all duration-300 group cursor-pointer
      hover:bg-emerald-50/60 
      ${!showLabels ? 'justify-center' : 'gap-3.5'}`;

    const labelStyle = `text-[14.5px] flex-1 whitespace-nowrap font-sans transition-all duration-300
      ${active 
        ? 'font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent' 
        : 'font-semibold text-slate-500 group-hover:text-emerald-600'}`;

    const iconStyle = `w-[20px] h-[20px] shrink-0 transition-all duration-300 
      ${active ? 'text-teal-600 scale-110' : 'text-slate-400 group-hover:text-emerald-500'}`;

    // Dropdown logic only for items with children
    if (hasChildren && showLabels) {
      return (
        <div className="mb-1">
          <div onClick={() => toggleMenu(item.label)} className={itemStyle}>
            <item.icon className={iconStyle} />
            <span className={labelStyle}>{item.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${active ? 'text-teal-600' : 'text-slate-300'}`} />
          </div>
          
          {isOpen && (
            <div className="mt-1 ml-6 space-y-0.5">
              {item.children.map(child => (
                <NavLink 
                  key={child.to} 
                  to={child.to} 
                  onClick={isMobile ? onClose : undefined}
                  className={({ isActive }) => `block py-2 px-4 text-[13.5px] rounded-lg transition-all
                    hover:bg-emerald-50/60
                    ${isActive 
                      ? 'text-teal-600 font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent' 
                      : 'text-slate-500 font-medium hover:text-emerald-600'}`}
                >
                  {child.label}
                </NavLink>
                
              ))}
            </div>
          )}
        </div>
      );
    }

    // Standard NavLink for single items (like Dashboard and now Location Management)
    return (
      <NavLink to={item.to} onClick={isMobile ? onClose : undefined} className={`mb-1 ${itemStyle}`}>
        <item.icon className={iconStyle} />
        {showLabels && <span className={labelStyle}>{item.label}</span>}
      </NavLink>
    );
  };

  const content = (
    <div className="flex flex-col h-full bg-white select-none">
      <nav className={`flex-1 px-3 ${isMobile ? 'py-6' : 'py-4'} space-y-1 overflow-y-auto 
        scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
        {menuItems.map((item, idx) => (
          <NavItem key={item.label || idx} item={item} />
        ))}
      </nav>
    </div>
  );

  // Mobile & Desktop render logic stays the same...
  if (isMobile) {
    return (
      <>
        {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40" onClick={onClose} />}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 bg-white shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <span className="text-xl font-black bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">JAIN SANGH</span>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X className="w-6 h-6"/></button>
          </div>
          {content}
        </div>
      </>
    );
  }

  return (
    <aside className={`fixed top-16 bottom-0 left-0 z-10 transition-all duration-300 ease-in-out bg-white border-r border-slate-100 
      ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      {content}
    </aside>
  );
}
