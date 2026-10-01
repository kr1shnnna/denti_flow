
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";




const Appointments = () => (
  <h2 className="text-2xl font-semibold text-slate-900">
    Appointments
  </h2>
);



const Patients = () => (
  <h2 className="text-2xl font-semibold text-slate-900">
    Patients
  </h2>
);

const Notifications = () => (
  <h2 className="text-2xl font-semibold text-slate-900">
    Notifications
  </h2>
);

const Profile = () => (
  <h2 className="text-2xl font-semibold text-slate-900">
    Profile
  </h2>
);

const ProtectedAdminRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!token || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <AdminLayout />;
};

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Area */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/patients" element={<Patients />} />
        <Route
          path="/notifications"
          element={<Notifications />}
        />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default App;