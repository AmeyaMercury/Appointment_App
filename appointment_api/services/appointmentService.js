const Appointment = require('../models/Appointment');
const Slot = require('../models/Slot');
const { AppError } = require('../utils/errors');

class AppointmentService {
  async bookAppointment(userId, slotId) {
    const slot = await Slot.findById(slotId);
    if (!slot || slot.isBooked) {
      throw new AppError('Slot not available', 400);
    }

    slot.isBooked = true;
    await slot.save();

    const appointment = new Appointment({
      userId,
      doctorId: slot.doctorId,
      slotId: slot._id
    });
    await appointment.save();

    return await Appointment.findById(appointment._id)
      .populate('userId')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId' }
      })
      .populate('slotId');
  }

  async getUserAppointments(userId) {
    return await Appointment.find({ userId })
      .populate('userId')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId' }
      })
      .populate('slotId');
  }
}

module.exports = new AppointmentService();