// backend/routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('===> Register body:', req.body);
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hash });
    const saved = await user.save();

    const token = jwt.sign(
      { id: saved._id },
      process.env.JWT_SECRET || process.env.JWT_TOKEN_SECRET_KEY || 'secret',
      { expiresIn: '7d' }
    );

    const userSafe = {
      id: saved._id,
      name: saved.name,
      email: saved.email,
      createdAt: saved.createdAt
    };

    return res.status(201).json({
      message: 'User created successfully',
      user: userSafe,
      token
    });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    console.log('===> Login body:', req.body);
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || process.env.JWT_TOKEN_SECRET_KEY || 'secret',
      { expiresIn: '7d' }
    );

    const userSafe = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    return res.json({
      message: 'Login successful',
      user: userSafe,
      token
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});


// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
