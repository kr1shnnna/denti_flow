
const express = require("express");

const {
  createAppointment,
  getAvailableSlots,
  getMyAppointments,
  getDoctorAppointments,
  getAdminAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require("../controllers/appointmentController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Patient appointments
router.get(
  "/my",
  protect,
  authorizeRoles("patient"),
  getMyAppointments
);

// Doctor appointments
router.get(
  "/doctor",
  protect,
  authorizeRoles("doctor"),
  getDoctorAppointments
);

// Admin appointments
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAdminAppointments
);

// Create appointment
router.post(
  "/",
  protect,
  authorizeRoles("patient"),
  createAppointment
);

// Available slots
router.get(
  "/available-slots/:doctorId",
  getAvailableSlots
);


router.patch(
  "/:id/status",
  protect,
  authorizeRoles("doctor", "admin"),
  updateAppointmentStatus
);


router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles("patient"),
  cancelAppointment
);



module.exports = router;

