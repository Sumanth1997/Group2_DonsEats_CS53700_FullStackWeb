// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Authenticate user logic
  if (email === 'test@gmail.com' && password === 'pass123') {
    const token = jwt.sign({ id: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ message: 'Login successful', token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
};

exports.register = async (req, res) => {
  const { email, password } = req.body;

  // Hash password and save user logic
  const hashedPassword = await bcrypt.hash(password, 10);
  // Save to DB (mock example)
  res.status(201).json({ message: 'User registered' });
};
