
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center">
              <img
                src="/logo/dentiflow-logo.png"
                alt="DentiFlow"
                className="h-10 w-auto"
              />
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
              Making dental care simpler by helping you find
              the right dentist and book appointments with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="transition hover:text-teal-400"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/doctors"
                  className="transition hover:text-teal-400"
                >
                  Doctors
                </Link>
              </li>

              <li>
                <Link
                  to="/services"
                  className="transition hover:text-teal-400"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="transition hover:text-teal-400"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Patient Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              For Patients
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  to="/appointments"
                  className="inline-flex items-center gap-1.5 transition hover:text-teal-400"
                >
                  Book Appointment
                  <ArrowUpRight size={13} />
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="transition hover:text-teal-400"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="transition hover:text-teal-400"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-teal-400"
                />

                <span className="text-slate-400">
                  DentiFlow Dental Care
                </span>
              </div>

              <a
                href="tel:+910000000000"
                className="flex items-center gap-3 transition hover:text-teal-400"
              >
                <Phone
                  size={17}
                  className="shrink-0 text-teal-400"
                />

                <span>+91 00000 00000</span>
              </a>

              <a
                href="mailto:support@dentiflow.com"
                className="flex items-center gap-3 transition hover:text-teal-400"
              >
                <Mail
                  size={17}
                  className="shrink-0 text-teal-400"
                />

                <span>support@dentiflow.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-slate-800 pt-6">
          <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} DentiFlow. All
              rights reserved.
            </p>

            <p>
              Your smile, our priority.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
