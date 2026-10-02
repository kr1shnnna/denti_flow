import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  UserRound,
  MapPin,
  Loader2,
  AlertCircle,
  XCircle,
  CheckCircle2,
  CalendarPlus,
  History,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getMyAppointments,
  cancelAppointment,
} from "../services/api";

function Appointments() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");

  const [appointmentToCancel, setAppointmentToCancel] =
    useState(null);

  // =========================
  // Load patient
  // =========================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error(
          "Failed to load patient data:",
          error
        );
      }
    }
  }, []);

  // =========================
  // Fetch appointments
  // =========================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyAppointments();

      const appointmentList = Array.isArray(data)
        ? data
        : data.appointments || [];

      setAppointments(appointmentList);
    } catch (err) {
      console.error(
        "Failed to load appointments:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load your appointments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // =========================
  // Patient name
  // =========================

  const patientName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "Patient";

  // =========================
  // Date helpers
  // =========================

  const getAppointmentDateTime = (appointment) => {
    if (!appointment?.date) return null;

    const dateString = appointment.date
      .toString()
      .split("T")[0];

    if (!appointment.timeSlot) {
      return new Date(dateString);
    }

    const [hours, minutes] =
      appointment.timeSlot.split(":");

    const date = new Date(dateString);

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date;
  };

  const isUpcoming = (appointment) => {
    const appointmentDate =
      getAppointmentDateTime(appointment);

    if (!appointmentDate) return false;

    if (
      appointment.status === "cancelled" ||
      appointment.status === "completed" ||
      appointment.status === "rejected"
    ) {
      return false;
    }

    return appointmentDate > new Date();
  };

  const upcomingAppointments =
    appointments.filter(isUpcoming);

  const appointmentHistory =
    appointments.filter(
      (appointment) => !isUpcoming(appointment)
    );

  // A patient is considered returning after
  // they have at least one appointment.
  const isReturningPatient =
    appointments.length > 0;

  // =========================
  // Formatting
  // =========================

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date unavailable";

    const date = new Date(dateValue);

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "Time unavailable";

    const [hours, minutes] = time.split(":");

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

  // =========================
  // Doctor information
  // =========================

  const getDoctorName = (appointment) => {
    if (!appointment?.doctor) {
      return "Dentist";
    }

    if (typeof appointment.doctor === "string") {
      return "Dentist";
    }

    return (
      appointment.doctor.user?.name ||
      appointment.doctor.name ||
      "Dentist"
    );
  };

  const getDoctorSpecialization = (appointment) => {
    return (
      appointment?.doctor?.specialization ||
      "Dental Specialist"
    );
  };

  const getDoctorImage = (appointment) => {
    const image =
      appointment?.doctor?.image ||
      appointment?.doctor?.user?.image;

    if (!image) return null;

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:5000${image}`;
  };

  // =========================
  // Status
  // =========================

  const getStatusClasses = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200";

      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      case "completed":
        return "bg-slate-100 text-slate-600 border-slate-200";

      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
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
  // Cancel appointment
  // =========================

  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;

    const appointmentId =
      appointmentToCancel._id ||
      appointmentToCancel.id;

    try {
      setCancellingId(appointmentId);
      setCancelError("");

      await cancelAppointment(appointmentId);

      setAppointmentToCancel(null);

      await fetchAppointments();
    } catch (err) {
      console.error(
        "Failed to cancel appointment:",
        err
      );

      setCancelError(
        err.response?.data?.message ||
          "Unable to cancel this appointment."
      );
    } finally {
      setCancellingId(null);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="mx-auto flex max-w-6xl items-center justify-center px-6 pb-20 pt-32 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <Loader2
              size={32}
              className="animate-spin text-teal-600"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading your appointments...
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-32 lg:px-8">

        {/* =========================
            Header
        ========================= */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-teal-600">
              DentiFlow
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              My Appointments
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Welcome back, {patientName}. Manage your
              dental appointments from here.
            </p>
          </div>

          {/* Returning patient gets only this booking button */}
          {isReturningPatient && (
            <button
              type="button"
              onClick={() =>
                navigate("/appointments/book")
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              <CalendarPlus size={17} />
              Book Appointment
            </button>
          )}
        </div>

        {/* =========================
            Error
        ========================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-600">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-medium">
                Something went wrong
              </p>

              <p className="mt-1">{error}</p>

              <button
                type="button"
                onClick={fetchAppointments}
                className="mt-3 font-semibold underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            NEW PATIENT
            No appointment history at all
        ================================================= */}

        {!isReturningPatient && !error && (
          <>
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <CalendarDays size={30} />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-slate-900">
                  Book Your First Appointment
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Choose a dentist, select a dental service
                  and available time, then confirm your
                  appointment.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/appointments/book")
                  }
                  className="mt-6 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
                >
                  Start Booking
                </button>
              </div>
            </section>

            {/* Onboarding cards only for new patients */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <InfoCard
                icon={<UserRound size={19} />}
                title="Choose Dentist"
                description="Select the dentist you want to visit."
              />

              <InfoCard
                icon={<Clock size={19} />}
                title="Select Time"
                description="Choose an available appointment slot."
              />

              <InfoCard
                icon={<MapPin size={19} />}
                title="Visit Clinic"
                description="Arrive at the clinic for your appointment."
              />
            </div>
          </>
        )}

        {/* =================================================
            RETURNING PATIENT
            Upcoming appointments
        ================================================= */}

        {isReturningPatient &&
          upcomingAppointments.length > 0 && (
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Upcoming Appointments
                  </h2>

                  <p className="text-sm text-slate-500">
                    Your scheduled dental visits.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {upcomingAppointments.map(
                  (appointment) => (
                    <AppointmentCard
                      key={
                        appointment._id ||
                        appointment.id
                      }
                      appointment={appointment}
                      upcoming
                      getDoctorName={getDoctorName}
                      getDoctorSpecialization={
                        getDoctorSpecialization
                      }
                      getDoctorImage={getDoctorImage}
                      formatDate={formatDate}
                      formatTime={formatTime}
                      getStatusClasses={
                        getStatusClasses
                      }
                      formatStatus={formatStatus}
                      onCancel={() =>
                        setAppointmentToCancel(
                          appointment
                        )
                      }
                    />
                  )
                )}
              </div>
            </section>
          )}

        {/* =================================================
            RETURNING PATIENT
            No upcoming appointments
        ================================================= */}

        {isReturningPatient &&
          upcomingAppointments.length === 0 && (
            <section className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <CalendarDays size={26} />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  No upcoming appointments
                </h2>

                <p className="mt-2 max-w-md text-sm text-slate-500">
                  You don't currently have an upcoming
                  appointment.
                </p>
              </div>
            </section>
          )}

        {/* =================================================
            APPOINTMENT HISTORY
        ================================================= */}

        {isReturningPatient &&
          appointmentHistory.length > 0 && (
            <section className="mt-12">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <History size={19} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Appointment History
                  </h2>

                  <p className="text-sm text-slate-500">
                    Your previous and cancelled appointments.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {appointmentHistory.map(
                  (appointment) => (
                    <AppointmentCard
                      key={
                        appointment._id ||
                        appointment.id
                      }
                      appointment={appointment}
                      upcoming={false}
                      getDoctorName={getDoctorName}
                      getDoctorSpecialization={
                        getDoctorSpecialization
                      }
                      getDoctorImage={getDoctorImage}
                      formatDate={formatDate}
                      formatTime={formatTime}
                      getStatusClasses={
                        getStatusClasses
                      }
                      formatStatus={formatStatus}
                    />
                  )
                )}
              </div>
            </section>
          )}
      </main>

      <Footer />

      {/* =========================
          Cancel Confirmation Modal
      ========================= */}

      {appointmentToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-7">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <XCircle size={24} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              Cancel Appointment?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to cancel your
              appointment with{" "}
              <span className="font-semibold text-slate-700">
                {getDoctorName(
                  appointmentToCancel
                )}
              </span>
              ?
            </p>

            {cancelError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {cancelError}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleCancelAppointment}
                disabled={cancellingId !== null}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancellingId ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAppointmentToCancel(null);
                  setCancelError("");
                }}
                disabled={cancellingId !== null}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Keep Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ======================================================
// Appointment Card
// ======================================================

function AppointmentCard({
  appointment,
  upcoming,
  getDoctorName,
  getDoctorSpecialization,
  getDoctorImage,
  formatDate,
  formatTime,
  getStatusClasses,
  formatStatus,
  onCancel,
}) {
  const doctorImage = getDoctorImage(appointment);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">

        {/* Doctor */}
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
            {doctorImage ? (
              <img
                src={doctorImage}
                alt={getDoctorName(appointment)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <UserRound size={26} />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-base font-semibold text-slate-900">
              {getDoctorName(appointment)}
            </p>

            <p className="mt-1 text-sm text-teal-600">
              {getDoctorSpecialization(
                appointment
              )}
            </p>
          </div>
        </div>

        {/* Date / time */}
        <div className="grid gap-3 sm:grid-cols-2 lg:w-[320px]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
              <CalendarDays size={17} />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Date
              </p>

              <p className="mt-0.5 text-sm font-medium text-slate-700">
                {formatDate(appointment.date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
              <Clock size={17} />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Time
              </p>

              <p className="mt-0.5 text-sm font-medium text-slate-700">
                {formatTime(appointment.timeSlot)}
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="lg:w-32">
          <span
            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
              appointment.status
            )}`}
          >
            {formatStatus(appointment.status)}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="mt-5 border-t border-slate-100 pt-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-slate-400">
              Reason for Visit
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              {appointment.reason ||
                "No reason provided"}
            </p>
          </div>

          {appointment.service && (
            <div>
              <p className="text-xs font-medium text-slate-400">
                Service
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {appointment.service}
              </p>
            </div>
          )}
        </div>

        {/* Cancel */}
        {upcoming &&
          ["pending", "confirmed"].includes(
            appointment.status
          ) && (
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <XCircle size={17} />
                Cancel Appointment
              </button>
            </div>
          )}

        {/* Completed */}
        {!upcoming &&
          appointment.status ===
            "completed" && (
            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-green-600">
              <CheckCircle2 size={17} />
              Appointment completed
            </div>
          )}
      </div>
    </div>
  );
}

// ======================================================
// New Patient Info Card
// ======================================================

function InfoCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default Appointments;