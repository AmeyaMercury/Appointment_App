const Doctor = require('../models/Doctor');
const Slot = require('../models/Slot');
const { AppError } = require('../utils/errors');

class DoctorService {
  async getAllDoctors() {
    return await Doctor.find().populate('userId');
  }

  async createSlot(doctorUserId, slotData) {
    const doctor = await Doctor.findOne({ userId: doctorUserId });
    if (!doctor) throw new AppError('Doctor profile not found', 404);

    const slot = new Slot({
      doctorId: doctor._id,
      ...slotData
    });
    await slot.save();

    return await Slot.findById(slot._id).populate({
      path: 'doctorId',
      populate: { path: 'userId' }
    });
  }

  async getAvailableSlots(doctorId = null) {
    const filter = { isBooked: false };
    if (doctorId) filter.doctorId = doctorId;
    
    return await Slot.find(filter).populate({
      path: 'doctorId',
      populate: { path: 'userId' }
    });
  }
}

module.exports = new DoctorService();
