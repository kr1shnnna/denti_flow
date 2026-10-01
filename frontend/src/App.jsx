
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doctors from "./pages/Doctors";
import Services from "./pages/Services";
import About from "./pages/About";
import Appointments from "./pages/Appointments";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* =========================
          Public Routes
      ========================= */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/doctors" element={<Doctors />} />

      <Route path="/services" element={<Services />} />

      <Route path="/about" element={<About />} />

      {/* =========================
          Patient Protected Routes
      ========================= */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/appointments"
          element={<Appointments />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />
      </Route>
    </Routes>
  );
}

export default App;
