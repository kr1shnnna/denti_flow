
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Clock3,
  UserCircle,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Appointments",
      icon: CalendarDays,
      path: "/appointments",
    },
    {
      name: "Patients",
      icon: Users,
      path: "/patients",
    },
    {
      name: "Availability",
      icon: Clock3,
      path: "/availability",
    },

    {
      name: "Profile",
      icon: UserCircle,
      path: "/profile",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      
      {/* Logo */}
      <div className="flex h-20 items-center px-7">
        <img
          src="/logo/dentiflow-logo.png"
          alt="DentiFlow"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-teal-50 text-teal-600"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={20} strokeWidth={1.8} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-200 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} strokeWidth={1.8} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

