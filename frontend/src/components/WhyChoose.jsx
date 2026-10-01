
import {
  ShieldCheck,
  CalendarCheck,
  UserRoundCheck,
  Sparkles,
} from "lucide-react";

function WhyChoose() {
  const features = [
    {
      icon: UserRoundCheck,
      title: "Experienced Dentists",
      description:
        "Connect with qualified dental professionals across different specializations.",
    },
    {
      icon: CalendarCheck,
      title: "Easy Appointment Booking",
      description:
        "Choose your dentist, treatment, date, and available time slot in just a few steps.",
    },
    {
      icon: ShieldCheck,
      title: "Trusted Dental Care",
      description:
        "A simple and reliable platform designed to make managing your dental care easier.",
    },
    {
      icon: Sparkles,
      title: "Personalized Care",
      description:
        "Explore treatments and find dental services that fit your individual needs.",
    },
  ];

  return (
    <section className="bg-white px-6 py-20 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-teal-600">
            Why DentiFlow
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Dental care made
            <span className="text-teal-600"> easier for you.</span>
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500">
            From finding the right dentist to managing your
            appointments, DentiFlow brings your dental care
            journey together in one place.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-100 bg-slate-50/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-teal-100 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition group-hover:bg-teal-600 group-hover:text-white">
                  <Icon size={23} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;
