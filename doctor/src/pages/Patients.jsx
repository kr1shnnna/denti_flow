
import { useEffect, useMemo, useState } from "react";
import { Eye, Search, X } from "lucide-react";
import { getDoctorAppointments } from "../services/api";

const Patients = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Fetch doctor's appointments
  // =========================

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDoctorAppointments();

        console.log("Doctor appointments:", data);

        setAppointments(data.appointments || []);
      } catch (error) {
        console.error(
          "Failed to fetch appointments:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load patients."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // =========================
  // Create unique patients
  // =========================

  const patients = useMemo(() => {
    const patientMap = new Map();

    appointments.forEach((appointment) => {
      const patient = appointment.patient;

      if (!patient?._id) return;

      if (!patientMap.has(patient._id)) {
        patientMap.set(patient._id, {
          id: patient._id,
          name: patient.name || "Unknown patient",
          email: patient.email || "—",
          phone: patient.phone || "—",
          appointments: [],
        });
      }

      patientMap
        .get(patient._id)
        .appointments.push(appointment);
    });

    return Array.from(patientMap.values()).map(
      (patient) => {
        const sortedAppointments = [
          ...patient.appointments,
        ].sort(
          (a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        return {
          ...patient,
          appointments: sortedAppointments,
          appointmentCount:
            sortedAppointments.length,
          lastAppointment:
            sortedAppointments[0] || null,
        };
      }
    );
  }, [appointments]);

  // =========================
  // Search
  // =========================

  const filteredPatients = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    if (!searchValue) return patients;

    return patients.filter((patient) => {
      return (
        patient.name
          .toLowerCase()
          .includes(searchValue) ||
        patient.email
          .toLowerCase()
          .includes(searchValue) ||
        patient.phone
          .toLowerCase()
          .includes(searchValue)
      );
    });
  }, [patients, search]);

  // =========================
  // Helpers
  // =========================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (timeSlot) => {
    if (!timeSlot) return "—";

    const [hours, minutes] =
      timeSlot.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
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

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  // =========================
  // Render
  // =========================

  return (
    <>
      <div>
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Patients
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View patients who have appointments
            with you.
          </p>
        </div>

        {/* Search */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>

        {/* Patient Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-slate-500">
                Loading patients...
              </p>
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-red-500">
                {error}
              </p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-slate-700">
                No patients found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Patients will appear here once they
                have appointments with you.
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
                      Contact
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Appointments
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Last Appointment
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
                  {filteredPatients.map(
                    (patient) => (
                      <tr
                        key={patient.id}
                        className="border-b border-slate-100 last:border-b-0 transition hover:bg-slate-50/60"
                      >
                        {/* Patient */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-800">
                            {patient.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {patient.email}
                          </p>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {patient.phone}
                        </td>

                        {/* Appointment Count */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-700">
                            {patient.appointmentCount}
                          </span>
                        </td>

                        {/* Last Appointment */}
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-700">
                            {formatDate(
                              patient.lastAppointment
                                ?.date
                            )}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {formatTime(
                              patient.lastAppointment
                                ?.timeSlot
                            )}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                              patient.lastAppointment
                                ?.status
                            )}`}
                          >
                            {formatStatus(
                              patient.lastAppointment
                                ?.status
                            )}
                          </span>
                        </td>

                        {/* View */}
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPatient(
                                patient
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

      {/* ========================= */}
      {/* Patient Details Modal */}
      {/* ========================= */}

      {selectedPatient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedPatient(null)
          }
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Patient Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Patient information and appointment
                  history.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedPatient(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={19} />
              </button>
            </div>

            {/* Patient Information */}
            <div className="px-6 py-6">
              <div className="rounded-xl bg-slate-50 p-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Name
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedPatient.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {selectedPatient.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {selectedPatient.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Total Appointments
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedPatient.appointmentCount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment History */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-800">
                  Appointment History
                </h3>

                <div className="mt-3 overflow-hidden rounded-xl border border-slate-100">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Date
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Time
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Reason
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedPatient.appointments.map(
                        (appointment) => (
                          <tr
                            key={appointment._id}
                            className="border-b border-slate-100 last:border-b-0"
                          >
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {formatDate(
                                appointment.date
                              )}
                            </td>

                            <td className="px-4 py-3 text-sm text-slate-700">
                              {formatTime(
                                appointment.timeSlot
                              )}
                            </td>

                            <td className="px-4 py-3 text-sm text-slate-600">
                              {appointment.reason ||
                                "—"}
                            </td>

                            <td className="px-4 py-3">
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
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setSelectedPatient(null)
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

export default Patients;

