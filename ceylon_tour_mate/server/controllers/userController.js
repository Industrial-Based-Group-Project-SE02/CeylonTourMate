// const bcrypt = require('bcrypt');
// const pool = require('../config/db');

// // Get users based on role with search and filter
// exports.getAllUsers = async (req, res) => {
//   try {
//     const { role, status, search } = req.query;
    
//     let query = 'SELECT id, email, first_name, last_name, phone, role, is_active, profile_picture, created_at FROM users WHERE 1=1';
//     let params = [];
//     let paramCount = 1;

//     // Manager sees only drivers and hotel_agents
//     if (req.user.role === 'manager') {
//       query += ` AND role IN ('driver', 'hotel_agent')`;
//     }

//     // Filter by role
//     if (role && role !== 'all') {
//       query += ` AND role = $${paramCount}`;
//       params.push(role);
//       paramCount++;
//     }

//     // Filter by status
//     if (status && status !== 'all') {
//       const isActive = status === 'active';
//       query += ` AND is_active = $${paramCount}`;
//       params.push(isActive);
//       paramCount++;
//     }

//     // Search by name or email
//     if (search && search.trim()) {
//       query += ` AND (
//         LOWER(first_name) LIKE LOWER($${paramCount}) OR 
//         LOWER(last_name) LIKE LOWER($${paramCount}) OR 
//         LOWER(email) LIKE LOWER($${paramCount})
//       )`;
//       params.push(`%${search.trim()}%`);
//       paramCount++;
//     }

//     query += ' ORDER BY created_at DESC';

//     const result = await pool.query(query, params);
    
//     const users = result.rows.map(user => ({
//       id: user.id,
//       email: user.email,
//       firstName: user.first_name,
//       lastName: user.last_name,
//       phone: user.phone,
//       role: user.role,
//       isActive: user.is_active,
//       profilePicture: user.profile_picture,
//       createdAt: user.created_at
//     }));

//     res.json(users);
//   } catch (error) {
//     console.error('Get all users error:', error);
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// };

// // Get single user
// exports.getUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(
//       `SELECT id, email, first_name, last_name, phone, role, is_active, profile_picture, created_at 
//        FROM users WHERE id = $1`,
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const user = result.rows[0];

//     res.json({
//       id: user.id,
//       email: user.email,
//       firstName: user.first_name,
//       lastName: user.last_name,
//       phone: user.phone,
//       role: user.role,
//       isActive: user.is_active,
//       profilePicture: user.profile_picture,
//       createdAt: user.created_at
//     });
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({ error: 'Failed to fetch user' });
//   }
// };

// // Create user (admin creates manager, manager creates driver ONLY)
// exports.createUser = async (req, res) => {
//   const client = await pool.connect();
  
//   try {
//     const { email, password, firstName, lastName, phone, role } = req.body;

//     if (!email || !password || !firstName || !lastName || !role) {
//       return res.status(400).json({ error: 'All required fields must be filled' });
//     }

//     // Role-based permission check
//     if (req.user.role === 'admin' && role !== 'manager') {
//       return res.status(403).json({ error: 'Admin can only create managers' });
//     }

//     // MANAGER CAN ONLY CREATE DRIVERS (removed hotel_agent)
//     if (req.user.role === 'manager' && role !== 'driver') {
//       return res.status(403).json({ error: 'Manager can only create drivers' });
//     }

//     const userExists = await client.query(
//       'SELECT id FROM users WHERE email = $1',
//       [email.toLowerCase()]
//     );

//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ error: 'Email already registered' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await client.query(
//       `INSERT INTO users (email, password, first_name, last_name, phone, role, created_by) 
//        VALUES ($1, $2, $3, $4, $5, $6, $7) 
//        RETURNING id, email, first_name, last_name, phone, role, is_active, profile_picture`,
//       [email.toLowerCase(), hashedPassword, firstName, lastName, phone, role, req.user.id]
//     );

