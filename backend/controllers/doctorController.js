const bcrypt = require("bcryptjs");

const Doctor = require("../models/Doctor");
const User = require("../models/User");

const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      qualification,
      experience,
      bio,
      consultationFee,
      services,
      image,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !specialization ||
      !qualification ||
      experience === undefined ||
      consultationFee === undefined
    ) {
      return res.status(400).json({
        message: "Required doctor fields are missing",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "A user already exists with this email",
      });
    }

    // Hash doctor's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create doctor user
    const doctorUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "doctor",
    });

    try {
      // Create doctor profile
      const doctor = await Doctor.create({
        user: doctorUser._id,
        specialization,
        qualification,
        experience,
        bio,
        consultationFee,
        services,
        image,
      });

      const populatedDoctor = await Doctor.findById(doctor._id).populate(
        "user",
        "name email phone profileImage"
      );

      res.status(201).json({
        message: "Doctor created successfully",
        doctor: populatedDoctor,
      });
    } catch (doctorError) {
      // If Doctor creation fails, remove the User we just created
      await User.findByIdAndDelete(doctorUser._id);

      throw doctorError;
    }
  } catch (error) {
    console.error("Create doctor error:", error);

    res.status(500).json({
      message: "Failed to create doctor",
    });
  }
};

// Get all doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isAvailable: true })
      .populate("user", "name email phone profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);

    res.status(500).json({
      message: "Failed to fetch doctors",
    });
  }
};

// Get a single doctor
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "name email phone profileImage"
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      doctor,
    });
  } catch (error) {
    console.error("Get doctor error:", error);

    res.status(500).json({
      message: "Failed to fetch doctor",
    });
  }
};

const updateDoctorAvailability = async (req, res) => {
  try {
    const { availability } = req.body || {};

    if (!Array.isArray(availability)) {
      return res.status(400).json({
        message: "Availability must be an array",
      });
    }

    // Sunday is a clinic-wide closed day
    const hasSunday = availability.some(
      (schedule) => schedule.day === "Sunday"
    );

    if (hasSunday) {
      return res.status(400).json({
        message: "Sunday is a clinic holiday",
      });
    }

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    doctor.availability = availability;

    await doctor.save();

    const updatedDoctor = await Doctor.findById(doctor._id).populate(
      "user",
      "name email phone profileImage"
    );

    res.status(200).json({
      message: "Doctor availability updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Update doctor availability error:", error);

    res.status(500).json({
      message: "Failed to update doctor availability",
    });
  }
};



const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user._id,
    }).populate(
      "user",
      "name email phone profileImage"
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    res.status(200).json({
      doctor,
    });
  } catch (error) {
    console.error("Get my doctor profile error:", error);

    res.status(500).json({
      message: "Failed to fetch doctor profile",
    });
  }
};


const updateMyDoctorProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      specialization,
      qualification,
      experience,
      bio,
      consultationFee,
      services,
    } = req.body;

    // Find the logged-in doctor's profile
    const doctor = await Doctor.findOne({
      user: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    // Update User fields
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    await user.save();

    // Update Doctor fields
    if (specialization !== undefined) {
      doctor.specialization = specialization.trim();
    }

    if (qualification !== undefined) {
      doctor.qualification = qualification.trim();
    }

    if (experience !== undefined) {
      doctor.experience = Number(experience);
    }

    if (bio !== undefined) {
      doctor.bio = bio.trim();
    }

    if (consultationFee !== undefined) {
      doctor.consultationFee = Number(consultationFee);
    }

    if (services !== undefined) {
      doctor.services = Array.isArray(services)
        ? services
        : [];
    }

    await doctor.save();

    // Return updated doctor with user information
    const updatedDoctor = await Doctor.findById(doctor._id).populate(
      "user",
      "name email phone profileImage"
    );

    res.status(200).json({
      message: "Doctor profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Update doctor profile error:", error);

    res.status(500).json({
      message: "Failed to update doctor profile",
    });
  }
};



const updateMyDoctorAvailability = async (req, res) => {
  try {
    const { availability } = req.body || {};

    if (!Array.isArray(availability)) {
      return res.status(400).json({
        message: "Availability must be an array",
      });
    }

    // Sunday is a clinic-wide closed day
    const hasSunday = availability.some(
      (schedule) => schedule.day === "Sunday"
    );

    if (hasSunday) {
      return res.status(400).json({
        message: "Sunday is a clinic holiday",
      });
    }

    const doctor = await Doctor.findOne({
      user: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    doctor.availability = availability;

    await doctor.save();

    const updatedDoctor = await Doctor.findById(
      doctor._id
    ).populate(
      "user",
      "name email phone profileImage"
    );

    res.status(200).json({
      message: "Availability updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error(
      "Update my doctor availability error:",
      error
    );

    res.status(500).json({
      message: "Failed to update availability",
    });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctorAvailability,
  getMyDoctorProfile,
  updateMyDoctorAvailability,
  updateMyDoctorProfile, 
};