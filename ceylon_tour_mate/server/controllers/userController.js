// const pool = require('../config/db');

// // Get all users
// const getAllUsers = async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Get single user
// const getUserById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }
    
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Create user
// const createUser = async (req, res) => {
//   try {
//     const { name, email } = req.body;
    
//     // Validation
//     if (!name || !email) {
//       return res.status(400).json({ error: 'Name and email are required' });
//     }
    
//     const result = await pool.query(
//       'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
//       [name, email]
//     );
    
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     if (err.code === '23505') {
//       return res.status(400).json({ error: 'Email already exists' });
//     }
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Update user
// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, email } = req.body;
    
//     const result = await pool.query(
//       'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
//       [name, email, id]
//     );
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }
    
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Delete user
// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }
    
//     res.json({ message: 'User deleted successfully' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// module.exports = {
//   getAllUsers,
//   getUserById,
//   createUser,
//   updateUser,
//   deleteUser,
// };


const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Get users based on role
exports.getAllUsers = async (req, res) => {
  try {
    let query = 'SELECT id, email, first_name, last_name, phone, role, is_active, created_at FROM users';
    let params = [];

    // Admin sees all users
    // Manager sees only drivers and hotel_agents
    if (req.user.role === 'manager') {
      query += " WHERE role IN ('driver', 'hotel_agent')";
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    
    const users = result.rows.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at
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
      `SELECT id, email, first_name, last_name, phone, role, is_active, created_at 
       FROM users WHERE id = $1`,
      [id]
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
      isActive: user.is_active,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create user (admin creates manager, manager creates driver/hotel_agent)
exports.createUser = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Role-based permission check
    if (req.user.role === 'admin' && role !== 'manager') {
      return res.status(403).json({ error: 'Admin can only create managers' });
    }

    if (req.user.role === 'manager' && !['driver', 'hotel_agent'].includes(role)) {
      return res.status(403).json({ error: 'Manager can only create drivers and hotel agents' });
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
      `INSERT INTO users (email, password, first_name, last_name, phone, role, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, email, first_name, last_name, phone, role, is_active`,
      [email.toLowerCase(), hashedPassword, firstName, lastName, phone, role, req.user.id]
    );

    const user = result.rows[0];

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        isActive: user.is_active
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
       SET first_name = $1, last_name = $2, phone = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, email, first_name, last_name, phone, role, is_active`,
      [firstName, lastName, phone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        isActive: user.is_active
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

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

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
      `UPDATE users 
       SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, is_active`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User status updated successfully',
      isActive: result.rows[0].is_active
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};