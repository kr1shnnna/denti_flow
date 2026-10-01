
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import Profile from "./pages/Profile";





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