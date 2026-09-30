
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { getDoctorAppointments } from "../services/api";

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDoctorAppointments();

        console.log("Doctor appointments:", data);

        // Backend currently returns { appointments: [...] }
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

      case "cancelled":
      case "canceled":
        return "bg-red-50 text-red-600";

      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const formatTime = (time) => {
    if (!time) return "—";

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getPatientName = (appointment) => {
    return (
      appointment.patient?.name ||
      appointment.patientName ||
      "Unknown patient"
    );
  };

  const getServiceName = (appointment) => {
    return (
      appointment.service ||
      appointment.serviceName ||
      appointment.reason ||
      "Appointment"
    );
  };

  return (
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

        <button
          type="button"
          className="text-sm font-medium text-teal-600 transition hover:text-teal-700"
        >
          View all
        </button>
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
                    {formatTime(appointment.time)}
                  </td>

                  {/* Patient */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-800">
                      {getPatientName(appointment)}
                    </p>
                  </td>

                  {/* Service */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {getServiceName(appointment)}
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

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 transition hover:text-teal-700"
                    >
                      <Eye size={16} strokeWidth={1.8} />
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
  );
};

export default TodayAppointments;

