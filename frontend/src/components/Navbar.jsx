
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  User,
  CalendarDays,
  LogOut,
  Menu,
  X,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);

  // =========================
  // Check logged-in user
  // =========================
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Invalid user data:", error);
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    // Update navbar when login/logout happens
    window.addEventListener("auth-change", loadUser);

    return () => {
      window.removeEventListener("auth-change", loadUser);
    };
  }, []);

  // =========================
  // Close dropdown on outside click
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);

    window.dispatchEvent(new Event("auth-change"));

    navigate("/");
  };

  // =========================
  // User information
  // =========================
  const userName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "User";

  const userEmail = user?.email || "";

  const avatarLetter = userName
    .charAt(0)
    .toUpperCase();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* =========================
            Logo
        ========================= */}
        <Link
          to="/"
          className="shrink-0"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <img
            src="/logo/logo.png"
            alt="DentiFlow"
            className="h-10 w-auto"
          />
        </Link>

        {/* =========================
            Desktop Navigation
        ========================= */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/">Home</NavLink>

          <NavLink to="/doctors">
            Doctors
          </NavLink>

          <NavLink to="/services">
            Services
          </NavLink>

          <NavLink to="/about">
            About
          </NavLink>
        </div>

        {/* =========================
            Desktop Actions
        ========================= */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Book Appointment */}
          <Link
            to="/appointments"
            className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Book Appointment
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-600"
              >
                Register
              </Link>
            </>
          ) : (
            /* =========================
               Logged-in User Dropdown
            ========================= */
            <div
              ref={dropdownRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setIsDropdownOpen(
                    (previous) => !previous
                  )
                }
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-teal-600 text-sm font-bold text-white">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={userName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    avatarLetter
                  )}
                </div>

                <span className="max-w-28 truncate text-sm font-semibold text-slate-700">
                  {userName}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${
                    isDropdownOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
                  {/* User Info */}
                  <div className="border-b border-slate-100 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                        {avatarLetter}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {userName}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile */}
                  <div className="p-2">
                    <Link
                      to="/profile"
                      onClick={() =>
                        setIsDropdownOpen(false)
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <User
                        size={17}
                        className="text-slate-400"
                      />

                      <span>My Profile</span>
                    </Link>

                    {/* Appointments */}
                    <Link
                      to="/appointments"
                      onClick={() =>
                        setIsDropdownOpen(false)
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <CalendarDays
                        size={17}
                        className="text-slate-400"
                      />

                      <span>My Appointments</span>
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 p-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                      <LogOut size={17} />

                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================
            Mobile Menu Button
        ========================= */}
        <button
          type="button"
          onClick={() =>
            setIsMobileMenuOpen(
              (previous) => !previous
            )
          }
          className="rounded-lg p-2 text-slate-700 md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </nav>

      {/* =========================
          Mobile Navigation
      ========================= */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-6 py-5 md:hidden">
          <div className="space-y-1">
            <MobileNavLink
              to="/"
              onClick={() =>
                setIsMobileMenuOpen(false)
              }
            >
              Home
            </MobileNavLink>

            <MobileNavLink
              to="/doctors"
              onClick={() =>
                setIsMobileMenuOpen(false)
              }
            >
              Doctors
            </MobileNavLink>

            <MobileNavLink
              to="/services"
              onClick={() =>
                setIsMobileMenuOpen(false)
              }
            >
              Services
            </MobileNavLink>

            <MobileNavLink
              to="/about"
              onClick={() =>
                setIsMobileMenuOpen(false)
              }
            >
              About
            </MobileNavLink>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <Link
              to="/appointments"
              onClick={() =>
                setIsMobileMenuOpen(false)
              }
              className="block rounded-xl bg-teal-600 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Book Appointment
            </Link>

            {!user ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                    {avatarLetter}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {userName}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {userEmail}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <Link
                    to="/profile"
                    onClick={() =>
                      setIsMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-white"
                  >
                    <User size={17} />
                    My Profile
                  </Link>

                  <Link
                    to="/appointments"
                    onClick={() =>
                      setIsMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-white"
                  >
                    <CalendarDays size={17} />
                    My Appointments
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* =========================
   Desktop Nav Link
========================= */

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sm font-medium text-slate-600 transition hover:text-teal-600"
    >
      {children}
    </Link>
  );
}

/* =========================
   Mobile Nav Link
========================= */

function MobileNavLink({
  to,
  children,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-teal-600"
    >
      {children}
    </Link>
  );
}

export default Navbar;
