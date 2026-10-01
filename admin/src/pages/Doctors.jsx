import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Stethoscope, X, Clock3, UserCircle } from "lucide-react";

import {
  getDoctors,
  createDoctor,
  updateDoctorAvailability,
} from "../services/api";

const emptyDoctor = {
  name: "",
  email: "",
  password: "",
  phone: "",
  specialization: "",
  qualification: "",
  experience: "",
  bio: "",
  consultationFee: "",
  services: "",
  image: "",
};

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [doctorForm, setDoctorForm] = useState(emptyDoctor);
  const [savingDoctor, setSavingDoctor] = useState(false);

  const [availability, setAvailability] = useState([]);
  const [savingAvailability, setSavingAvailability] = useState(false);

  const [actionMessage, setActionMessage] = useState("");

  // =========================
  // Fetch Doctors
  // =========================

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDoctors();

      setDoctors(data.doctors || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // =========================
  // Search
  // =========================

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return doctors;
    }

    return doctors.filter((doctor) => {
      const name = doctor.user?.name || "";
      const specialization = doctor.specialization || "";
      const qualification = doctor.qualification || "";

      return (
        name.toLowerCase().includes(query) ||
        specialization.toLowerCase().includes(query) ||
        qualification.toLowerCase().includes(query)
      );
    });
  }, [doctors, search]);

  // =========================
  // Add Doctor
  // =========================

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;

    setDoctorForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();

    try {
      setSavingDoctor(true);
      setError("");
      setActionMessage("");

      const payload = {
        ...doctorForm,
        experience: Number(doctorForm.experience),
        consultationFee: Number(doctorForm.consultationFee),
        services: doctorForm.services
          ? doctorForm.services
              .split(",")
              .map((service) => service.trim())
              .filter(Boolean)
          : [],
      };

      await createDoctor(payload);

      setShowAddModal(false);
      setDoctorForm(emptyDoctor);

      setActionMessage("Doctor created successfully.");

      await fetchDoctors();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create doctor.");
    } finally {
      setSavingDoctor(false);
    }
  };

  // =========================
  // Availability
  // =========================

  const openAvailabilityModal = (doctor) => {
    setSelectedDoctor(doctor);
    setAvailability(doctor.availability || []);
    setShowAvailabilityModal(true);
  };

  const handleAvailabilityChange = (index, field, value) => {
    setAvailability((prev) =>
      prev.map((day, dayIndex) =>
        dayIndex === index
          ? {
              ...day,
              [field]: value,
            }
          : day,
      ),
    );
  };

  const handleSaveAvailability = async () => {
    if (!selectedDoctor) return;

    try {
      setSavingAvailability(true);
      setError("");
      setActionMessage("");

      await updateDoctorAvailability(selectedDoctor._id, availability);

      setShowAvailabilityModal(false);
      setSelectedDoctor(null);

      setActionMessage("Doctor availability updated successfully.");

      await fetchDoctors();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update availability.",
      );
    } finally {
      setSavingAvailability(false);
    }
  };

  // =========================
  // Format currency
  // =========================

  const formatFee = (fee) => {
    if (fee === undefined || fee === null) {
      return "—";
    }

    return `₹${Number(fee).toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-8">
      {/* =========================
          Header
      ========================== */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-sm font-medium text-teal-600">
            Clinic Management
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Doctors
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage doctors and their availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setDoctorForm(emptyDoctor);
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          <Plus size={18} />
          Add Doctor
        </button>
      </div>

      {/* =========================
          Messages
      ========================== */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {actionMessage && (
        <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-700">
          {actionMessage}
        </div>
      )}

      {/* =========================
          Search
      ========================== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="relative max-w-md">
          <Search
            size={18}
            strokeWidth={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      {/* =========================
          Doctors Table
      ========================== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Doctor Directory</h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredDoctors.length} doctor
                {filteredDoctors.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Stethoscope size={36} className="mx-auto text-slate-300" />

            <h3 className="mt-4 text-sm font-semibold text-slate-800">
              No doctors found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or add a new doctor.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Doctor
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Specialization
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Experience
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Consultation Fee
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Availability
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredDoctors.map((doctor) => {
                  const doctorName = doctor.user?.name || "Doctor";

                  const profileImage =
                    doctor.user?.profileImage || doctor.image;

                  return (
                    <tr
                      key={doctor._id}
                      className="transition hover:bg-slate-50/70"
                    >
                      {/* Doctor */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {profileImage ? (
                            <div className="h-16 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                              <img
                                src={
                                  profileImage.startsWith("http")
                                    ? profileImage
                                    : `http://localhost:5000${profileImage}`
                                }
                                alt={doctorName}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                          ) : (
                            <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                              <UserCircle size={22} />
                            </div>
                          )}

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {doctorName}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {doctor.user?.email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Specialization */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">
                          {doctor.specialization || "—"}
                        </span>
                      </td>

                      {/* Experience */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">
                          {doctor.experience ?? "—"}
                          {doctor.experience !== undefined &&
                          doctor.experience !== null
                            ? " years"
                            : ""}
                        </span>
                      </td>

                      {/* Fee */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-700">
                          {formatFee(doctor.consultationFee)}
                        </span>
                      </td>

                      {/* Availability */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                          Available
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => openAvailabilityModal(doctor)}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                        >
                          <Clock3 size={15} />
                          Availability
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
          Add Doctor Modal
      ====================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Add Doctor
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Create a new doctor account and profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateDoctor} className="space-y-5 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    name="name"
                    value={doctorForm.name}
                    onChange={handleDoctorChange}
                    required
                    placeholder="Dr. John Doe"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={doctorForm.email}
                    onChange={handleDoctorChange}
                    required
                    placeholder="doctor@example.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <input
                    name="password"
                    type="password"
                    value={doctorForm.password}
                    onChange={handleDoctorChange}
                    required
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone
                  </label>

                  <input
                    name="phone"
                    value={doctorForm.phone}
                    onChange={handleDoctorChange}
                    placeholder="9876543210"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Specialization
                  </label>

                  <input
                    name="specialization"
                    value={doctorForm.specialization}
                    onChange={handleDoctorChange}
                    required
                    placeholder="Orthodontist"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                {/* Qualification */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Qualification
                  </label>

                  <input
                    name="qualification"
                    value={doctorForm.qualification}
                    onChange={handleDoctorChange}
                    required
                    placeholder="BDS, MDS"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Experience (years)
                  </label>

                  <input
                    name="experience"
                    type="number"
                    min="0"
                    value={doctorForm.experience}
                    onChange={handleDoctorChange}
                    required
                    placeholder="5"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                {/* Consultation Fee */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Consultation Fee
                  </label>

                  <input
                    name="consultationFee"
                    type="number"
                    min="0"
                    value={doctorForm.consultationFee}
                    onChange={handleDoctorChange}
                    required
                    placeholder="500"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Bio
                </label>

                <textarea
                  name="bio"
                  rows="3"
                  value={doctorForm.bio}
                  onChange={handleDoctorChange}
                  placeholder="Short professional biography..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              {/* Services */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Services
                </label>

                <input
                  name="services"
                  value={doctorForm.services}
                  onChange={handleDoctorChange}
                  placeholder="Cleaning, Braces, Root Canal"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Separate multiple services with commas.
                </p>
              </div>

              {/* Image */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Profile Image URL
                </label>

                <input
                  name="image"
                  value={doctorForm.image}
                  onChange={handleDoctorChange}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingDoctor}
                  className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingDoctor ? "Creating..." : "Create Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          Availability Modal
      ====================================================== */}
      {showAvailabilityModal && selectedDoctor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Doctor Availability
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedDoctor.user?.name || "Doctor"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAvailabilityModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {availability.length === 0 ? (
                <div className="rounded-xl bg-slate-50 px-4 py-8 text-center">
                  <Clock3 size={30} className="mx-auto text-slate-300" />

                  <p className="mt-3 text-sm text-slate-500">
                    No availability schedule has been configured for this
                    doctor.
                  </p>
                </div>
              ) : (
                availability.map((day, index) => (
                  <div
                    key={`${day.day}-${index}`}
                    className="grid grid-cols-[110px_1fr_1fr] items-center gap-3 rounded-xl border border-slate-100 p-3"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      {day.day}
                    </p>

                    <input
                      type="text"
                      value={day.startTime || ""}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          index,
                          "startTime",
                          e.target.value,
                        )
                      }
                      placeholder="09:00"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
                    />

                    <input
                      type="text"
                      value={day.endTime || ""}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          index,
                          "endTime",
                          e.target.value,
                        )
                      }
                      placeholder="17:00"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
                    />
                  </div>
                ))
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowAvailabilityModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveAvailability}
                  disabled={savingAvailability}
                  className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingAvailability ? "Saving..." : "Save Availability"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
