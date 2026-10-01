
import {
  UserRound,
  CalendarDays,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: UserRound,
      title: "Choose a Dentist",
      description:
        "Browse our experienced dentists and choose the right professional for your dental needs.",
    },
    {
      number: "02",
      icon: CalendarDays,
      title: "Select Service & Time",
      description:
        "Choose the treatment you need and select a convenient date and available time slot.",
    },
    {
      number: "03",
      icon: CheckCircle2,
      title: "Confirm Appointment",
      description:
        "Review your appointment details and confirm your booking in just a few clicks.",
    },
  ];

  return (
    <section className="bg-slate-50 px-6 py-20 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-teal-600">
            How It Works
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Booking your dental care,
            <span className="text-teal-600"> made simple.</span>
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500">
            Find a dentist, choose a convenient time, and
            book your appointment without the hassle.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* Connecting line */}
          <div className="absolute left-[18%] right-[18%] top-10 hidden h-px bg-slate-200 md:block" />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step Icon */}
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-8 border-slate-50 bg-teal-600 text-white shadow-lg shadow-teal-100">
                  <Icon size={28} strokeWidth={1.8} />
                </div>

                {/* Step Number */}
                <span className="mt-5 text-xs font-bold tracking-widest text-teal-600">
                  STEP {step.number}
                </span>

                {/* Content */}
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Small booking prompt */}
        <div className="mt-14 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-500 shadow-sm">
            <CheckCircle2
              size={17}
              className="text-teal-600"
            />

            <span>
              Your appointment is just a few clicks away.
            </span>

            <ArrowRight
              size={16}
              className="text-teal-600"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
