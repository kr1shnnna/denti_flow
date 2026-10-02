
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  UserRound,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  FileText,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getDoctors,
  getAvailableSlots,
  createAppointment,
} from "../services/api";

function AppointmentBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // =========================
  // Dedicated doctor booking
  // =========================

  const doctorFromUrl = searchParams.get("doctor");

  const [doctors, setDoctors] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState(
    doctorFromUrl || ""
  );

  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");

  const [availableSlots, setAvailableSlots] = useState([]);

  // =========================
  // Loading states
  // =========================

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  // =========================
  // Error / success
  // =========================

  const [error, setError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // =========================
  // Services
  // =========================

  const services = [
    "General Checkup",
    "Teeth Cleaning",
    "Root Canal Treatment",
    "Braces & Aligners",
    "Cosmetic Dentistry",
    "Dental Procedures",
  ];

  // =========================
  // Load doctors
  // =========================

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setError("");

        const data = await getDoctors();

        const doctorList = Array.isArray(data)
          ? data
          : data.doctors || [];

        setDoctors(doctorList);

        // If a doctor was passed through URL,
        // make sure that doctor actually exists.
        if (doctorFromUrl) {
          const doctorExists = doctorList.some(
            (doctor) =>
              (doctor._id || doctor.id) === doctorFromUrl
          );

          if (!doctorExists) {
            setError("The selected doctor could not be found.");
            setSelectedDoctor("");
          }
        }
      } catch (err) {
        console.error("Failed to load doctors:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load doctors. Please try again."
        );
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [doctorFromUrl]);

  // =========================
  // Find selected doctor
  // =========================

  const selectedDoctorData = doctors.find(
    (doctor) =>
      (doctor._id || doctor.id) === selectedDoctor
  );

  const isDedicatedBooking = Boolean(doctorFromUrl);

  // =========================
  // Fetch available slots
  // =========================

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) {
      setAvailableSlots([]);
      setSelectedTime("");
      return;
    }

    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        setError("");
        setSelectedTime("");

        const data = await getAvailableSlots(
          selectedDoctor,
          selectedDate
        );

        const slots = Array.isArray(data)
          ? data
          : data.availableSlots || [];

        setAvailableSlots(slots);
      } catch (err) {
        console.error(
          "Failed to load available slots:",
          err
        );

        setAvailableSlots([]);

        setError(
          err.response?.data?.message ||
            "Unable to load available time slots."
        );
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDoctor, selectedDate]);

  // =========================
  // Doctor selection
  // =========================

  const handleDoctorChange = (doctorId) => {
    setSelectedDoctor(doctorId);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableSlots([]);
    setError("");
  };

  // =========================
  // Date selection
  // =========================

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTime("");
    setError("");
  };

  // =========================
  // Booking
  // =========================

  const handleBooking = async () => {
    if (
      !selectedDoctor ||
      !selectedService ||
      !selectedDate ||
      !selectedTime ||
      !reason.trim()
    ) {
      setError(
        "Please select a dentist, service, date, time, and enter a reason for your appointment."
      );
      return;
    }

    try {
      setBooking(true);
      setError("");

      const appointmentData = {
        doctor: selectedDoctor,
        date: selectedDate,
        timeSlot: selectedTime,
        reason: reason.trim(),
      };

      await createAppointment(appointmentData);

      setBookingSuccess(true);
    } catch (err) {
      console.error(
        "Failed to create appointment:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to book the appointment. Please try again."
      );
    } finally {
      setBooking(false);
    }
  };

  // =========================
  // Success screen
  // =========================

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="mx-auto flex max-w-4xl items-center justify-center px-6 pb-20 pt-32">
          <div className="w-full rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <CheckCircle2 size={34} />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              Appointment Booked!
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Your dental appointment has been successfully
              booked.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/appointments")}
                className="rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                View My Appointments
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Home
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // =========================
  // Main page
  // =========================

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pb-20 pt-32 lg:px-8">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/appointments")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-teal-600"
        >
          <ArrowLeft size={16} />
          Back to Appointments
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-teal-600">
            DentiFlow
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {isDedicatedBooking
              ? "Book an Appointment"
              : "Book an Appointment"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isDedicatedBooking
              ? "Complete your appointment details with your selected dentist."
              : "Choose your dentist, service, date, available time, and tell us the reason for your visit."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Booking Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">

          {/* =========================
              Doctor Selection
          ========================= */}

          {!isDedicatedBooking ? (
            <>
              <section>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                      Step 1
                    </p>

                    <h2 className="text-lg font-semibold text-slate-900">
                      Choose Your Dentist
                    </h2>
                  </div>
                </div>

                <div className="mt-5">
                  {loadingDoctors ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2
                        size={24}
                        className="animate-spin text-teal-600"
                      />
                    </div>
                  ) : doctors.length === 0 ? (
                    <div className="rounded-2xl bg-slate-50 p-6 text-center">
                      <p className="text-sm text-slate-500">
                        No doctors are currently available.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {doctors.map((doctor) => {
                        const doctorId =
                          doctor._id || doctor.id;

                        const isSelected =
                          selectedDoctor === doctorId;

                        return (
                          <button
                            key={doctorId}
                            type="button"
                            onClick={() =>
                              handleDoctorChange(doctorId)
                            }
                            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                              isSelected
                                ? "border-teal-500 bg-teal-50 ring-2 ring-teal-500/10"
                                : "border-slate-100 bg-white hover:border-teal-200 hover:bg-slate-50"
                            }`}
                          >
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                              {doctor.image ? (
                                <img
                                  src={
                                    doctor.image.startsWith(
                                      "http"
                                    )
                                      ? doctor.image
                                      : `http://localhost:5000${doctor.image}`
                                  }
                                  alt={doctor.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                  <UserRound size={24} />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {doctor.name}
                              </p>

                              <p className="mt-1 text-xs text-teal-600">
                                {doctor.specialization}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>

              <div className="my-8 border-t border-slate-100" />
            </>
          ) : (
            <>
              {/* Dedicated doctor */}
              <section>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                      Selected Dentist
                    </p>

                    <h2 className="text-lg font-semibold text-slate-900">
                      {loadingDoctors
                        ? "Loading dentist..."
                        : selectedDoctorData?.name ||
                          "Selected Dentist"}
                    </h2>

                    {selectedDoctorData?.specialization && (
                      <p className="mt-1 text-sm text-teal-600">
                        {selectedDoctorData.specialization}
                      </p>
                    )}
                  </div>
                </div>

                {selectedDoctorData?.image && (
                  <div className="mt-5 flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                    <img
                      src={
                        selectedDoctorData.image.startsWith(
                          "http"
                        )
                          ? selectedDoctorData.image
                          : `http://localhost:5000${selectedDoctorData.image}`
                      }
                      alt={selectedDoctorData.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedDoctorData.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Your appointment will be booked with this dentist.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              <div className="my-8 border-t border-slate-100" />
            </>
          )}

          {/* =========================
              Service
          ========================= */}

          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                  {isDedicatedBooking ? "Step 1" : "Step 2"}
                </p>

                <h2 className="text-lg font-semibold text-slate-900">
                  Select a Service
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const isSelected =
                  selectedService === service;

                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => {
                      setSelectedService(service);
                      setError("");
                    }}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm font-medium transition ${
                      isSelected
                        ? "border-teal-500 bg-teal-50 text-teal-700 ring-2 ring-teal-500/10"
                        : "border-slate-100 text-slate-700 hover:border-teal-200 hover:bg-slate-50"
                    }`}
                  >
                    {service}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="my-8 border-t border-slate-100" />

          {/* =========================
              Date
          ========================= */}

          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <CalendarDays size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                  {isDedicatedBooking ? "Step 2" : "Step 3"}
                </p>

                <h2 className="text-lg font-semibold text-slate-900">
                  Choose a Date
                </h2>
              </div>
            </div>

            <div className="mt-5 max-w-sm">
              <input
                type="date"
                value={selectedDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={handleDateChange}
                disabled={!selectedDoctor}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              />

              {!selectedDoctor && (
                <p className="mt-2 text-xs text-slate-400">
                  Please select a dentist first.
                </p>
              )}
            </div>
          </section>

          <div className="my-8 border-t border-slate-100" />

          {/* =========================
              Time
          ========================= */}

          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Clock size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                  {isDedicatedBooking ? "Step 3" : "Step 4"}
                </p>

                <h2 className="text-lg font-semibold text-slate-900">
                  Select Available Time
                </h2>
              </div>
            </div>

            <div className="mt-5">
              {!selectedDate ? (
                <p className="text-sm text-slate-400">
                  Select a date to see available times.
                </p>
              ) : loadingSlots ? (
                <div className="flex items-center gap-2 py-5 text-sm text-slate-500">
                  <Loader2
                    size={18}
                    className="animate-spin text-teal-600"
                  />
                  Checking available times...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">
                    No available slots for this date.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {availableSlots.map((slot) => {
                    const time =
                      typeof slot === "string"
                        ? slot
                        : slot.time;

                    const isSelected =
                      selectedTime === time;

                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => {
                          setSelectedTime(time);
                          setError("");
                        }}
                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                          isSelected
                            ? "border-teal-500 bg-teal-600 text-white"
                            : "border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <div className="my-8 border-t border-slate-100" />

          {/* =========================
              Reason
          ========================= */}

          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <FileText size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                  {isDedicatedBooking ? "Step 4" : "Step 5"}
                </p>

                <h2 className="text-lg font-semibold text-slate-900">
                  Reason for Your Visit
                </h2>
              </div>
            </div>

            <div className="mt-5">
              <textarea
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                  setError("");
                }}
                placeholder="Briefly describe why you are booking this appointment..."
                rows={4}
                maxLength={500}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              />

              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>
                  This helps the dentist understand your visit.
                </span>

                <span>{reason.length}/500</span>
              </div>
            </div>
          </section>

          {/* =========================
              Confirm
          ========================= */}

          <div className="mt-10 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleBooking}
              disabled={booking}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {booking ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Booking Appointment...
                </>
              ) : (
                <>
                  Confirm Appointment
                  <CheckCircle2 size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AppointmentBooking;
