const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// Create appointment
const createAppointment = async (req, res) => {
  try {
    const { doctor, date, timeSlot, reason } = req.body;

    // Basic validation
    if (!doctor || !date || !timeSlot || !reason) {
      return res.status(400).json({
        message: "Doctor, date, time slot and reason are required",
      });
    }

    // Validate MongoDB doctor ID
    if (!mongoose.Types.ObjectId.isValid(doctor)) {
      return res.status(400).json({
        message: "Invalid doctor ID",
      });
    }

    // Find doctor
    const doctorData = await Doctor.findById(doctor);

    if (!doctorData) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // Check if doctor is available
    if (!doctorData.isAvailable) {
      return res.status(400).json({
        message: "Doctor is currently unavailable",
      });
    }

    // Validate date format: YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(date)) {
      return res.status(400).json({
        message: "Date must be in YYYY-MM-DD format",
      });
    }

    // Create selected date
    const selectedDate = new Date(`${date}T00:00:00`);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    // Make sure the date did not roll over
    // Example: 2026-02-31 should not become another date
    const [year, month, day] = date.split("-").map(Number);

    if (
      selectedDate.getFullYear() !== year ||
      selectedDate.getMonth() !== month - 1 ||
      selectedDate.getDate() !== day
    ) {
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
      return res.status(400).json({
        message: "The clinic is closed on Sundays",
      });
    }

    // Find doctor's schedule for selected day
    const schedule = doctorData.availability.find(
      (item) =>
        item.day === dayName &&
        item.isAvailable === true
    );

    if (!schedule) {
      return res.status(400).json({
        message: "Doctor is not available on this day",
      });
    }

    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeRegex.test(timeSlot)) {
      return res.status(400).json({
        message: "Invalid time slot. Use HH:MM format",
      });
    }

    // Convert HH:MM to minutes
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const selectedTime = timeToMinutes(timeSlot);
    const startTime = timeToMinutes(schedule.startTime);
    const endTime = timeToMinutes(schedule.endTime);

    // Make sure the selected time is a 30-minute slot
    const isValidSlot =
      (selectedTime - startTime) % 30 === 0;

    if (!isValidSlot) {
      return res.status(400).json({
        message: "Invalid appointment slot. Appointments must be in 30-minute intervals",
      });
    }

    // Make sure the appointment fits inside working hours
    if (
      selectedTime < startTime ||
      selectedTime + 30 > endTime
    ) {
      return res.status(400).json({
        message: "Selected time is outside the doctor's working hours",
      });
    }

    // Prevent booking a past date
    const now = new Date();

    const todayString =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    if (date < todayString) {
      return res.status(400).json({
        message: "Cannot book an appointment for a past date",
      });
    }

    // If appointment is today, prevent booking past time slots
    if (date === todayString) {
      const currentMinutes =
        now.getHours() * 60 + now.getMinutes();

      if (selectedTime <= currentMinutes) {
        return res.status(400).json({
          message: "Cannot book a time slot that has already passed",
        });
      }
    }

    // Get start and end of selected date
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59.999`);

    // Check for duplicate booking
    const existingAppointment = await Appointment.findOne({
      doctor,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      timeSlot,
      status: {
        $in: ["pending", "confirmed"],
      },
    });

    if (existingAppointment) {
      return res.status(409).json({
        message: "This appointment slot is already booked",
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      date: selectedDate,
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



// Get logged-in patient's appointments
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user._id,
    })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email phone profileImage",
        },
      })
      .sort({ date: 1, createdAt: -1 });

    res.status(200).json({
      appointments,
    });
  } catch (error) {
    console.error("Get my appointments error:", error);

    res.status(500).json({
      message: "Failed to fetch your appointments",
    });
  }
};


module.exports = {
  createAppointment,
  getAppointments,
  getAvailableSlots,
  getMyAppointments,
};

