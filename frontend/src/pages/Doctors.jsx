import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Stethoscope,
  Clock3,
  IndianRupee,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getDoctors } from "../services/api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
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
          err.response?.data?.message || "Unable to load doctors right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Get unique specializations
  const specializations = useMemo(() => {
    const values = doctors
      .map((doctor) => doctor.specialization)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [doctors]);

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const doctorName = doctor.user?.name || doctor.name || "";

      const matchesSearch =
        doctorName.toLowerCase().includes(searchValue) ||
        doctor.specialization?.toLowerCase().includes(searchValue);

      const matchesSpecialization =
        specialization === "All" || doctor.specialization === specialization;

      return matchesSearch && matchesSpecialization;
    });
  }, [doctors, search, specialization]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* =========================
          Page Hero
      ========================= */}
      <section className="bg-white px-6 pb-12 pt-32 sm:pt-36 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-teal-600">
              Our Dentists
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Find the right
              <span className="text-teal-600"> dentist for you.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500">
              Explore our experienced dental professionals, find a specialist
              that matches your needs, and book your appointment with ease.
            </p>
          </div>

          {/* =========================
              Search & Filter
          ========================= */}
          <div className="mx-auto mt-10 max-w-4xl">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by doctor or specialization..."
                  className="h-12 w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:bg-slate-100"
                />
              </div>

              {/* Specialization */}
              <div className="relative md:w-64">
                <SlidersHorizontal
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="h-12 w-full appearance-none rounded-xl bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none focus:bg-slate-100"
                >
                  {specializations.map((item) => (
                    <option key={item} value={item}>
                      {item === "All" ? "All Specializations" : item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Doctors Section
      ========================= */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Result Count */}
          {!loading && !error && (
            <div className="mb-7 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredDoctors.length}
                </span>{" "}
                {filteredDoctors.length === 1 ? "dentist" : "dentists"}
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <DoctorSkeleton key={item} />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <Stethoscope size={25} className="text-red-500" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                Unable to load doctors
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {error}
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredDoctors.length === 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
                <Search size={24} className="text-teal-600" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                No dentists found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Try changing your search or selecting a different
                specialization.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSpecialization("All");
                }}
                className="mt-5 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Doctors */}
          {!loading && !error && filteredDoctors.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* =========================
   Doctor Card
========================= */

function DoctorCard({ doctor }) {
  const doctorName = doctor.user?.name || doctor.name || "Dental Specialist";

  const image = doctor.image
    ? `http://localhost:5000${doctor.image}`
    : "/doctor-placeholder.png";

  const specialization = doctor.specialization || "General Dentist";

  const experience = doctor.experience ?? 0;

  const consultationFee = doctor.consultationFee ?? 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
      {/* Image */}
      <div className="relative h-72 overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={doctorName}
          className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/doctor-placeholder.png";
          }}
        />

        {/* Availability */}
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-emerald-600 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Accepting Appointments
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
          {specialization}
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900">{doctorName}</h2>

        <p className="mt-1 text-sm text-slate-500">
          {doctor.qualification || "Dental Professional"}
        </p>

        {/* Information */}
        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 size={16} className="shrink-0 text-teal-600" />

            <span>
              {experience} {experience === 1 ? "year" : "years"} experience
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <IndianRupee size={16} className="shrink-0 text-teal-600" />

            <span>₹{consultationFee} consultation</span>
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
    </article>
  );
}

/* =========================
   Loading Skeleton
========================= */

function DoctorSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <div className="h-72 animate-pulse bg-slate-200" />

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

export default Doctors;
