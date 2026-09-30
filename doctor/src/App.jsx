
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/Dashboardheader";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

function Dashboard() {
  return (
    <div>
      <DashboardHeader />

      {/* Dashboard content will come here */}
    </div>
  );
}

function Appointments() {
  return (
    <h1 className="text-2xl font-semibold">
      Appointments
    </h1>
  );
}

function Patients() {
  return (
    <h1 className="text-2xl font-semibold">
      Patients
    </h1>
  );
}

function Availability() {
  return (
    <h1 className="text-2xl font-semibold">
      Availability
    </h1>
  );
}

function Notifications() {
  return (
    <h1 className="text-2xl font-semibold">
      Notifications
    </h1>
  );
}

function Profile() {
  return (
    <h1 className="text-2xl font-semibold">
      Profile
    </h1>
  );
}

function DoctorLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 min-h-screen p-8">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected doctor area */}
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<DoctorLayout />} />
      </Route>
    </Routes>
  );
}

export default App;

