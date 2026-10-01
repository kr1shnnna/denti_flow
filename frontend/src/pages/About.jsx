
import {
  CalendarCheck,
  ShieldCheck,
  Users,
  HeartPulse,
  Clock3,
  Search,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  const benefits = [
    {
      icon: Search,
      title: "Find the Right Dentist",
      description:
        "Explore experienced dental professionals and choose a dentist based on your needs and specialization.",
    },
    {
      icon: CalendarCheck,
      title: "Simple Appointment Booking",
      description:
        "Choose your dentist, select a service and available time, and confirm your appointment in just a few steps.",
    },
    {
      icon: Clock3,
      title: "Convenient Access",
      description:
        "Manage your dental appointments from one place without unnecessary calls or complicated processes.",
    },
    {
      icon: ShieldCheck,
      title: "Patient-Focused Experience",
      description:
        "DentiFlow is designed to make the journey from finding a dentist to booking care clear and straightforward.",
    },
  ];

  const stats = [
    {
      value: "12+",
      label: "Experienced Dentists",
    },
    {
      value: "6+",
      label: "Dental Services",
    },
    {
      value: "24/7",
      label: "Online Access",
    },
    {
      value: "Easy",
      label: "Appointment Booking",
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
              About DentiFlow
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Making dental care
              <span className="text-teal-600">
                {" "}simpler for everyone.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500">
              DentiFlow brings dentists, dental services, and
              appointment booking together in one simple
              platform.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          Our Story
      ========================= */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Visual */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-200">
            <img
              src="/dental-hero.png"
              alt="Modern dental clinic"
              className="h-[420px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 rounded-2xl bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <HeartPulse size={21} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Your smile, our priority.
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Patient-focused dental care
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">
              Our Story
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Dental care should be
              <span className="text-teal-600">
                {" "}easy to navigate.
              </span>
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-500">
              Finding the right dentist and booking an
              appointment shouldn't feel complicated. DentiFlow
              was created to bring these steps together into a
              simple and convenient digital experience.
            </p>

            <p className="mt-4 text-base leading-7 text-slate-500">
              From discovering experienced dentists to choosing
              a service and available time slot, DentiFlow helps
              patients manage the appointment process from one
              place.
            </p>

            <div className="mt-7 space-y-3">
              {[
                "Browse experienced dental professionals",
                "Explore available dental services",
                "Book appointments in a few simple steps",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium text-slate-700"
                >
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-teal-600"
                  />

                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Stats
      ========================= */}
      <section className="bg-white px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="px-5 text-center first:pl-0 last:pr-0"
              >
                <p className="text-3xl font-bold text-teal-600 sm:text-4xl">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          Why DentiFlow
      ========================= */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-teal-600">
              Why DentiFlow
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need,
              <span className="text-teal-600">
                {" "}in one place.
              </span>
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-500">
              We focus on removing unnecessary complexity from
              the dental appointment experience.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <Icon size={23} strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================
          Our Approach
      ========================= */}
      <section className="bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Content */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                Our Approach
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                A better way to manage
                <span className="text-teal-600">
                  {" "}your dental appointments.
                </span>
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-500">
                DentiFlow is built around a straightforward
                idea: patients should be able to discover dental
                care and manage appointments without unnecessary
                friction.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-600">
                    01
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Discover
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Explore dentists and services that match
                      your needs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-600">
                    02
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Choose
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Select your preferred dentist, service,
                      date, and available time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-600">
                    03
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Book
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Confirm your appointment and keep your
                      dental care organized.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Card */}
            <div className="rounded-3xl bg-slate-950 p-8 sm:p-10">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 text-white">
                  <Users size={24} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Patient-first platform
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Designed around a simple experience
                  </p>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                {[
                  "Find experienced dentists",
                  "Explore dental services",
                  "Choose available appointment slots",
                  "Manage your appointments",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-teal-400"
                    />

                    <span className="text-sm text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================= */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-teal-600 px-8 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to find your dentist?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-teal-50 sm:text-base">
            Explore our dentists and find the right dental
            professional for your next appointment.
          </p>

          <Link
            to="/doctors"
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

export default About;