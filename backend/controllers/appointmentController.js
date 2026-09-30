const Appointment = require("../models/Appointment");

const createAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, timeSlot, reason } = req.body;

    if (!patient || !doctor || !date || !timeSlot || !reason) {
      return res.status(400).json({
        message: "All appointment fields are required",
      });
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      date,
      timeSlot,
      reason,
    });

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    res.status(500).json({
      message: "Failed to create appointment",
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email phone")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ date: 1 });

    res.status(200).json({
      appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);

    res.status(500).json({
      message: "Failed to fetch appointments",
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
};
