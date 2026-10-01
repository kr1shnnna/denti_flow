
const express = require("express");

const {
  getPatients,
} = require("../controllers/userController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin → Get all patients
router.get(
  "/patients",
  protect,
  authorizeRoles("admin"),
  getPatients
);

module.exports = router;
