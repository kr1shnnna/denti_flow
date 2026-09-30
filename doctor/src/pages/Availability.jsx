
import { useEffect, useState } from "react";
import {
  Clock,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  getMyDoctorProfile,
  updateMyDoctorAvailability,
} from "../services/api";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const createDefaultSchedule = () =>
  DAYS.map((day) => ({
    day,
    isAvailable: false,
    startTime: "09:00",
    endTime: "17:00",
    breakEnabled: false,
    breakStart: "13:00",
    breakEnd: "14:00",
  }));

const Availability = () => {
  const [schedule, setSchedule] = useState(
    createDefaultSchedule()
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // Load current availability
  // =========================

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyDoctorProfile();

        console.log("Doctor profile:", data);

        const backendAvailability =
          data.doctor?.availability || [];

        const formattedSchedule =
          DAYS.map((day) => {
            const existingDay =
              backendAvailability.find(
                (item) => item.day === day
              );

            if (!existingDay) {
              return {
                day,
                isAvailable: false,
                startTime: "09:00",
                endTime: "17:00",
                breakEnabled: false,
                breakStart: "13:00",
                breakEnd: "14:00",
              };
            }

            return {
              day,
              isAvailable:
                existingDay.isAvailable ?? true,
              startTime:
                existingDay.startTime || "09:00",
              endTime:
                existingDay.endTime || "17:00",
              breakEnabled:
                existingDay.breakEnabled ?? false,
              breakStart:
                existingDay.breakStart || "13:00",
              breakEnd:
                existingDay.breakEnd || "14:00",
            };
          });

        setSchedule(formattedSchedule);
      } catch (err) {
        console.error(
          "Failed to load availability:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load availability."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  // =========================
  // Toggle day
  // =========================

  const toggleDay = (day) => {
    setSchedule((current) =>
      current.map((item) =>
        item.day === day
          ? {
              ...item,
              isAvailable: !item.isAvailable,
            }
          : item
      )
    );

    setMessage("");
    setError("");
  };

  // =========================
  // Update field
  // =========================

  const updateDay = (day, field, value) => {
    setSchedule((current) =>
      current.map((item) =>
        item.day === day
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );

    setMessage("");
    setError("");
  };

  // =========================
  // Save
  // =========================

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const availability = schedule.map(
        (item) => ({
          day: item.day,
          isAvailable: item.isAvailable,
          startTime: item.startTime,
          endTime: item.endTime,
          breakEnabled: item.breakEnabled,
          breakStart: item.breakStart,
          breakEnd: item.breakEnd,
        })
      );

      const data =
        await updateMyDoctorAvailability(
          availability
        );

      console.log(
        "Updated availability:",
        data
      );

      setMessage(
        "Availability saved successfully."
      );
    } catch (err) {
      console.error(
        "Failed to save availability:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save availability."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Availability
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your weekly working schedule.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading your availability...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Availability
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your weekly working schedule and
          appointment hours.
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Weekly Schedule */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Clock size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Weekly Schedule
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Set the days and hours when patients
                can book appointments.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {schedule.map((item) => (
            <div
              key={item.day}
              className="px-6 py-5"
            >
              {/* Day Header */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleDay(item.day)
                    }
                    className={`relative h-6 w-11 rounded-full transition ${
                      item.isAvailable
                        ? "bg-teal-500"
                        : "bg-slate-300"
                    }`}
                    aria-label={`Toggle ${item.day}`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        item.isAvailable
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </button>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {item.day}
                    </p>

                    <p className="text-xs text-slate-400">
                      {item.isAvailable
                        ? "Available"
                        : "Day off"}
                    </p>
                  </div>
                </div>

                {item.isAvailable && (
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Start */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Start
                      </label>

                      <input
                        type="time"
                        value={item.startTime}
                        onChange={(e) =>
                          updateDay(
                            item.day,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                      />
                    </div>

                    <span className="mt-5 text-slate-400">
                      →
                    </span>

                    {/* End */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        End
                      </label>

                      <input
                        type="time"
                        value={item.endTime}
                        onChange={(e) =>
                          updateDay(
                            item.day,
                            "endTime",
                            e.target.value
                          )
                        }
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Break */}
              {item.isAvailable && (
                <div className="mt-5 ml-0 rounded-xl bg-slate-50 p-4 lg:ml-15">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Break time
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Optional break during your
                        working hours.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        updateDay(
                          item.day,
                          "breakEnabled",
                          !item.breakEnabled
                        )
                      }
                      className={`relative h-6 w-11 rounded-full transition ${
                        item.breakEnabled
                          ? "bg-teal-500"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                          item.breakEnabled
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {item.breakEnabled && (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-500">
                          Break starts
                        </label>

                        <input
                          type="time"
                          value={item.breakStart}
                          onChange={(e) =>
                            updateDay(
                              item.day,
                              "breakStart",
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>

                      <span className="mt-5 text-slate-400">
                        →
                      </span>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-500">
                          Break ends
                        </label>

                        <input
                          type="time"
                          value={item.breakEnd}
                          onChange={(e) =>
                            updateDay(
                              item.day,
                              "breakEnd",
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Save */}
        <div className="flex justify-end border-t border-slate-100 px-6 py-5">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : "Save Availability"}
          </button>
        </div>
      </div>

      {/* Current Schedule */}
      <div className="mt-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-900">
            Current Schedule
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            This is the schedule currently configured
            for your account.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 p-6 md:grid-cols-2 xl:grid-cols-3">
          {schedule.map((item) => (
            <div
              key={item.day}
              className={`rounded-xl border p-4 ${
                item.isAvailable
                  ? "border-teal-100 bg-teal-50/40"
                  : "border-slate-100 bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">
                  {item.day}
                </p>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    item.isAvailable
                      ? "bg-teal-100 text-teal-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {item.isAvailable
                    ? "Available"
                    : "Day off"}
                </span>
              </div>

              {item.isAvailable && (
                <>
                  <p className="mt-3 text-sm text-slate-600">
                    {item.startTime} –{" "}
                    {item.endTime}
                  </p>

                  {item.breakEnabled && (
                    <p className="mt-1 text-xs text-slate-400">
                      Break: {item.breakStart} –{" "}
                      {item.breakEnd}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Availability;

