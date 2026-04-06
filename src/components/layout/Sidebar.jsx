import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  Users,
  HandHeart,
  Landmark,
  BookOpen,
  CalendarDays,
  BarChart3,
  Bell,
  FileText,
  Gem,
  ChevronDown,
  ChevronRight,
  X,
  PlusCircle,
  Shield,
} from "lucide-react";

const dropdownSections = [
  {
    trigger: { icon: Gem, label: "Derasar" },
    children: [
      { to: "/derasar/salgirah", icon: CalendarDays, label: "Salgirah" },
      { to: "/derasar/poojari", icon: Users, label: "Poojari" },
      { to: "/derasar/pratima", icon: Gem, label: "Pratima" },
    ],
  },
  {
    trigger: { icon: BookOpen, label: "Pathshala" },
    children: [
      { to: "/pathshala/students", icon: BookOpen, label: "Students" },
      { to: "/pathshala/teachers", icon: Users, label: "Teachers" },
      { to: "/pathshala/exams", icon: FileText, label: "Exams" },
      { to: "/pathshala/results", icon: BarChart3, label: "Results" },
    ],
  },
  {
    trigger: { icon: HandHeart, label: "Donations" },
    children: [
      { to: "/donations", icon: HandHeart, label: "All Donations" },
      { to: "/donations/add", icon: PlusCircle, label: "Add Donation" },
    ],
  },
  {
    trigger: { icon: BarChart3, label: "Reports" },
    children: [
      { to: "/reports/analytics", icon: BarChart3, label: "Analytics" },
      { to: "/reports/donations", icon: BarChart3, label: "Donation Report" },
      { to: "/reports/expenses", icon: BarChart3, label: "Expense Report" },
    ],
  },
];

const flatItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/masters", icon: LayoutDashboard, label: "Overview" },
  { to: "/masters/location", icon: MapPin, label: "Location Setup" },
  { to: "/masters/sangh", icon: Users, label: "Sangh Management" },
  { to: "/masters/trust", icon: Landmark, label: "Trust Management" },
  { to: "/roles", icon: Shield, label: "Roles & Permissions" },
];

