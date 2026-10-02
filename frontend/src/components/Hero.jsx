
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Play } from "lucide-react";

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src="/dental-hero.png"
        alt="Modern dental care"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-slate-950/55" />

      {/* Soft Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-transparent" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-16 pt-28 lg:px-8">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-teal-400" />

            <span className="text-sm font-medium text-white">
              Your smile, our priority
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Modern dental care,
            <br />
            <span className="text-teal-300">
              made simple.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
            Find trusted dentists, explore treatments, and
            book your dental appointment effortlessly with
            DentiFlow.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/appointments/book"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-500"
            >
              <CalendarDays size={18} />

              Book an Appointment

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/doctors"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Find a Dentist
            </Link>
          </div>

          {/* Trust Information */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div>
              <p className="text-2xl font-bold text-white">
                12+
              </p>

              <p className="text-xs text-slate-300">
                Experienced Dentists
              </p>
            </div>

            <div className="h-10 w-px bg-white/20" />

            <div>
              <p className="text-2xl font-bold text-white">
                Easy
              </p>

              <p className="text-xs text-slate-300">
                Appointment Booking
              </p>
            </div>

            <div className="h-10 w-px bg-white/20" />

            <div>
              <p className="text-2xl font-bold text-white">
                24/7
              </p>

              <p className="text-xs text-slate-300">
                Online Access
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

export default Hero;
