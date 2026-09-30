const express = require("express");

const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctorAvailability,
} = require("../controllers/doctorController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createDoctor
);

router.patch(
  "/:id/availability",
  protect,
  authorizeRoles("admin"),
  updateDoctorAvailability
);


router.get("/", getDoctors);

router.get("/:id", getDoctorById);

module.exports = router;