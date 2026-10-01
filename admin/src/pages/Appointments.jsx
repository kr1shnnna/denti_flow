
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  XCircle,
  Eye,
  X,
  UserRound,
  Stethoscope,
} from "lucide-react";

import {
  getAdminAppointments,
  updateAppointmentStatus,
} from "../services/api";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isToday = (date) => {
  if (!date) return false;

  const appointmentDate = new Date(date);
  const today = new Date();

  return (
    appointmentDate.getDate() === today.getDate() &&
    appointmentDate.getMonth() === today.getMonth() &&
    appointmentDate.getFullYear() === today.getFullYear()
  );
};

const getStatusClasses = (status) => {
  switch (status) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

    case "pending":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";

    case "completed":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";

    case "cancelled":
      return "bg-red-50 text-red-700 ring-red-600/20";

    default:
      return "bg-slate-50 text-slate-600 ring-slate-600/20";
  }
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status.charAt(0).toUpperCase() + status.slice(1);
};

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminAppointments();

      setAppointments(data.appointments || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);

      await updateAppointmentStatus(
        appointmentId,
        status
      );

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status,
              }
            : appointment
        )
      );

      setSelectedAppointment((current) =>
        current?._id === appointmentId
          ? {
              ...current,
              status,
            }
          : current
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update appointment status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const patientName =
        appointment.patient?.name?.toLowerCase() || "";

      const patientEmail =
        appointment.patient?.email?.toLowerCase() || "";

      const doctorName =
        appointment.doctor?.user?.name?.toLowerCase() || "";

      const doctorSpecialization =
        appointment.doctor?.specialization?.toLowerCase() || "";

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        patientName.includes(searchValue) ||
        patientEmail.includes(searchValue) ||
        doctorName.includes(searchValue) ||
        doctorSpecialization.includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        appointment.status === statusFilter;

      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" &&
          isToday(appointment.date));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    appointments,
    search,
    statusFilter,
    dateFilter,
  ]);

  const totalAppointments = appointments.length;

  const todayAppointments = appointments.filter((appointment) =>
    isToday(appointment.date)
  ).length;

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  ).length;

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-teal-600">
          Management
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Appointments
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage and monitor all clinic appointments.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="font-medium hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Appointments"
          value={totalAppointments}
          icon={<CalendarDays size={21} />}
          iconClass="bg-teal-50 text-teal-600"
        />

        <SummaryCard
          title="Today's Appointments"
          value={todayAppointments}
          icon={<Clock3 size={21} />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          title="Pending"
          value={pendingAppointments}
          icon={<Clock3 size={21} />}
          iconClass="bg-amber-50 text-amber-600"
        />

        <SummaryCard
          title="Confirmed"
          value={confirmedAppointments}
          icon={<CheckCircle2 size={21} />}
          iconClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search patient or doctor..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/10"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Status */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">
                Confirmed
              </option>
              <option value="completed">
                Completed
              </option>
              <option value="cancelled">
                Cancelled
              </option>
            </select>

            {/* Date */}
            <select
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(event.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Appointment List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredAppointments.length} appointment
                {filteredAppointments.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : filteredAppointments.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Patient
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Doctor
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date & Time
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map(
                  (appointment) => {
                    const patient =
                      appointment.patient;

                    const doctor =
                      appointment.doctor;

                    return (
                      <tr
                        key={appointment._id}
                        className="transition hover:bg-slate-50/60"
                      >
                        {/* Patient */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                              <UserRound size={19} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {patient?.name ||
                                  "Unknown patient"}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-slate-500">
                                {patient?.email || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Doctor */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-teal-50 text-teal-600">
                              {doctor?.user
                                ?.profileImage ? (
                                <img
                                  src={
                                    doctor.user
                                      .profileImage.startsWith(
                                        "http"
                                      )
                                      ? doctor.user
                                          .profileImage
                                      : `http://localhost:5000${doctor.user.profileImage}`
                                  }
                                  alt={
                                    doctor.user.name
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Stethoscope
                                  size={19}
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {doctor?.user?.name ||
                                  "Unknown doctor"}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-slate-500">
                                {doctor?.specialization ||
                                  "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-slate-800">
                            {formatDate(
                              appointment.date
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {appointment.timeSlot ||
                              "—"}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClasses(
                              appointment.status
                            )}`}
                          >
                            {formatStatus(
                              appointment.status
                            )}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedAppointment(
                                  appointment
                                )
                              }
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                            >
                              <Eye size={15} />
                              View
                            </button>

                            {appointment.status ===
                              "pending" && (
                              <>
                                <button
                                  type="button"
                                  disabled={
                                    updatingId ===
                                    appointment._id
                                  }
                                  onClick={() =>
                                    handleStatusUpdate(
                                      appointment._id,
                                      "confirmed"
                                    )
                                  }
                                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <CheckCircle2
                                    size={15}
                                  />
                                  Confirm
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    updatingId ===
                                    appointment._id
                                  }
                                  onClick={() =>
                                    handleStatusUpdate(
                                      appointment._id,
                                      "cancelled"
                                    )
                                  }
                                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <XCircle
                                    size={15}
                                  />
                                  Cancel
                                </button>
                              </>
                            )}

                            {appointment.status ===
                              "confirmed" && (
                              <button
                                type="button"
                                disabled={
                                  updatingId ===
                                  appointment._id
                                }
                                onClick={() =>
                                  handleStatusUpdate(
                                    appointment._id,
                                    "completed"
                                  )
                                }
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <CheckCircle2
                                  size={15}
                                />
                                Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() =>
            setSelectedAppointment(null)
          }
        />
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />
        Loading appointments...
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <CalendarDays size={25} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        No appointments found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        There are no appointments matching your
        current search or filters.
      </p>
    </div>
  );
}

function AppointmentDetailsModal({
  appointment,
  onClose,
}) {
  const patient = appointment.patient;
  const doctor = appointment.doctor;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Appointment Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View complete appointment information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-6 p-6">
          {/* Status */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClasses(
                  appointment.status
                )}`}
              >
                {formatStatus(appointment.status)}
              </span>
            </div>

            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Appointment Date
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatDate(appointment.date)}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {appointment.timeSlot || "—"}
              </p>
            </div>
          </div>

          {/* Patient */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Patient
            </p>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {patient?.name || "—"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {patient?.email || "—"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {patient?.phone || "Phone not available"}
              </p>
            </div>
          </div>

          {/* Doctor */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Doctor
            </p>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {doctor?.user?.name || "—"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {doctor?.specialization || "—"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {doctor?.user?.email || "—"}
              </p>
            </div>
          </div>

          {/* Reason */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Reason for Visit
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm leading-6 text-slate-700">
                {appointment.reason ||
                  "No reason provided."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Appointments;