
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Stethoscope,
  Users,
  ArrowRight,
  UserPlus,
  CalendarPlus,
  UserRoundPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getPatients,
  getDoctors,
  getAdminAppointments,
} from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [patientsData, doctorsData, appointmentsData] =
          await Promise.all([
            getPatients(),
            getDoctors(),
            getAdminAppointments(),
          ]);

        setPatients(patientsData.patients || []);
        setDoctors(doctorsData.doctors || []);
        setAppointments(appointmentsData.appointments || []);
      } catch (error) {
        console.error("Dashboard data error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // =========================
  // Today's appointments
  // =========================

  const todayAppointments = useMemo(() => {
    const today = new Date();

    return appointments.filter((appointment) => {
      if (!appointment.date) return false;

      const appointmentDate = new Date(appointment.date);

      return (
        appointmentDate.getFullYear() === today.getFullYear() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getDate() === today.getDate()
      );
    });
  }, [appointments]);

  // =========================
  // Pending appointments
  // =========================

  const pendingAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => appointment.status === "pending"
    );
  }, [appointments]);

  // =========================
  // Recent appointments
  // =========================

  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort((a, b) => {
        const dateA = new Date(
          a.createdAt || a.date || 0
        );

        const dateB = new Date(
          b.createdAt || b.date || 0
        );

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [appointments]);

  // =========================
  // Format date
  // =========================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-8 w-56 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>

        <div className="h-80 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* =========================
          Page Heading
      ========================== */}
      <div>
        <p className="mb-1 text-sm font-medium text-teal-600">
          Overview
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening across your clinic.
        </p>
      </div>

      {/* =========================
          Error
      ========================== */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* =========================
          Stats
      ========================== */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Patients */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Patients
              </p>

              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {patients.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Users size={21} strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* Doctors */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Doctors
              </p>

              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {doctors.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Stethoscope size={21} strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* Today's appointments */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Today's Appointments
              </p>

              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {todayAppointments.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <CalendarDays size={21} strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending Appointments
              </p>

              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {pendingAppointments.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={21} strokeWidth={1.8} />
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          Main Grid
      ========================== */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Recent Appointments */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Appointments
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest appointment activity
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/appointments")}
              className="flex items-center gap-1 text-sm font-medium text-teal-600 transition hover:text-teal-700"
            >
              View all
              <ArrowRight size={16} />
            </button>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <CalendarDays
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm text-slate-500">
                No appointments found.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentAppointments.map((appointment) => {
                const patient =
                  appointment.patient?.name || "Patient";

                const doctor =
                  appointment.doctor?.user?.name ||
                  appointment.doctor?.name ||
                  "Doctor";

                return (
                  <div
                    key={appointment._id}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {patient}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        Dr. {doctor.replace(/^Dr\.?\s*/i, "")}
                      </p>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="text-sm text-slate-700">
                        {formatDate(appointment.date)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {appointment.timeSlot || "—"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        appointment.status === "confirmed"
                          ? "bg-teal-50 text-teal-700"
                          : appointment.status === "pending"
                          ? "bg-amber-50 text-amber-700"
                          : appointment.status === "cancelled"
                          ? "bg-red-50 text-red-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {appointment.status || "unknown"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Common administrative tasks
            </p>
          </div>

          <div className="space-y-3 p-5">
            <button
              type="button"
              onClick={() => navigate("/doctors")}
              className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-teal-200 hover:bg-teal-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <UserPlus size={19} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  Manage Doctors
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  View and manage doctors
                </p>
              </div>

              <ArrowRight
                size={17}
                className="ml-auto text-slate-400"
              />
            </button>

            <button
              type="button"
              onClick={() => navigate("/appointments")}
              className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-teal-200 hover:bg-teal-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <CalendarPlus size={19} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  View Appointments
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Manage clinic appointments
                </p>
              </div>

              <ArrowRight
                size={17}
                className="ml-auto text-slate-400"
              />
            </button>

            <button
              type="button"
              onClick={() => navigate("/patients")}
              className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-teal-200 hover:bg-teal-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <UserRoundPlus size={19} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  View Patients
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Browse registered patients
                </p>
              </div>

              <ArrowRight
                size={17}
                className="ml-auto text-slate-400"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
