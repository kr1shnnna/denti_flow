
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      const { token, user } = response.data;

      // Only doctors should access this frontend
      if (user.role !== "doctor") {
        setError("This login is only for doctors.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (error) {
      console.error("Doctor login error:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left side */}
      <div className="hidden w-1/2 items-center justify-center bg-teal-600 lg:flex">
        <div className="max-w-md px-10 text-white">
          <img
            src="/logo/dentiflow-logo.png"
            alt="DentiFlow"
            className="mb-10 h-12 w-auto brightness-0 invert"
          />

          <h1 className="text-4xl font-bold leading-tight">
            Welcome back, Doctor.
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-teal-50">
            Manage your appointments, patients and availability
            from one place.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-10 flex justify-center lg:hidden">
            <img
              src="/logo/dentiflow-logo.png"
              alt="DentiFlow"
              className="h-10 w-auto"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Doctor Login
            </h2>

            <p className="mt-2 text-slate-500">
              Sign in to access your DentiFlow dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="doctor@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-teal-600 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

