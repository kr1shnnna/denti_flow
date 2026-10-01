
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setError(
        "Name, email and password are required."
      );
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await registerUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left - Visual */}
        <div className="relative hidden overflow-hidden bg-teal-700 lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-700/90 via-teal-600/80 to-cyan-700/80" />

          <img
            src="/dental-hero.png"
            alt="Modern dental clinic"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />

          <div className="relative flex h-full items-center px-14">
            <div className="max-w-lg text-white">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-teal-100">
                Welcome to DentiFlow
              </p>

              <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
                Start your journey
                <br />
                to a healthier smile.
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-teal-50">
                Create your account and make dental care
                easier—from finding the right dentist to
                booking your next appointment.
              </p>

              <div className="mt-8 space-y-3">
                <Benefit text="Find experienced dentists" />
                <Benefit text="Book appointments easily" />
                <Benefit text="Manage your appointments" />
              </div>
            </div>
          </div>
        </div>

        {/* Right - Register Form */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            {/* Logo */}
            <Link
              to="/"
              className="mb-8 inline-flex items-center"
            >
              <img
                src="/logo/dentiflow-logo.png"
                alt="DentiFlow"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Heading */}
            <div className="mb-7">
              <p className="mb-2 text-sm font-semibold text-teal-600">
                Get started
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Join DentiFlow and make your dental
                appointments easier.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Register Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <InputField
                icon={<UserRound size={18} />}
                label="Full name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
              />

              <InputField
                icon={<Mail size={18} />}
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />

              <InputField
                icon={<Phone size={18} />}
                label="Phone number"
                name="phone"
                type="tel"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={handleChange}
              />

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showPassword ? "text" : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Login */}
            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-teal-600 hover:text-teal-700"
              >
                Sign in
              </Link>
            </p>

            {/* Security */}
            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} />
              Your information is securely protected.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  icon,
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
        />
      </div>
    </div>
  );
}

function Benefit({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
        <span className="text-sm text-teal-100">✓</span>
      </div>

      <span className="text-sm text-teal-50">
        {text}
      </span>
    </div>
  );
}

export default Register;