//     const user = result.rows[0];

//     res.status(201).json({
//       message: 'User created successfully',
//       user: {
//         id: user.id,
//         email: user.email,
//         firstName: user.first_name,
//         lastName: user.last_name,
//         phone: user.phone,
//         role: user.role,
//         isActive: user.is_active,
//         profilePicture: user.profile_picture
//       }
//     });
//   } catch (error) {
//     console.error('Create user error:', error);
//     res.status(500).json({ error: 'Failed to create user' });
//   } finally {
//     client.release();
//   }
// };

// // Update user
// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { firstName, lastName, phone } = req.body;

//     const result = await pool.query(
//       `UPDATE users 
//        SET first_name = $1, last_name = $2, phone = $3, updated_at = CURRENT_TIMESTAMP
//        WHERE id = $4
//        RETURNING id, email, first_name, last_name, phone, role, is_active, profile_picture`,
//       [firstName, lastName, phone, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const user = result.rows[0];

//     res.json({
//       message: 'User updated successfully',
//       user: {
//         id: user.id,
//         email: user.email,
//         firstName: user.first_name,
//         lastName: user.last_name,
//         phone: user.phone,
//         role: user.role,
//         isActive: user.is_active,
//         profilePicture: user.profile_picture
//       }
//     });
//   } catch (error) {
//     console.error('Update user error:', error);
//     res.status(500).json({ error: 'Failed to update user' });
//   }
// };

// // Delete user
// exports.deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(
//       'DELETE FROM users WHERE id = $1 RETURNING id',
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error('Delete user error:', error);
//     res.status(500).json({ error: 'Failed to delete user' });
//   }
// };

// // Toggle user active status
// exports.toggleUserStatus = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(
//       `UPDATE users 
//        SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
//        WHERE id = $1
//        RETURNING id, is_active`,
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json({
//       message: 'User status updated successfully',
//       isActive: result.rows[0].is_active
//     });
//   } catch (error) {
//     console.error('Toggle user status error:', error);
//     res.status(500).json({ error: 'Failed to update user status' });
//   }
// };
const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Get users based on role with search and filter
exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    
    let query = 'SELECT id, email, first_name, last_name, phone, role, is_active, profile_picture, created_at FROM users WHERE 1=1';
    let params = [];
    let paramCount = 1;

    // Manager sees only drivers and hotel_agents
    if (req.user.role === 'manager') {
      query += ` AND role IN ('driver', 'hotel_agent')`;
    }

    // Filter by role
    if (role && role !== 'all') {
      query += ` AND role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    // Filter by status
    if (status && status !== 'all') {
      const isActive = status === 'active';
      query += ` AND is_active = $${paramCount}`;
      params.push(isActive);
      paramCount++;
    }

    // Search by name or email
    if (search && search.trim()) {
      query += ` AND (
        LOWER(first_name) LIKE LOWER($${paramCount}) OR 
        LOWER(last_name) LIKE LOWER($${paramCount}) OR 
        LOWER(email) LIKE LOWER($${paramCount})
      )`;
      params.push(`%${search.trim()}%`);
      paramCount++;
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
      profilePicture: user.profile_picture,
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
      `SELECT id, email, first_name, last_name, phone, role, is_active, profile_picture, created_at 
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
      profilePicture: user.profile_picture,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create user (admin creates manager, manager creates driver ONLY)
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

    // MANAGER CAN ONLY CREATE DRIVERS (removed hotel_agent)
    if (req.user.role === 'manager' && role !== 'driver') {
      return res.status(403).json({ error: 'Manager can only create drivers' });
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
       RETURNING id, email, first_name, last_name, phone, role, is_active, profile_picture`,
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
        isActive: user.is_active,
        profilePicture: user.profile_picture
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
       RETURNING id, email, first_name, last_name, phone, role, is_active, profile_picture`,
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
        isActive: user.is_active,
        profilePicture: user.profile_picture
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