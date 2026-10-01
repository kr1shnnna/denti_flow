
const User = require("../models/User");

// Get all patients — Admin only
const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      patients,
    });
  } catch (error) {
    console.error("Get patients error:", error);

    res.status(500).json({
      message: "Failed to fetch patients",
    });
  }
};

module.exports = {
  getPatients,
};
