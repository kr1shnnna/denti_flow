const express = require("express");

const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctorAvailability,
  getMyDoctorProfile,
  updateMyDoctorAvailability
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



router.get(
  "/me",
  protect,
  authorizeRoles("doctor"),
  getMyDoctorProfile
);

router.patch(
  "/me/availability",
  protect,
  authorizeRoles("doctor"),
  updateMyDoctorAvailability
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