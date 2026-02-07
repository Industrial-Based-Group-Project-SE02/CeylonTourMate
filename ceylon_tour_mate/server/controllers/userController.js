const bcrypt = require('bcrypt');
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// =====================
// Multer configuration for profile picture upload
// =====================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/profile-pictures');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.id}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error('Only image files (JPEG, PNG, GIF, WEBP) are allowed'));
  }
}).single('profilePicture');

// =====================
// User CRUD
// =====================

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    let query = 'SELECT id, email, first_name, last_name, phone, role, is_active, profile_picture, created_at FROM users';
    if (req.user.role === 'manager') {
      query += " WHERE role IN ('driver', 'hotel_agent')";
    }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query);
    const users = result.rows.map(u => ({
      id: u.id,
      email: u.email,
      firstName: u.first_name,
      lastName: u.last_name,
      phone: u.phone,
      role: u.role,
      isActive: u.is_active,
      profilePicture: u.profile_picture,
      createdAt: u.created_at
    }));

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get single user
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, phone, role, is_active, profile_picture, created_at FROM users WHERE id = $1',
      [id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'User not found' });

    const u = result.rows[0];
    res.json({
      id: u.id,
      email: u.email,
      firstName: u.first_name,
      lastName: u.last_name,
      phone: u.phone,
      role: u.role,
      isActive: u.is_active,
      profilePicture: u.profile_picture,
      createdAt: u.created_at
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create user
exports.createUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Role permission checks
    if (req.user.role === 'admin' && role !== 'manager') {
      return res.status(403).json({ error: 'Admin can only create managers' });
    }
    if (req.user.role === 'manager' && !['driver', 'hotel_agent'].includes(role)) {
      return res.status(403).json({ error: 'Manager can only create drivers and hotel agents' });
    }

    const userExists = await client.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (userExists.rows.length) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, role, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id, email, first_name, last_name, phone, role, is_active`,
      [email.toLowerCase(), hashedPassword, firstName, lastName, phone, role, req.user.id]
    );

    const u = result.rows[0];
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: u.id,
        email: u.email,
        firstName: u.first_name,
        lastName: u.last_name,
        phone: u.phone,
        role: u.role,
        isActive: u.is_active
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  } finally {
    client.release();
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET first_name=$1, last_name=$2, phone=$3, updated_at=CURRENT_TIMESTAMP
       WHERE id=$4
       RETURNING id, email, first_name, last_name, phone, role, is_active`,
      [firstName, lastName, phone, id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'User not found' });

    const u = result.rows[0];
    res.json({
      message: 'User updated successfully',
      user: {
        id: u.id,
        email: u.email,
        firstName: u.first_name,
        lastName: u.last_name,
        phone: u.phone,
        role: u.role,
        isActive: u.is_active
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING id', [id]);

    if (!result.rows.length) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Toggle user active status
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE users SET is_active = NOT is_active, updated_at=CURRENT_TIMESTAMP
       WHERE id=$1 RETURNING id, is_active`,
      [id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'User not found' });

    res.json({
      message: 'User status updated successfully',
      isActive: result.rows[0].is_active
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

// =====================
// Profile Picture Upload & Delete
// =====================
exports.uploadProfilePicture = (req, res) => {
  upload(req, res, async function (err) {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const filePath = `/uploads/profile-pictures/${req.file.filename}`;
      const result = await pool.query(
        'UPDATE users SET profile_picture=$1 WHERE id=$2 RETURNING id, profile_picture',
        [filePath, req.user.id]
      );

      res.json({
        message: 'Profile picture uploaded successfully',
        user: { id: result.rows[0].id, profilePicture: result.rows[0].profile_picture }
      });
    } catch (error) {
      console.error('Upload profile picture error:', error);
      res.status(500).json({ error: 'Failed to save profile picture' });
    }
  });
};

exports.deleteProfilePicture = async (req, res) => {
  try {
    const result = await pool.query('SELECT profile_picture FROM users WHERE id=$1', [req.user.id]);
    const picture = result.rows[0].profile_picture;

    if (!picture) return res.status(400).json({ error: 'No profile picture to delete' });

    const filePath = path.join(__dirname, '..', picture);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query('UPDATE users SET profile_picture=NULL WHERE id=$1', [req.user.id]);
    res.json({ message: 'Profile picture deleted successfully' });
  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({ error: 'Failed to delete profile picture' });
  }
};

// =====================
// Change Password
// =====================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const userResult = await pool.query('SELECT password FROM users WHERE id=$1', [req.user.id]);
    const hashedPassword = userResult.rows[0].password;

    const match = await bcrypt.compare(currentPassword, hashedPassword);
    if (!match) return res.status(400).json({ error: 'Current password is incorrect' });

    const newHashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2', [newHashed, req.user.id]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};
