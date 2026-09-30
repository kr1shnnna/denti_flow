const express = require("express");

const {
  createAppointment,
  getAppointments,
  getAvailableSlots,
  getMyAppointments,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// Patient appointment history 
router.get("/my", protect, getMyAppointments);

// Create a new appointment
router.post("/", protect, createAppointment);

// Get all appointments (admin only)
router.get("/", protect, getAppointments);



router.get(
  "/available-slots/:doctorId",
  getAvailableSlots
);



module.exports = router;