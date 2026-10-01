
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
  Pencil,
  X,
  Save,
} from "lucide-react";

import {
  getMyDoctorProfile,
  updateMyDoctorProfile,
} from "../services/api";

const Profile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    bio: "",
    consultationFee: "",
    services: [],
  });

  const [serviceInput, setServiceInput] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // =========================
  // Fetch doctor
  // =========================

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const data = await getMyDoctorProfile();

      setDoctor(data.doctor);

      const currentDoctor = data.doctor;

      setFormData({
        name: currentDoctor.user?.name || "",
        phone: currentDoctor.user?.phone || "",
        specialization: currentDoctor.specialization || "",
        qualification: currentDoctor.qualification || "",
        experience: currentDoctor.experience ?? "",
        bio: currentDoctor.bio || "",
        consultationFee: currentDoctor.consultationFee ?? "",
        services: Array.isArray(currentDoctor.services)
          ? currentDoctor.services
          : [],
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to load doctor profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Form changes
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // Add service
  // =========================

  const handleAddService = () => {
    const service = serviceInput.trim();

    if (!service) {
      return;
    }

    if (
      formData.services.some(
        (item) => item.toLowerCase() === service.toLowerCase()
      )
    ) {
      setServiceInput("");
      return;
    }

    setFormData((current) => ({
      ...current,
      services: [...current.services, service],
    }));

    setServiceInput("");
  };

  // =========================
  // Remove service
  // =========================

  const handleRemoveService = (serviceToRemove) => {
    setFormData((current) => ({
      ...current,
      services: current.services.filter(
        (service) => service !== serviceToRemove
      ),
    }));
  };

  // =========================
  // Save profile
  // =========================

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const data = await updateMyDoctorProfile(formData);

      setDoctor(data.doctor);

      setFormData({
        name: data.doctor.user?.name || "",
        phone: data.doctor.user?.phone || "",
        specialization: data.doctor.specialization || "",
        qualification: data.doctor.qualification || "",
        experience: data.doctor.experience ?? "",
        bio: data.doctor.bio || "",
        consultationFee: data.doctor.consultationFee ?? "",
        services: Array.isArray(data.doctor.services)
          ? data.doctor.services
          : [],
      });

      setEditing(false);
      setMessage("Profile updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Cancel editing
  // =========================

  const handleCancel = () => {
    if (!doctor) {
      return;
    }

    setFormData({
      name: doctor.user?.name || "",
      phone: doctor.user?.phone || "",
      specialization: doctor.specialization || "",
      qualification: doctor.qualification || "",
      experience: doctor.experience ?? "",
      bio: doctor.bio || "",
      consultationFee: doctor.consultationFee ?? "",
      services: Array.isArray(doctor.services)
        ? doctor.services
        : [],
    });

    setServiceInput("");
    setEditing(false);
    setErrorMessage("");
  };

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

        <p className="mt-2 text-sm text-red-500">
          {errorMessage || "Doctor profile could not be loaded."}
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

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your professional and account information.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setMessage("");
              setErrorMessage("");
            }}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {/* =========================
          Success message
      ========================= */}

      {message && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {message}
        </div>
      )}

      {/* =========================
          Error message
      ========================= */}

      {errorMessage && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {errorMessage}
        </div>
      )}

      {/* =========================
          Profile Overview
      ========================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-teal-50 to-slate-50" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
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
          Edit Form
      ========================= */}

      {editing ? (
        <form
          onSubmit={handleSave}
          className="space-y-6"
        >
          {/* Personal Information */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-base font-semibold text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Update your basic account information.
              </p>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <FormField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <FormField
                label="Email Address"
                value={email}
                disabled
              />

              <FormField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Professional Information */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-base font-semibold text-slate-900">
                Professional Information
              </h2>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <FormField
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
              />

              <FormField
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
              />

              <FormField
                label="Experience (years)"
                name="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                required
              />

              <FormField
                label="Consultation Fee"
                name="consultationFee"
                type="number"
                min="0"
                value={formData.consultationFee}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Bio */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-base font-semibold text-slate-900">
                About
              </h2>
            </div>

            <div className="p-6">
              <label className="text-xs font-medium text-slate-600">
                Professional Bio
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={5}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Tell patients about your experience and expertise..."
              />
            </div>
          </div>

          {/* Services */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-base font-semibold text-slate-900">
                Services
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Add or remove the services you provide.
              </p>
            </div>

            <div className="p-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={serviceInput}
                  onChange={(event) =>
                    setServiceInput(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddService();
                    }
                  }}
                  placeholder="Add a service"
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

                <button
                  type="button"
                  onClick={handleAddService}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Add
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {formData.services.length > 0 ? (
                  formData.services.map((service) => (
                    <span
                      key={service}
                      className="flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700"
                    >
                      {service}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveService(service)
                        }
                        className="rounded-full text-teal-500 transition hover:text-red-500"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    No services added.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}

          <div className="flex justify-end gap-3 pb-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* Personal Information */}

          <InfoSection title="Personal Information">
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
          </InfoSection>

          {/* Professional Information */}

          <InfoSection title="Professional Information">
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
          </InfoSection>

          {/* Services */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-base font-semibold text-slate-900">
                Services
              </h2>
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

          {/* About */}

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
                {doctor.bio ||
                  "No professional bio has been added yet."}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// =========================
// Form Field
// =========================

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
  required = false,
  min,
}) => {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        min={min}
        className={`mt-2 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
            : "border-slate-200 text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        }`}
      />
    </div>
  );
};

// =========================
// Info Section
// =========================

const InfoSection = ({ title, children }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-base font-semibold text-slate-900">
          {title}
        </h2>
      </div>

      <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
};

// =========================
// Info Item
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
