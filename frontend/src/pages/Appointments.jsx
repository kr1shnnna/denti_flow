import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, UserRound, MapPin } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Appointments() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to load patient data:", error);
      }
    }
  }, []);

  const patientName =
    user?.name || user?.fullName || user?.username || "Patient";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-32 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-teal-600">DentiFlow</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            My Appointments
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Welcome back, {patientName}. Manage your dental appointments from
            here.
          </p>
        </div>

        {/* Appointment Booking Area */}
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <CalendarDays size={30} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              Book Your Appointment
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Choose a dentist, select a dental service and available time, then
              confirm your appointment.
            </p>

            {/* This button will be connected to the actual
                doctor/service/time selection flow next */}

            <button
              type="button"
              onClick={() => navigate("/appointments/book")}
              className="mt-6 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              Start Booking
            </button>
          </div>
        </section>

        {/* Appointment Information */}
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
      </main>

      <Footer />
    </div>
  );
}

function InfoCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export default Appointments;
