import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3, Stethoscope } from "lucide-react";

import { getDoctors } from "../services/api";

function FeaturedDentists() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDoctors();

        setDoctors(data?.doctors || []);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);

        setError(
          err.response?.data?.message || "Unable to load dentists right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const featuredDoctors = doctors.slice(0, 4);

  return (
    <section className="bg-slate-50 px-6 py-20 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-teal-600">
              Our Dentists
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Meet our experienced
              <span className="text-teal-600"> dentists.</span>
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
              Find the right dental professional for your needs and book an
              appointment at a time that works for you.
            </p>
          </div>

          {/* View All */}
          <Link
            to="/doctors"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-teal-600 transition hover:text-teal-700"
          >
            View All Doctors
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <DoctorSkeleton key={item} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-12 rounded-2xl border border-red-100 bg-white p-8 text-center">
            <p className="text-sm font-medium text-red-600">{error}</p>

            <p className="mt-2 text-sm text-slate-500">
              Please try again later.
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && featuredDoctors.length === 0 && (
          <div className="mt-12 rounded-2xl border border-slate-100 bg-white p-10 text-center">
            <Stethoscope size={32} className="mx-auto text-slate-300" />

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No dentists available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Please check back later.
            </p>
          </div>
        )}

        {/* Doctors */}
        {!loading && !error && featuredDoctors.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================
   Doctor Card
========================= */

function DoctorCard({ doctor }) {
  const doctorName = doctor.user?.name || "Dental Specialist";

  const image = doctor.image
    ? `http://localhost:5000${doctor.image}`
    : doctor.user?.profileImage
      ? `http://localhost:5000${doctor.user.profileImage}`
      : "/doctor-placeholder.png";

  const specialization = doctor.specialization || "General Dentist";

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
      {/* Doctor Image */}
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={doctorName}
          className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
        />

        {/* Availability */}
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-emerald-600 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Available
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
          {specialization}
        </p>

        <h3 className="mt-1 text-lg font-bold text-slate-900">{doctorName}</h3>

        <p className="mt-1 text-sm text-slate-500">
          {doctor.qualification || "Dental Professional"}
        </p>

        {/* Details */}
        <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 size={15} className="text-teal-600" />

            <span>{doctor.experience || 0} years experience</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Stethoscope size={15} className="text-teal-600" />

            <span>₹{doctor.consultationFee || 0} consultation</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            to={`/doctors/${doctor._id}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
          >
            View Profile
          </Link>

          <Link
            to={`/appointments/book?doctor=${doctor._id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-teal-700"
          >
            <CalendarDays size={14} />
            Book
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Loading Skeleton
========================= */

function DoctorSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <div className="h-64 animate-pulse bg-slate-200" />

      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />

        <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-4 w-36 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default FeaturedDentists;
