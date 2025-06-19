
const Doctor = require('../models/Doctor');
const { generateToken } = require('../utils/auth');
const { validateEmail, validatePassword, validatePhone } = require('../utils/validators');
const { AppError } = require('../utils/errors');
const User = require('../models/User');

class AuthService {
  async signup(input) {
    const { email, password, name, phone, role, specialization, experience } = input;

    // Validation
    if (!validateEmail(email)) throw new AppError('Invalid email format', 400);
    if (!validatePassword(password)) throw new AppError('Password must be at least 6 characters', 400);
    if (!validatePhone(phone)) throw new AppError('Invalid phone number', 400);

    const user = new User({ email, password, name, phone, role });
    await user.save();

    if (role === 'DOCTOR') {
      if (!specialization || !experience) {
        throw new AppError('Specialization and experience required for doctors', 400);
      }
      const doctor = new Doctor({
        userId: user._id,
        specialization,
        experience
      });
      await doctor.save();
    }

    const token = generateToken(user._id);
    return { token, user };
  }

  async login(input) {
    const { email, password } = input;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user._id);
    return { token, user };
  }
  
}

module.exports = new AuthService();