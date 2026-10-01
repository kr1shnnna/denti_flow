
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  UserCircle,
  LogOut,
} from "lucide-react";

import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

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
      name: "Doctors",
      icon: Stethoscope,
      path: "/doctors",
    },
    {
      name: "Patients",
      icon: Users,
      path: "/patients",
    },
    {
      name: "Profile",
      icon: UserCircle,
      path: "/profile",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =========================
          Sidebar
      ========================== */}
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
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={20} strokeWidth={1.8} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =========================
          Main Area
      ========================== */}
      <div className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
          {/* Left */}
          <div>
            <p className="text-sm text-slate-500">
              DentiFlow Administration
            </p>

            <h1 className="text-lg font-semibold text-slate-900">
              Admin Portal
            </h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* Admin */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
                A
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  DentiFlow Admin
                </p>

                <p className="text-xs text-slate-500">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* =========================
            Nested Page Content
        ========================== */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
