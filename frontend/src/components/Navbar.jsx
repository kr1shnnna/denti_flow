import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  User,
  CalendarDays,
  LogOut,
  Menu,
  X,
  Bell,
  CheckCheck,
  Clock,
} from "lucide-react";

import socket from "../services/socket";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/api";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationLoading, setNotificationLoading] =
    useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // =========================
  // Load Patient
  // =========================

  const loadPatient = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      setUser(null);
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Invalid stored patient data:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  // =========================
  // Authentication Listener
  // =========================

  useEffect(() => {
    loadPatient();

    window.addEventListener("auth-change", loadPatient);

    return () => {
      window.removeEventListener(
        "auth-change",
        loadPatient
      );
    };
  }, []);

  // =========================
  // Fetch Existing Notifications
  // =========================

  const loadNotifications = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setNotificationLoading(true);

      const data = await getNotifications();

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );
    } finally {
      setNotificationLoading(false);
    }
  };

  // =========================
  // Socket.IO
  // =========================

  useEffect(() => {
    if (!user?._id) {
      socket.disconnect();
      return;
    }

    // Load notifications already stored in DB
    loadNotifications();

    // Connect socket
    socket.connect();

    // Join patient's private room
    socket.emit("join", user._id);

    console.log(
      "Patient connected to notification socket:",
      user._id
    );

    // New real-time notification
    const handleAppointmentNotification = (
      notification
    ) => {
      console.log(
        "New real-time notification:",
        notification
      );

      setNotifications((previous) => {
        // Prevent duplicate notification
        const alreadyExists = previous.some(
          (item) => item._id === notification._id
        );

        if (alreadyExists) {
          return previous;
        }

        return [notification, ...previous];
      });

      setUnreadCount((previous) => previous + 1);
    };

    socket.on(
      "appointment_notification",
      handleAppointmentNotification
    );

    return () => {
      socket.off(
        "appointment_notification",
        handleAppointmentNotification
      );

      socket.disconnect();
    };
  }, [user]);

  // =========================
  // Close Dropdowns
  // =========================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================
  // Open Notifications
  // =========================

  const handleNotificationToggle = () => {
    setIsNotificationOpen(
      (previous) => !previous
    );

    setIsDropdownOpen(false);
  };

  // =========================
  // Mark One Notification Read
  // =========================

  const handleNotificationClick = async (
    notification
  ) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(
          notification._id
        );

        setNotifications((previous) =>
          previous.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  isRead: true,
                }
              : item
          )
        );

        setUnreadCount((previous) =>
          Math.max(previous - 1, 0)
        );
      }

      // If notification belongs to an appointment,
      // take patient to appointments page.
      if (notification.appointment) {
        setIsNotificationOpen(false);
        navigate("/appointments");
      }
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  // =========================
  // Mark All Read
  // =========================

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      await markAllNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark notifications as read:",
        error
      );
    }
  };

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    socket.disconnect();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setNotifications([]);
    setUnreadCount(0);

    setIsDropdownOpen(false);
    setIsNotificationOpen(false);
    setIsMobileMenuOpen(false);

    window.dispatchEvent(
      new Event("auth-change")
    );

    navigate("/");
  };

  // =========================
  // Patient Information
  // =========================

  const patientName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "Patient";

  const patientEmail = user?.email || "";

  const avatarLetter = patientName
    .charAt(0)
    .toUpperCase();

  // =========================
  // Notification Time
  // =========================

  const formatNotificationTime = (date) => {
    if (!date) {
      return "";
    }

    const notificationDate = new Date(date);
    const now = new Date();

    const difference =
      Math.floor(
        (now - notificationDate) / 1000
      );

    if (difference < 60) {
      return "Just now";
    }

    if (difference < 3600) {
      return `${Math.floor(
        difference / 60
      )} min ago`;
    }

    if (difference < 86400) {
      return `${Math.floor(
        difference / 3600
      )} hr ago`;
    }

    if (difference < 604800) {
      return `${Math.floor(
        difference / 86400
      )} day ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* =========================
            Logo
        ========================= */}

        <Link
          to="/"
          className="shrink-0"
          onClick={() =>
            setIsMobileMenuOpen(false)
          }
        >
          <img
            src="/logo/dentiflow-logo.png"
            alt="DentiFlow"
            className="h-10 w-auto object-contain"
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

          <Link
            to="/appointments"
            className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            Book Appointment
          </Link>

          {/* =========================
              Logged Out
          ========================= */}

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
               Logged In Patient
            ========================= */

            <div className="flex items-center gap-2">

              {/* =========================
                  Notification Bell
              ========================= */}

              <div
                ref={notificationRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={
                    handleNotificationToggle
                  }
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-teal-600"
                  aria-label="Notifications"
                >
                  <Bell size={19} />

                  {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount > 9
                        ? "9+"
                        : unreadCount}
                    </span>
                  )}
                </button>

                {/* =========================
                    Notification Dropdown
                ========================= */}

                {isNotificationOpen && (
                  <div className="absolute right-0 top-14 w-96 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60">

                    {/* Header */}

                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">

                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          Notifications
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {unreadCount > 0
                            ? `${unreadCount} unread`
                            : "You're all caught up"}
                        </p>
                      </div>

                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={
                            handleMarkAllAsRead
                          }
                          className="flex items-center gap-1 text-xs font-semibold text-teal-600 transition hover:text-teal-700"
                        >
                          <CheckCheck size={14} />
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notification List */}

                    <div className="max-h-[420px] overflow-y-auto">

                      {notificationLoading ? (
                        <div className="flex items-center justify-center px-4 py-10">
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="px-6 py-10 text-center">

                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                            <Bell size={20} />
                          </div>

                          <p className="mt-3 text-sm font-medium text-slate-700">
                            No notifications
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            We'll let you know when something important happens.
                          </p>

                        </div>
                      ) : (
                        notifications.map(
                          (notification) => (
                            <button
                              key={
                                notification._id
                              }
                              type="button"
                              onClick={() =>
                                handleNotificationClick(
                                  notification
                                )
                              }
                              className={`flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
                                !notification.isRead
                                  ? "bg-teal-50/40"
                                  : "bg-white"
                              }`}
                            >

                              {/* Status Icon */}

                              <div
                                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                  notification.type ===
                                  "appointment_confirmed"
                                    ? "bg-green-50 text-green-600"
                                    : notification.type ===
                                        "appointment_cancelled"
                                      ? "bg-red-50 text-red-600"
                                      : "bg-teal-50 text-teal-600"
                                }`}
                              >
                                <CalendarDays
                                  size={17}
                                />
                              </div>

                              {/* Content */}

                              <div className="min-w-0 flex-1">

                                <div className="flex items-start justify-between gap-2">

                                  <p
                                    className={`text-sm ${
                                      !notification.isRead
                                        ? "font-semibold text-slate-900"
                                        : "font-medium text-slate-700"
                                    }`}
                                  >
                                    {notification.title}
                                  </p>

                                  {!notification.isRead && (
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-600" />
                                  )}

                                </div>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                  {notification.message}
                                </p>

                                {notification.appointment && (
                                  <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                                    <Clock size={12} />

                                    <span>
                                      {notification
                                        .appointment
                                        .timeSlot ||
                                        ""}
                                    </span>

                                    {notification
                                      .appointment
                                      .status && (
                                      <>
                                        <span>
                                          •
                                        </span>

                                        <span className="capitalize">
                                          {
                                            notification
                                              .appointment
                                              .status
                                          }
                                        </span>
                                      </>
                                    )}
                                  </div>
                                )}

                                <p className="mt-2 text-[11px] text-slate-400">
                                  {formatNotificationTime(
                                    notification.createdAt
                                  )}
                                </p>

                              </div>
                            </button>
                          )
                        )
                      )}

                    </div>

                    {/* Footer */}

                    {notifications.length > 0 && (
                      <div className="border-t border-slate-100 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsNotificationOpen(
                              false
                            );
                            navigate(
                              "/appointments"
                            );
                          }}
                          className="w-full text-center text-xs font-semibold text-teal-600 transition hover:text-teal-700"
                        >
                          View My Appointments
                        </button>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* =========================
                  Patient Dropdown
              ========================= */}

              <div
                ref={dropdownRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(
                      (previous) => !previous
                    );

                    setIsNotificationOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-teal-600 text-sm font-bold text-white">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={patientName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      avatarLetter
                    )}
                  </div>

                  <span className="max-w-28 truncate text-sm font-semibold text-slate-700">
                    {patientName}
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

                {isDropdownOpen && (
                  <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60">

                    {/* Patient Info */}

                    <div className="border-b border-slate-100 px-4 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                          {avatarLetter}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {patientName}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {patientEmail}
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Menu */}

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

                        <span>
                          My Profile
                        </span>
                      </Link>

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

                        <span>
                          My Appointments
                        </span>
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

                        <span>
                          Logout
                        </span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
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
                      {patientName}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {patientEmail}
                    </p>
                  </div>

                </div>

                <div className="mt-4 space-y-1">

                  {/* Notifications */}

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsNotificationOpen(true);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-white"
                  >
                    <span className="flex items-center gap-3">
                      <Bell size={17} />
                      Notifications
                    </span>

                    {unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 9
                          ? "9+"
                          : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Profile */}

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

                  {/* Appointments */}

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

                  {/* Logout */}

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

// =========================
// Desktop Navigation Link
// =========================

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

// =========================
// Mobile Navigation Link
// =========================

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