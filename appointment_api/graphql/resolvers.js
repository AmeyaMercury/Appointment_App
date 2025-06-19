const authService = require('../services/authService');
const doctorService = require('../services/doctorService');
const appointmentService = require('../services/appointmentService');
const { authenticate, authorize } = require('../middleware/auth');

const resolvers = {
  Query: {
    me: async (_, __, { req }) => {
      return await authenticate(req);
    },

    availableSlots: async (_, { doctorId }) => {
      return await doctorService.getAvailableSlots(doctorId);
    },

    doctors: async () => {
      return await doctorService.getAllDoctors();
    },

    myAppointments: async (_, __, { req }) => {
      const user = await authenticate(req);
      return await appointmentService.getUserAppointments(user._id);
    }
  },

  Mutation: {
    signup: async (_, { input }) => {
      return await authService.signup(input);
    },

    login: async (_, { input }) => {
      return await authService.login(input);
    },

    createSlot: async (_, { input }, { req }) => {
      const user = await authenticate(req);
      authorize(['DOCTOR'])(user);
      return await doctorService.createSlot(user._id, input);
    },

    bookAppointment: async (_, { slotId }, { req }) => {
      const user = await authenticate(req);
      authorize(['USER'])(user);
      return await appointmentService.bookAppointment(user._id, slotId);
    }
  },

  // Type resolvers remain the same
  Doctor: {
    user: async (doctor) => doctor.userId
  },
  Slot: {
    doctor: async (slot) => slot.doctorId
  },
  Appointment: {
    user: async (appointment) => appointment.userId,
    doctor: async (appointment) => appointment.doctorId,
    slot: async (appointment) => appointment.slotId
  }
};

module.exports = resolvers;