export default function Sidebar({ isOpen, onClose, isMobile }) {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState({});

  const toggleDropdown = (label) => {
    setOpenDropdown((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    if (to === "/masters") return location.pathname === "/masters";
    return location.pathname.startsWith(to);
  };

  const isParentActive = (children) => {
    return children.some(
      (c) => location.pathname === c.to || location.pathname.startsWith(c.to),
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {isMobile && (
        <div className="px-5 py-4 flex justify-end border-b border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-4 pt-10 pb-4 space-y-3 scrollbar-thin">
        {/* Flat Items */}
        {flatItems.map((item) => {
          const active = isActive(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={isMobile ? onClose : undefined}
              title={!isOpen ? item.label : undefined}
              className="block"
            >
              <div
                className={`
                  relative rounded-lg px-4 py-2.5 text-[14px] font-medium tracking-wide
                  transition-all duration-200 ease-in-out cursor-pointer
                  ${!isOpen ? "flex items-center justify-center" : "flex items-center gap-3"}
                  ${
                    active
                      ? "bg-emerald-50/70"
                      : "text-slate-800 hover:text-emerald-600 hover:bg-slate-50"
                  }
                `}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-r-full" />
                )}
                <div className="flex items-center justify-center transition-all duration-300">
                  <item.icon
                    className={`w-[19px] h-[19px] shrink-0 ${active ? "text-teal-600" : "text-slate-500"}`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </div>
                {isOpen && (
                  <span
                    className={`truncate ${active ? "font-semibold text-transparent bg-clip-text" : ""}`}
                    style={
                      active
                        ? { backgroundImage: "linear-gradient(90deg, #0d9488 0%, #059669 100%)" }
                        : undefined
                    }
                  >
                    {item.label}
                  </span>
                )}
              </div>
            </NavLink>
          );
        })}

        {/* Dropdown Sections */}
        {dropdownSections.map((section) => {
          const parentActive = isParentActive(section.children);
          const isDDOpen = openDropdown[section.trigger.label];

          return (
            <div key={section.trigger.label} className="space-y-1">
              <button
                onClick={() => {
                  if (isOpen) toggleDropdown(section.trigger.label);
                }}
                title={!isOpen ? section.trigger.label : undefined}
                className={`
                  w-full relative rounded-lg px-4 py-2.5 text-[14px] font-medium tracking-wide
                  transition-all duration-200 ease-in-out cursor-pointer
                  ${!isOpen ? "flex items-center justify-center" : "flex items-center gap-3"}
                  ${
                    parentActive
                      ? "bg-emerald-50/70"
                      : "text-slate-800 hover:text-emerald-600 hover:bg-slate-50"
                  }
                `}
              >
                {parentActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-r-full" />
                )}
                <div className="flex items-center justify-center transition-all duration-300">
                  <section.trigger.icon
                    className={`w-[19px] h-[19px] shrink-0 ${parentActive ? "text-teal-600" : "text-slate-500"}`}
                    strokeWidth={parentActive ? 2.5 : 2}
                  />
                </div>
                {isOpen && (
                  <>
                    <span
                      className={`flex-1 text-left truncate ${parentActive ? "font-semibold text-transparent bg-clip-text" : ""}`}
                      style={
                        parentActive
                          ? { backgroundImage: "linear-gradient(90deg, #0d9488 0%, #059669 100%)" }
                          : undefined
                      }
                    >
                      {section.trigger.label}
                    </span>
                    <div className="transition-transform duration-200">
                      {isDDOpen ? (
                        <ChevronDown className={`w-4 h-4 ${parentActive ? "text-teal-600" : "text-slate-400"}`} strokeWidth={2.5} />
                      ) : (
                        <ChevronRight className={`w-4 h-4 ${parentActive ? "text-teal-600" : "text-slate-400"}`} strokeWidth={2.5} />
                      )}
                    </div>
                  </>
                )}
              </button>

              {isOpen && isDDOpen && (
                <div className="mt-1 ml-5 pl-2 border-l border-slate-100 space-y-2">
                  {section.children.map((child) => {
                    const childActive = location.pathname === child.to;
                    return (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        onClick={isMobile ? onClose : undefined}
                        className="block"
                      >
                        <div
                          className={`
                            rounded-md px-3 py-2 text-[13.5px] font-medium tracking-wide
                            transition-all duration-200 cursor-pointer flex items-center gap-2.5
                            ${
                              childActive
                                ? "bg-emerald-50/70"
                                : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                            }
                          `}
                        >
                          <child.icon
                            className={`w-[16px] h-[16px] shrink-0 ${childActive ? "text-teal-600" : "text-slate-400"}`}
                            strokeWidth={childActive ? 2.5 : 2}
                          />
                          <span
                            className={`truncate ${childActive ? "font-semibold text-transparent bg-clip-text" : ""}`}
                            style={
                              childActive
                                ? { backgroundImage: "linear-gradient(90deg, #0d9488 0%, #059669 100%)" }
                                : undefined
                            }
                          >
                            {child.label}
                          </span>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Notifications */}
        <div>
          <NavLink
            to="/notifications"
            onClick={isMobile ? onClose : undefined}
            title={!isOpen ? "Notifications" : undefined}
            className="block"
          >
            <div
              className={`
                relative rounded-lg px-4 py-2.5 text-[14px] font-medium tracking-wide
                transition-all duration-200 ease-in-out cursor-pointer
                ${!isOpen ? "flex items-center justify-center" : "flex items-center gap-3"}
                ${
                  isActive("/notifications")
                    ? "bg-emerald-50/70"
                    : "text-slate-800 hover:text-emerald-600 hover:bg-slate-50"
                }
              `}
            >
              {isActive("/notifications") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-r-full" />
              )}
              <div className="flex items-center justify-center transition-all duration-300">
                <Bell
                  className={`w-[19px] h-[19px] shrink-0 ${isActive("/notifications") ? "text-teal-600" : "text-slate-500"}`}
                  strokeWidth={isActive("/notifications") ? 2.5 : 2}
                />
              </div>
              {isOpen && (
                <span
                  className={`truncate ${isActive("/notifications") ? "font-semibold text-transparent bg-clip-text" : ""}`}
                  style={
                    isActive("/notifications")
                      ? { backgroundImage: "linear-gradient(90deg, #0d9488 0%, #059669 100%)" }
                      : undefined
                  }
                >
                  Notifications
                </span>
              )}
            </div>
          </NavLink>
        </div>
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-out lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <aside
      className={`hidden lg:flex flex-col fixed top-[64px] bottom-0 left-0 z-10 transition-all duration-300 ease-out border-r border-slate-100 ${isOpen ? "w-[260px]" : "w-[68px]"}`}
    >
      {sidebarContent}
    </aside>
  );
}