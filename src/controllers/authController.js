const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phone, dateOfBirth, passportNumber } = req.body;
  try {
    // Check if user already exists
    const existingUser = await authModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await authModel.createUser({
      firstName,
      lastName,
      email,
      hashedPassword,
      phone,
      dob: dateOfBirth,
      passport: passportNumber
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: err.message
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authModel.getUserByEmail(email);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, 'TravelSecretKey123');

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser
};
