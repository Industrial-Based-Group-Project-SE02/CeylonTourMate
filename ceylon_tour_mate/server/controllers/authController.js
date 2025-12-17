const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

// Tourist self-registration
exports.register = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const userExists = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, role) 
       VALUES ($1, $2, $3, $4, $5, 'tourist') 
       RETURNING id, email, first_name, last_name, role`,
       RETURNING id, email, first_name, last_name, role, profile_picture`,
      [email.toLowerCase(), hashedPassword, firstName, lastName, phone]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
        role: user.role,
        profilePicture: user.profile_picture
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    client.release();
  }
};

// Login for all users
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: 'Your account has been deactivated' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
        role: user.role,
        profilePicture: user.profile_picture
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, phone, role, created_at 
      `SELECT id, email, first_name, last_name, phone, role, profile_picture, created_at 
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profile_picture,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, phone = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, email, first_name, last_name, phone, role`,
       RETURNING id, email, first_name, last_name, phone, role, profile_picture`,
      [firstName, lastName, phone, req.user.id]
    );

    const user = result.rows[0];

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role
        role: user.role,
        profilePicture: user.profile_picture
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get old profile picture to delete it
    const oldPicResult = await pool.query(
      'SELECT profile_picture FROM users WHERE id = $1',
      [req.user.id]
    );

    const oldPicture = oldPicResult.rows[0]?.profile_picture;

    // Delete old profile picture if exists
    if (oldPicture) {
      const oldPath = path.join(__dirname, '../uploads/profiles', path.basename(oldPicture));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update database with new profile picture path
    const filename = req.file.filename;
    const profilePictureUrl = `/uploads/profiles/${filename}`;

    const result = await pool.query(
      `UPDATE users 
       SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, email, first_name, last_name, role, profile_picture`,
      [profilePictureUrl, req.user.id]
    );

    const user = result.rows[0];

    res.json({
      message: 'Profile picture uploaded successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        profilePicture: user.profile_picture
      }
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    
    // Delete uploaded file if database update fails
    if (req.file) {
      const filePath = req.file.path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};

// Delete profile picture
exports.deleteProfilePicture = async (req, res) => {
  try {
    // Get current profile picture
    const result = await pool.query(
      'SELECT profile_picture FROM users WHERE id = $1',
      [req.user.id]
    );

    const profilePicture = result.rows[0]?.profile_picture;

    if (!profilePicture) {
      return res.status(404).json({ error: 'No profile picture to delete' });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../uploads/profiles', path.basename(profilePicture));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Update database
    await pool.query(
      `UPDATE users 
       SET profile_picture = NULL, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [req.user.id]
    );

    res.json({ message: 'Profile picture deleted successfully' });
  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({ error: 'Failed to delete profile picture' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const result = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};