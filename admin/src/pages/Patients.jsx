
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  X,
} from "lucide-react";

import { getPatients } from "../services/api";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPatients();

      setPatients(data.patients || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load patients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return patients;
    }

    return patients.filter((patient) => {
      const name =
        patient.name?.toLowerCase() || "";

      const email =
        patient.email?.toLowerCase() || "";

      const phone =
        patient.phone?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue)
      );
    });
  }, [patients, search]);

  const totalPatients = patients.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-teal-600">
          Management
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Patients
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View and manage registered patients.
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

      {/* Summary Card */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Total Patients"
          value={totalPatients}
          icon={<Users size={21} />}
          iconClass="bg-teal-50 text-teal-600"
        />
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
            placeholder="Search by name, email or phone..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/10"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Patient List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredPatients.length} patient
              {filteredPatients.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : filteredPatients.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Patient
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Registered
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="transition hover:bg-slate-50/60"
                  >
                    {/* Patient */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-teal-50 text-teal-600">
                          {patient.profileImage ? (
                            <img
                              src={
                                patient.profileImage.startsWith(
                                  "http"
                                )
                                  ? patient.profileImage
                                  : `http://localhost:5000${patient.profileImage}`
                              }
                              alt={patient.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserRound size={19} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {patient.name || "Unknown"}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            Patient
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail
                          size={15}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="truncate">
                          {patient.email || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone
                          size={15}
                          className="shrink-0 text-slate-400"
                        />

                        <span>
                          {patient.phone || "Not provided"}
                        </span>
                      </div>
                    </td>

                    {/* Registered */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays
                          size={15}
                          className="text-slate-400"
                        />

                        {formatDate(patient.createdAt)}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-5 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPatient(patient)
                        }
                        className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() =>
            setSelectedPatient(null)
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
        Loading patients...
      </div>
    </div>
  );
}

function EmptyState({ search }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Users size={25} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        No patients found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        {search
          ? "No patients match your search."
          : "There are no registered patients yet."}
      </p>
    </div>
  );
}

function PatientDetailsModal({
  patient,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Patient Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Patient account information.
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

        {/* Profile */}
        <div className="flex flex-col items-center border-b border-slate-200 px-6 py-7">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-teal-50 text-teal-600">
            {patient.profileImage ? (
              <img
                src={
                  patient.profileImage.startsWith(
                    "http"
                  )
                    ? patient.profileImage
                    : `http://localhost:5000${patient.profileImage}`
                }
                alt={patient.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound size={32} />
            )}
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            {patient.name || "Unknown Patient"}
          </h3>
        </div>

        {/* Details */}
        <div className="space-y-4 p-6">
          <DetailRow
            icon={<Mail size={17} />}
            label="Email"
            value={patient.email || "Not provided"}
          />

          <DetailRow
            icon={<Phone size={17} />}
            label="Phone"
            value={patient.phone || "Not provided"}
          />

          <DetailRow
            icon={<CalendarDays size={17} />}
            label="Registered"
            value={formatDate(patient.createdAt)}
          />

          <DetailRow
            icon={<UserRound size={17} />}
            label="Role"
            value={patient.role || "patient"}
          />
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

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default Patients;
