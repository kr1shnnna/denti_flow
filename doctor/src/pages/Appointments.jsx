
import { useEffect, useMemo, useState } from "react";
import { Eye, Search, X } from "lucide-react";
import { getDoctorAppointments } from "../services/api";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDoctorAppointments();

        console.log("Doctor appointments:", data);

        setAppointments(data.appointments || []);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load appointments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const patientName =
        appointment.patient?.name || "";

      const reason =
        appointment.reason || "";

      const searchValue = search.toLowerCase();

      const matchesSearch =
        patientName
          .toLowerCase()
          .includes(searchValue) ||
        reason
          .toLowerCase()
          .includes(searchValue);

      const appointmentStatus =
        appointment.status?.toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        appointmentStatus ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeSlot) => {
    if (!timeSlot) return "—";

    const [hours, minutes] = timeSlot.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-600";

      case "confirmed":
        return "bg-blue-50 text-blue-600";

      case "pending":
        return "bg-yellow-50 text-yellow-600";

      case "cancelled":
      case "canceled":
        return "bg-red-50 text-red-600";

      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const filters = [
    "All",
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
  ];

  return (
    <>
      <div>
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Appointments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and view your patient appointments.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          {/* Search */}
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search patient or appointment..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {/* Status Filters */}
          <div className="mt-5 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() =>
                  setStatusFilter(filter)
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  statusFilter === filter
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Appointment Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-slate-500">
                Loading appointments...
              </p>
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-red-500">
                {error}
              </p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-slate-700">
                No appointments found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or status
                filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Time
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Reason
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map(
                    (appointment) => (
                      <tr
                        key={appointment._id}
                        className="border-b border-slate-100 last:border-b-0 transition hover:bg-slate-50/60"
                      >
                        {/* Patient */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-800">
                            {appointment.patient
                              ?.name ||
                              "Unknown patient"}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {appointment.patient
                              ?.email || ""}
                          </p>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(
                            appointment.date
                          )}
                        </td>

                        {/* Time */}
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {formatTime(
                            appointment.timeSlot
                          )}
                        </td>

                        {/* Reason */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {appointment.reason ||
                            "—"}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                              appointment.status
                            )}`}
                          >
                            {formatStatus(
                              appointment.status
                            )}
                          </span>
                        </td>

                        {/* View */}
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedAppointment(
                                appointment
                              )
                            }
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 transition hover:text-teal-700"
                          >
                            <Eye
                              size={16}
                              strokeWidth={1.8}
                            />

                            View
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedAppointment(null)
          }
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Appointment Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Patient appointment information
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedAppointment(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 px-6 py-6">
              {/* Patient */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Patient
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {selectedAppointment.patient
                    ?.name ||
                    "Unknown patient"}
                </p>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDate(
                      selectedAppointment.date
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Time
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatTime(
                      selectedAppointment.timeSlot
                    )}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Reason
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {selectedAppointment.reason ||
                    "Not provided"}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                    selectedAppointment.status
                  )}`}
                >
                  {formatStatus(
                    selectedAppointment.status
                  )}
                </span>
              </div>

              {/* Contact */}
              <div className="border-t border-slate-100 pt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Patient Contact
                </p>

                <div className="mt-2 space-y-1">
                  <p className="text-sm text-slate-700">
                    {selectedAppointment.patient
                      ?.phone ||
                      "No phone number"}
                  </p>

                  <p className="text-sm text-slate-500">
                    {selectedAppointment.patient
                      ?.email ||
                      "No email address"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setSelectedAppointment(null)
                }
                className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Appointments;

