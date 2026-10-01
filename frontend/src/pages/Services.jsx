
import {
  Stethoscope,
  Sparkles,
  CircleDot,
  Smile,
  Gem,
  Syringe,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Services() {
  const services = [
    {
      icon: Stethoscope,
      title: "General Checkup",
      description:
        "Regular dental examinations help identify potential problems early and keep your teeth and gums healthy.",
      points: [
        "Routine dental examination",
        "Oral health assessment",
        "Early problem detection",
      ],
    },
    {
      icon: Sparkles,
      title: "Teeth Cleaning",
      description:
        "Professional dental cleaning helps remove plaque and buildup while keeping your smile fresh and healthy.",
      points: [
        "Plaque and tartar removal",
        "Gum health assessment",
        "Professional cleaning",
      ],
    },
    {
      icon: CircleDot,
      title: "Root Canal Treatment",
      description:
        "Root canal treatment helps treat damaged or infected teeth and can help preserve your natural tooth.",
      points: [
        "Treatment of infected teeth",
        "Pain and infection management",
        "Natural tooth preservation",
      ],
    },
    {
      icon: Smile,
      title: "Braces & Aligners",
      description:
        "Orthodontic treatments help improve tooth alignment and create a healthier, more confident smile.",
      points: [
        "Teeth alignment",
        "Braces consultation",
        "Clear aligner options",
      ],
    },
    {
      icon: Gem,
      title: "Cosmetic Dentistry",
      description:
        "Cosmetic dental treatments focus on improving the appearance of your smile while maintaining natural results.",
      points: [
        "Smile improvement",
        "Cosmetic consultation",
        "Personalized treatment planning",
      ],
    },
    {
      icon: Syringe,
      title: "Dental Procedures",
      description:
        "Get professional dental care for a range of common procedures based on your individual needs.",
      points: [
        "Personalized dental assessment",
        "Treatment recommendations",
        "Professional dental care",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* =========================
          Hero
      ========================= */}
      <section className="bg-white px-6 pb-16 pt-32 sm:pt-36 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-teal-600">
              Our Services
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Complete dental care,
              <span className="text-teal-600">
                {" "}made simple.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500">
              Explore our range of dental services and find
              the care you need from experienced dental
              professionals.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          Services
      ========================= */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl hover:shadow-slate-200/60"
                >
                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition duration-300 group-hover:bg-teal-600 group-hover:text-white">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  {/* Title */}
                  <h2 className="mt-6 text-xl font-bold text-slate-900">
                    {service.title}
                  </h2>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm text-slate-600"
                      >
                        <CheckCircle2
                          size={17}
                          className="mt-0.5 shrink-0 text-teal-600"
                        />

                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Booking */}
                  <Link
                    to="/appointments"
                    className="group/link mt-7 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition hover:text-teal-700"
                  >
                    Book an Appointment

                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover/link:translate-x-1"
                    />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================
          Bottom Information
      ========================= */}
      <section className="px-6 pb-20 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-teal-600 px-8 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Not sure which service you need?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-teal-50 sm:text-base">
            Start by booking an appointment with one of our
            dentists. They can assess your needs and recommend
            the appropriate treatment.
          </p>

          <Link
            to="/appointments"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-teal-700 transition hover:bg-slate-50"
          >
            Find a Dentist

            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Services;
