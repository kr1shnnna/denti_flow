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