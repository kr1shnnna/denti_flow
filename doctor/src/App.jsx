
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/Dashboardheader";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

import StatsCards from "./components/StatsCards";
import TodayAppointments from "./components/TodayAppointments";

import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import Availability from "./pages/Availability";

// =========================
// Dashboard
// =========================

function Dashboard() {
  return (
    <div>
      <DashboardHeader />
      <StatsCards />
      <TodayAppointments />
    </div>
  );
}

// =========================
// Profile
// =========================

function Profile() {
  return (
    <h1 className="text-2xl font-semibold">
      Profile
    </h1>
  );
}

// =========================
// Doctor Layout
// =========================

function DoctorLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 min-h-screen p-8">
        <Routes>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/appointments"
            element={<Appointments />}
          />

          <Route
            path="/patients"
            element={<Patients />}
          />

          <Route
            path="/availability"
            element={<Availability />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

// =========================
// App
// =========================

function App() {
  return (
    <Routes>
      {/* Public */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* Protected doctor area */}

      <Route element={<ProtectedRoute />}>
        <Route
          path="/*"
          element={<DoctorLayout />}
        />
      </Route>
    </Routes>
  );
}

export default App;

