
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getMyDoctorProfile } from "../services/api";

const DashboardHeader = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const data = await getMyDoctorProfile(token);

        setDoctor(data.doctor);
      } catch (error) {
        console.error(
          "Failed to fetch doctor profile:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDoctorProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <header className="mb-8">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-8 w-64 animate-pulse rounded bg-slate-200" />
      </header>
    );
  }

  if (!doctor) {
    return (
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back
        </h1>

        <p className="mt-1 text-sm text-red-500">
          Unable to load doctor profile.
        </p>
      </header>
    );
  }

  const doctorName = doctor.user?.name || "Doctor";
  const specialization =
    doctor.specialization || "Dentist";

  const firstName = doctorName
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")[0];

  const profileImage =
    doctor.user?.profileImage || doctor.image;

  return (
    <header className="mb-8 flex items-center justify-between">
      {/* Greeting */}
      <div>
        <p className="mb-1 text-sm font-medium text-slate-500">
          {formattedDate}
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Good morning, {firstName} 👋
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with your appointments
          today.
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.8} />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-teal-500 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="h-10 w-px bg-slate-200" />

        {/* Doctor profile */}
        <div className="flex items-center gap-3">
          {profileImage ? (
            <img
              src={profileImage}
              alt={doctorName}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
              {firstName.charAt(0)}
            </div>
          )}

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {doctorName}
            </p>

            <p className="text-xs text-slate-500">
              {specialization}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

