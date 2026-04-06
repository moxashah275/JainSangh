import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard, MapPin, Users, Landmark,
  ChevronDown, X, PlusCircle, Shield, UserCog,
  Building2, Users as UsersRound, HardHat,
  HandHeart, BookOpen, BarChart3, Bell, ClipboardList
} from "lucide-react"

var dropdownSections = [
  { trigger: { icon: Building2, label: "Organization" }, children: [ { to: "/organization", icon: LayoutDashboard, label: "Overview" }, { to: "/organization/trust", icon: Landmark, label: "Trust Management" }, { to: "/organization/sangh", icon: Users, label: "Sangh Management" } ] },
  { trigger: { icon: UserCog, label: "Users" }, children: [ { to: "/users", icon: UsersRound, label: "All Users" }, { to: "/users/add", icon: PlusCircle, label: "Add User" } ] },
  { trigger: { icon: HardHat, label: "Staff" }, children: [ { to: "/staff/managers", icon: UserCog, label: "Managers" }, { to: "/staff/accountants", icon: UserCog, label: "Accountants" }, { to: "/staff/helpers", icon: UserCog, label: "Helpers" }, { to: "/staff/volunteers", icon: UserCog, label: "Volunteers" } ] },
  { trigger: { icon: HandHeart, label: "Donations" }, children: [ { to: "/donations", icon: ClipboardList, label: "Donation List" }, { to: "/donations/add", icon: PlusCircle, label: "Add Donation" } ] },
  { trigger: { icon: Building2, label: "Derasar" }, children: [ { to: "/derasar", icon: Landmark, label: "Derasar List" }, { to: "/derasar/salgirah", icon: ClipboardList, label: "Salgirah" }, { to: "/derasar/poojari", icon: UsersRound, label: "Poojari" }, { to: "/derasar/pratima", icon: Landmark, label: "Pratima" } ] },
  { trigger: { icon: BookOpen, label: "Pathshala" }, children: [ { to: "/pathshala/students", icon: UsersRound, label: "Students" }, { to: "/pathshala/teachers", icon: UserCog, label: "Teachers" }, { to: "/pathshala/exams", icon: ClipboardList, label: "Exams" }, { to: "/pathshala/results", icon: BarChart3, label: "Results" } ] },
  { trigger: { icon: BarChart3, label: "Reports" }, children: [ { to: "/reports/analytics", icon: BarChart3, label: "Analytics" }, { to: "/reports/donations", icon: ClipboardList, label: "Donation Reports" }, { to: "/reports/expenses", icon: ClipboardList, label: "Expense Reports" } ] }
]

var flatItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/location", icon: MapPin, label: "Location" },
  { to: "/roles", icon: Shield, label: "Roles & Permissions" },
  { to: "/notifications", icon: Bell, label: "Notifications" }
]

export default function Sidebar({ isOpen: isSidebarOpen, onClose, isMobile }) {
  var location = useLocation()
  var [openDD, setOpenDD] = useState({})

  var toggleDD = function(label) { setOpenDD(p => ({ ...p, [label]: !p[label] })) }
  var isActive = function(to) { return location.pathname === to }

  var content = (
    <div className="flex flex-col h-full bg-white">
      {isMobile && (
        <div className="px-5 py-4 flex justify-end border-b border-slate-100">
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>
      )}
      
      <nav className="flex-1 overflow-y-auto px-3 pt-6 pb-4 space-y-3 custom-scrollbar">
        {/* Flat Items */}
        {flatItems.map(function(item) {
          var a = isActive(item.to)
          return (
            <NavLink key={item.to} to={item.to} onClick={isMobile ? onClose : undefined} title={!isSidebarOpen ? item.label : undefined} className="block">
              <div className={'relative rounded-lg px-3 py-2.5 text-[14px] font-medium transition-all duration-200 flex items-center ' + (!isSidebarOpen ? "justify-center" : "gap-3") + ' ' + (a ? "bg-emerald-50 text-teal-700 font-semibold" : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50")}>
                {a && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-teal-500 rounded-r-full" />}
                <item.icon className={'w-[19px] h-[19px] shrink-0 ' + (a ? "text-teal-600" : "text-slate-500")} />
                {isSidebarOpen && <span>{item.label}</span>}
              </div>
            </NavLink>
          )
        })}

        {/* Dropdown Items */}
        {dropdownSections.map(function(sec) {
          var isDropdownOpen = openDD[sec.trigger.label]
          return (
            <div key={sec.trigger.label} className="space-y-1.5">
              <button onClick={function() { if (isSidebarOpen) toggleDD(sec.trigger.label) }} title={!isSidebarOpen ? sec.trigger.label : undefined}
                className="w-full relative rounded-lg px-3 py-2.5 text-[14px] font-medium transition-all duration-200 flex items-center text-slate-600 hover:text-emerald-600 hover:bg-slate-50">
                <sec.trigger.icon className="w-[19px] h-[19px] shrink-0 text-slate-500" />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1 text-left ml-3">{sec.trigger.label}</span>
                    <ChevronDown className={'w-4 h-4 transition-transform duration-200 ' + (isDropdownOpen ? "rotate-180" : "")} />
                  </>
                )}
              </button>
              
              {isSidebarOpen && isDropdownOpen && (
                <div className="mt-1 ml-4 pl-2 border-l border-slate-100 space-y-1.5">
                  {sec.children.map(function(ch) {
                    var cA = isActive(ch.to)
                    return (
                      <NavLink key={ch.to} to={ch.to} onClick={isMobile ? onClose : undefined} className="block">
                        <div className={'rounded-md px-3 py-2 text-[13px] font-medium transition-all duration-200 flex items-center gap-2.5 ' + (cA ? "text-teal-700 bg-emerald-50/50 font-semibold" : "text-slate-500 hover:text-teal-600 hover:bg-slate-50")}>
                          <ch.icon className={'w-[16px] h-[16px] shrink-0 ' + (cA ? "text-teal-600" : "text-slate-400")} />
                          <span className="truncate">{ch.label}</span>
                        </div>
                      </NavLink>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
        <div className={'fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-out lg:hidden ' + (isSidebarOpen ? "translate-x-0" : "-translate-x-full")}>{content}</div>
      </>
    )
  }
  return (
    <aside className={'hidden lg:flex flex-col fixed top-[64px] bottom-0 left-0 z-10 transition-all duration-300 ease-out border-r border-slate-100 ' + (isSidebarOpen ? "w-[260px]" : "w-[68px]")}>
      {content}
    </aside>
  )
}