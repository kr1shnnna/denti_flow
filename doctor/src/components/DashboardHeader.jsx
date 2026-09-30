
import { useEffect, useRef, useState } from "react";
import { Bell, CalendarDays, CheckCircle2, XCircle, Clock } from "lucide-react";

import {
  getMyDoctorProfile,
  getDoctorNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/api";

const DashboardHeader = () => {
  // =========================
  // Doctor
  // =========================

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // Notifications
  // =========================

  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const notificationRef = useRef(null);

  // =========================
  // Fetch doctor profile
  // =========================

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const data = await getMyDoctorProfile();
        setDoctor(data.doctor);
      } catch (error) {
        console.error("Failed to fetch doctor profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  // =========================
  // Fetch notifications
  // =========================

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setNotificationLoading(true);

        const data = await getDoctorNotifications();

        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setNotificationLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // =========================
  // Close dropdown when clicking outside
  // =========================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================
  // Mark notification as read
  // =========================

  const handleNotificationClick = async (notification) => {
    if (notification.isRead) {
      return;
    }

    try {
      await markNotificationAsRead(notification._id);

      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // =========================
  // Mark all notifications as read
  // =========================

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // =========================
  // Unread count
  // =========================

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // =========================
  // Notification icon
  // =========================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment_booked":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <CalendarDays size={17} />
          </div>
        );

      case "appointment_confirmed":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={17} />
          </div>
        );

      case "appointment_cancelled":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <XCircle size={17} />
          </div>
        );

      default:
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Clock size={17} />
          </div>
        );
    }
  };

  // =========================
  // Notification date
  // =========================

  const formatNotificationDate = (createdAt) => {
    if (!createdAt) {
      return "";
    }

    return new Date(createdAt).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // =========================
  // Date
  // =========================

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <header className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-8 w-64 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />
      </header>
    );
  }

  // =========================
  // Doctor not found
  // =========================

  if (!doctor) {
    return (
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back
        </h1>

        <p className="mt-1 text-sm text-red-500">
          Unable to load doctor profile.
        </p>
      </header>
    );
  }

  // =========================
  // Doctor information
  // =========================

  const doctorName = doctor.user?.name || "Doctor";

  const specialization = doctor.specialization || "Dentist";

  const cleanName = doctorName.replace(/^Dr\.?\s*/i, "");

  const firstName = cleanName.split(" ")[0];

  // =========================
  // Profile image
  // =========================

  const rawProfileImage =
    doctor.user?.profileImage || doctor.image;

  const profileImage = rawProfileImage
    ? rawProfileImage.startsWith("http")
      ? rawProfileImage
      : `http://localhost:5000${rawProfileImage}`
    : null;

  // =========================
  // Initials
  // =========================

  const initials = cleanName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="mb-8 flex items-center justify-between">
      {/* Greeting */}

      <div>
        <p className="mb-1 text-sm font-medium text-slate-500">
          {formattedDate}
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Good morning, {firstName} 👋
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with your appointments today.
        </p>
      </div>

      {/* Right side */}

      <div className="flex items-center gap-5">
        {/* =========================
            Notification Bell
        ========================= */}

        <div
          ref={notificationRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() => setNotificationOpen((current) => !current)}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            aria-label="Notifications"
            aria-expanded={notificationOpen}
            aria-haspopup="true"
          >
            <Bell size={20} strokeWidth={1.8} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* =========================
              Notification Dropdown
          ========================= */}

          {notificationOpen && (
            <div className="fixed inset-x-4 top-20 z-[100] w-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl md:absolute md:inset-x-auto md:right-0 md:top-14 md:w-[22rem]">
              {/* Dropdown Header */}

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
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
                    onClick={handleMarkAllRead}
                    className="text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notification List */}

              <div className="max-h-80 overflow-y-auto">
                {notificationLoading ? (
                  <div className="px-5 py-10 text-center text-sm text-slate-400">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <Bell
                      size={25}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-medium text-slate-600">
                      No notifications
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      New appointment updates will appear here.
                    </p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <button
                      key={notification._id}
                      type="button"
                      onClick={() =>
                        handleNotificationClick(notification)
                      }
                      className={`flex w-full gap-3 border-b border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50 ${
                        !notification.isRead
                          ? "bg-teal-50/40"
                          : "bg-white"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm ${
                              notification.isRead
                                ? "font-medium text-slate-700"
                                : "font-semibold text-slate-900"
                            }`}
                          >
                            {notification.title || "Notification"}
                          </p>

                          {!notification.isRead && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                          )}
                        </div>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                          {notification.message}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {formatNotificationDate(
                            notification.createdAt
                          )}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}

              {notifications.length > 5 && (
                <div className="border-t border-slate-100 px-5 py-3 text-center">
                  <p className="text-xs text-slate-400">
                    Showing your 5 most recent notifications
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}

        <div className="h-10 w-px bg-slate-200" />

        {/* Doctor Profile */}

        <div className="flex items-center gap-3">
          {profileImage ? (
            <img
              src={profileImage}
              alt={doctorName}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
              {initials}
            </div>
          )}

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {doctorName}
            </p>

            <p className="text-xs text-slate-500">
              {specialization}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

