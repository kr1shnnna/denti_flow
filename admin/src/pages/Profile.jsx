
import {
  UserRound,
  Mail,
  ShieldCheck,
  LogOut,
  CircleUserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const name = user?.name || "DentiFlow Admin";
  const email = user?.email || "—";
  const role = user?.role || "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-teal-600">
          Account
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Profile
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View your administrator account information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Profile Header */}
        <div className="border-b border-slate-200 bg-gradient-to-r from-teal-50 to-white px-6 py-8 sm:px-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-teal-100 text-teal-700 ring-4 ring-white shadow-sm">
              <CircleUserRound size={48} strokeWidth={1.5} />
            </div>

            {/* Name */}
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-slate-900">
                {name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                DentiFlow Administrator
              </p>

              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold capitalize text-teal-700 ring-1 ring-inset ring-teal-600/20">
                <ShieldCheck size={13} />
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="px-6 py-7 sm:px-8">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-slate-900">
              Account Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your administrator account details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Name */}
            <InfoCard
              icon={<UserRound size={18} />}
              label="Full Name"
              value={name}
            />

            {/* Email */}
            <InfoCard
              icon={<Mail size={18} />}
              label="Email Address"
              value={email}
            />

            {/* Role */}
            <InfoCard
              icon={<ShieldCheck size={18} />}
              label="Account Role"
              value="Administrator"
            />
          </div>
        </div>

        {/* Logout */}
        <div className="border-t border-slate-200 bg-slate-50/60 px-6 py-5 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Sign out
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Sign out of your DentiFlow administrator account.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default Profile;