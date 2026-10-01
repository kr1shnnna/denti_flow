
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  LogOut,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Profile() {
  const [user, setUser] = useState(null);

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

  if (!user) {
    return null;
  }

  const patientName =
    user.name ||
    user.fullName ||
    user.username ||
    "Patient";

  const patientEmail = user.email || "No email available";

  const avatarLetter = patientName
    .charAt(0)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pb-16 pt-32 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-teal-600">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your personal information and appointments.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              {/* Avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-bold text-teal-600 shadow-md">
                {avatarLetter}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white">
                  {patientName}
                </h2>

                <p className="mt-1 text-sm text-teal-50">
                  Patient
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-slate-900">
              Account Information
            </h3>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-600">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Full Name
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {patientName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-600">
                    <Mail size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">
                      Email Address
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                      {patientEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Type */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-600">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Account Type
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      Patient
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointments */}
              <Link
                to="/appointments"
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-teal-100 hover:bg-teal-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-600">
                    <CalendarDays size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Appointments
                    </p>

                    <p className="mt-1 text-sm font-semibold text-teal-600">
                      View My Appointments →
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Future editing area */}
            <div className="mt-8 rounded-2xl border border-dashed border-slate-200 p-5">
              <p className="text-sm font-medium text-slate-700">
                Profile editing
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Profile editing can be connected to the patient
                update API once we wire the backend endpoint.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
