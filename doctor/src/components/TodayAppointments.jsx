
import { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getDoctorAppointments } from "../services/api";

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDoctorAppointments();

        console.log("Doctor appointments:", data);

        const allAppointments = data.appointments || [];

        // Get today's date in local YYYY-MM-DD format
        const today = new Date();
        const todayString = today.toLocaleDateString("en-CA");

        // Only show today's non-cancelled appointments
        const todaysAppointments = allAppointments.filter(
          (appointment) => {
            const appointmentDate = new Date(
              appointment.date
            ).toLocaleDateString("en-CA");

            return (
              appointmentDate === todayString &&
              appointment.status?.toLowerCase() !== "cancelled" &&
              appointment.status?.toLowerCase() !== "canceled"
            );
          }
        );

        // Sort appointments by time
        todaysAppointments.sort((a, b) =>
          a.timeSlot.localeCompare(b.timeSlot)
        );

        setAppointments(todaysAppointments);
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

  const formatTime = (timeSlot) => {
    if (!timeSlot) return "—";

    const [hours, minutes] = timeSlot.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-600";

      case "in progress":
        return "bg-amber-50 text-amber-600";

      case "confirmed":
        return "bg-blue-50 text-blue-600";

      case "pending":
        return "bg-yellow-50 text-yellow-600";

      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <>
      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Today's Appointments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your scheduled appointments for today
            </p>
          </div>

          <Link
            to="/appointments"
            className="text-sm font-medium text-teal-600 transition hover:text-teal-700"
          >
            View all
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="px-6 py-10 text-center text-sm text-slate-500">
            Loading appointments...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="px-6 py-10 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && appointments.length === 0 && (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">
              No appointments today
            </p>

            <p className="mt-1 text-sm text-slate-500">
              You don't have any appointments scheduled for today.
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && appointments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Time
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Patient
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Service
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="border-b border-slate-100 last:border-b-0 transition hover:bg-slate-50/60"
                  >
                    {/* Time */}
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {formatTime(appointment.timeSlot)}
                    </td>

                    {/* Patient */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-800">
                        {appointment.patient?.name ||
                          "Unknown patient"}
                      </p>
                    </td>

                    {/* Service */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {appointment.reason ||
                        "Appointment"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Appointment Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Appointment information
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedAppointment(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close"
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
                  {selectedAppointment.patient?.name ||
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
                  {selectedAppointment.status}
                </span>
              </div>

              {/* Contact */}
              <div className="border-t border-slate-100 pt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Patient Contact
                </p>

                <div className="mt-2 space-y-1">
                  <p className="text-sm text-slate-700">
                    {selectedAppointment.patient?.phone ||
                      "No phone number"}
                  </p>

                  <p className="text-sm text-slate-500">
                    {selectedAppointment.patient?.email ||
                      "No email address"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
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

export default TodayAppointments;


