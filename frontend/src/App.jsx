
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doctors from "./pages/Doctors";
import Services from "./pages/Services";
import About from "./pages/About";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/doctors" element={<Doctors />} />

      <Route path="/services" element={<Services />} />

      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
