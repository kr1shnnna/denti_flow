import { CalendarDays, Clock3, IndianRupee, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DoctorProfileModal({ doctor, onClose }) {
  const navigate = useNavigate();

  if (!doctor) {
    return null;
  }

  const doctorName = doctor.user?.name || "Dental Specialist";

  const image = doctor.image
    ? `http://localhost:5000${doctor.image}`
    : doctor.user?.profileImage
      ? `http://localhost:5000${doctor.user.profileImage}`
      : "/doctor-placeholder.png";

  const specialization = doctor.specialization || "General Dentist";

  const qualification = doctor.qualification || "Dental Professional";

  const experience = doctor.experience || 0;

  const consultationFee = doctor.consultationFee || 0;

  const services = doctor.services || [];

  const handleBookAppointment = () => {
    onClose();

    navigate(`/appointments/book?doctor=${doctor._id}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close doctor profile"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
        >
          <X size={20} />
        </button>

        {/* Doctor Header */}
        <div className="grid md:grid-cols-[240px_1fr]">
          {/* Doctor Image */}
          <div className="h-72 bg-slate-100 md:h-full">
            <img
              src={image}
              alt={doctorName}
              className="h-full w-full object-cover object-top"
            />
          </div>

          {/* Basic Information */}
          <div className="p-6 sm:p-8">
            <span className="inline-flex rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-600">
              {specialization}
            </span>

            <h2 className="mt-3 pr-10 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {doctorName}
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-500">
              {qualification}
            </p>

            {/* Experience + Fee */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-teal-600">
                  <Clock3 size={18} />

                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Experience
                  </span>
                </div>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  {experience} years
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-teal-600">
                  <IndianRupee size={18} />

                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Consultation
                  </span>
                </div>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  ₹{consultationFee}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="border-t border-slate-100 p-6 sm:p-8">
          {/* About */}
          <section>
            <h3 className="text-lg font-bold text-slate-900">
              About {doctorName}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              {doctor.bio ||
                "This dentist provides professional dental care and personalized treatment based on each patient's needs."}
            </p>
          </section>

          {/* Services */}
          <section className="mt-7">
            <h3 className="text-lg font-bold text-slate-900">Services</h3>

            {services.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {services.map((service, index) => (
                  <span
                    key={`${service}-${index}`}
                    className="rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700"
                  >
                    {service}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                Services information is currently unavailable.
              </p>
            )}
          </section>

          {/* Booking */}
          <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Ready to book an appointment?
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Select a service, date and available time slot.
              </p>
            </div>

            <button
              type="button"
              onClick={handleBookAppointment}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              <CalendarDays size={17} />
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfileModal;
