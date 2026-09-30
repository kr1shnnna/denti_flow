
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// Create appointment
const createAppointment = async (req, res) => {
  try {
    const { doctor, date, timeSlot, reason } = req.body;

    if (!doctor || !date || !timeSlot || !reason) {
      return res.status(400).json({
        message: "Doctor, date, time slot and reason are required",
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
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

// Get appointments
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

// Get available appointment slots
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    // Validate date
    const selectedDate = new Date(`${date}T00:00:00`);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    // Get day name
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const dayName = dayNames[selectedDate.getDay()];

    // Sunday = clinic closed
    if (dayName === "Sunday") {
      return res.status(200).json({
        date,
        day: dayName,
        availableSlots: [],
        message: "The clinic is closed on Sundays.",
      });
    }

    // Find doctor
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // Check whether doctor is available
    if (!doctor.isAvailable) {
      return res.status(200).json({
        date,
        day: dayName,
        availableSlots: [],
        message: "Doctor is currently unavailable.",
      });
    }

    // Find doctor's schedule for selected day
    const schedule = doctor.availability.find(
      (item) =>
        item.day === dayName &&
        item.isAvailable === true
    );

    if (!schedule) {
      return res.status(200).json({
        date,
        day: dayName,
        availableSlots: [],
        message: "Doctor is not available on this day.",
      });
    }

    // Convert HH:MM to minutes
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    // Convert minutes to HH:MM
    const minutesToTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      return `${String(hours).padStart(2, "0")}:${String(
        mins
      ).padStart(2, "0")}`;
    };

    const startMinutes = timeToMinutes(schedule.startTime);
    const endMinutes = timeToMinutes(schedule.endTime);

    // Appointment duration = 30 minutes
    const SLOT_DURATION = 30;

    const allSlots = [];

    for (
      let time = startMinutes;
      time + SLOT_DURATION <= endMinutes;
      time += SLOT_DURATION
    ) {
      allSlots.push(minutesToTime(time));
    }

    // Get start and end of selected date
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59.999`);

    // Find appointments already booked for this doctor/date
    const appointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: {
        $in: ["pending", "confirmed"],
      },
    });

    // Get booked time slots
    const bookedSlots = appointments.map(
      (appointment) => appointment.timeSlot
    );

    // Remove booked slots
    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.status(200).json({
      date,
      day: dayName,
      doctor: doctor._id,
      availableSlots,
    });
  } catch (error) {
    console.error("Get available slots error:", error);

    res.status(500).json({
      message: "Failed to fetch available slots",
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAvailableSlots,
};

