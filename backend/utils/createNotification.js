
const Notification = require("../models/Notification");

const createNotification = async ({
  recipient,
  type,
  title,
  message,
  appointment = null,
}) => {
  try {
    return await Notification.create({
      recipient,
      type,
      title,
      message,
      appointment,
    });
  } catch (error) {
    console.error("Create notification error:", error);

    // Notification failure should not break
    // the actual appointment operation.
    return null;
  }
};

module.exports = createNotification;

