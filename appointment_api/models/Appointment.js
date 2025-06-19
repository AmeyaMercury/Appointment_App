const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  status: { type: String, enum: ['BOOKED', 'CANCELLED'], default: 'BOOKED' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);