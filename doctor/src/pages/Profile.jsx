
import { useEffect, useState } from "react";
import {
  UserCircle,
  Mail,
  Phone,
  GraduationCap,
  BriefcaseBusiness,
  Stethoscope,
  IndianRupee,
  FileText,
  CheckCircle2,
} from "lucide-react";

import { getMyDoctorProfile } from "../services/api";

const Profile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const data = await getMyDoctorProfile();
        setDoctor(data.doctor);
      } catch (error) {
        console.error("Failed to fetch doctor profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />

        <div className="h-80 animate-pulse rounded-2xl bg-white shadow-sm" />
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (!doctor) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8">
        <h1 className="text-xl font-semibold text-slate-900">
          Unable to load profile
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          We couldn't fetch your doctor profile.
        </p>
      </div>
    );
  }

  const doctorName = doctor.user?.name || "Doctor";
  const email = doctor.user?.email || "Not available";
  const phone = doctor.user?.phone || "Not available";

  const rawProfileImage =
    doctor.user?.profileImage || doctor.image;

  const profileImage = rawProfileImage
    ? rawProfileImage.startsWith("http")
      ? rawProfileImage
      : `http://localhost:5000${rawProfileImage}`
    : null;

  const cleanName = doctorName.replace(/^Dr\.?\s*/i, "");

  const initials = cleanName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const services = Array.isArray(doctor.services)
    ? doctor.services
    : [];

  return (
    <div className="space-y-6">
      {/* =========================
          Page Header
      ========================= */}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your professional and account information.
        </p>
      </div>

      {/* =========================
          Profile Overview
      ========================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-teal-50 to-slate-50" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            {/* Profile Image */}

            <div>
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={doctorName}
                  className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-teal-100 text-2xl font-semibold text-teal-700 shadow-sm">
                  {initials}
                </div>
              )}
            </div>

            {/* Availability */}

            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">
              <CheckCircle2 size={15} />

              {doctor.isAvailable
                ? "Available"
                : "Currently unavailable"}
            </div>
          </div>

          <div className="mt-5">
            <h2 className="text-xl font-semibold text-slate-900">
              {doctorName}
            </h2>

            <p className="mt-1 text-sm text-teal-600">
              {doctor.specialization || "Dentist"}
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          Personal Information
      ========================= */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-900">
            Personal Information
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Your basic account information.
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <InfoItem
            icon={UserCircle}
            label="Full Name"
            value={doctorName}
          />

          <InfoItem
            icon={Mail}
            label="Email Address"
            value={email}
          />

          <InfoItem
            icon={Phone}
            label="Phone Number"
            value={phone}
          />
        </div>
      </div>

      {/* =========================
          Professional Information
      ========================= */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-900">
            Professional Information
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Your professional details and consultation information.
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            icon={Stethoscope}
            label="Specialization"
            value={doctor.specialization}
          />

          <InfoItem
            icon={GraduationCap}
            label="Qualification"
            value={doctor.qualification}
          />

          <InfoItem
            icon={BriefcaseBusiness}
            label="Experience"
            value={
              doctor.experience !== undefined
                ? `${doctor.experience} years`
                : "Not available"
            }
          />

          <InfoItem
            icon={IndianRupee}
            label="Consultation Fee"
            value={
              doctor.consultationFee !== undefined
                ? `₹${doctor.consultationFee}`
                : "Not available"
            }
          />
        </div>
      </div>

      {/* =========================
          Services
      ========================= */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-900">
            Services
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Services currently offered by you.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 p-6">
          {services.length > 0 ? (
            services.map((service, index) => (
              <span
                key={`${service}-${index}`}
                className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700"
              >
                {service}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              No services listed.
            </p>
          )}
        </div>
      </div>

      {/* =========================
          About
      ========================= */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-900">
            About
          </h2>
        </div>

        <div className="flex gap-4 p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <FileText size={19} />
          </div>

          <p className="text-sm leading-6 text-slate-600">
            {doctor.bio || "No professional bio has been added yet."}
          </p>
        </div>
      </div>
    </div>
  );
};

// =========================
// Reusable Info Item
// =========================

const InfoItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
};

export default Profile;
