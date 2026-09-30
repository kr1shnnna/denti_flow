const express = require("express");

const {
  createAppointment,
  getAppointments,
  getAvailableSlots,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createAppointment);

router.get("/", protect, getAppointments);

router.get(
  "/available-slots/:doctorId",
  getAvailableSlots
);

module.exports = router;