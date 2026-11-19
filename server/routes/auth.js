import express from 'express';
import { query } from '../db.js';
import { signAdminToken, requireAdminAuth, comparePassword, hashPassword } from '../auth.js';

const router = express.Router();

/**
 * Ensure at least one default administrator exists in TiDB
 */
async function ensureDefaultAdmin() {
  try {
    const defaultEmail = 'admin@joymanpowersolution.com';
    const existing = await query('SELECT id FROM admins WHERE email = ? LIMIT 1;', [defaultEmail]);
    if (existing.length === 0) {
      const defaultPass = 'admin123';
      const defaultHash = await hashPassword(defaultPass);
      await query(
        `INSERT INTO admins (name, email, password_hash, status, created_at, updated_at) 
         VALUES (?, ?, ?, 'active', NOW(), NOW());`,
        ['Joy Manpower Administrator', defaultEmail, defaultHash]
      );
      console.log('[Auth] Initialized default administrator in TiDB:', defaultEmail);
    }
  } catch (err) {
    console.error('[Auth] Error checking/seeding default admin:', err.message);
  }
}

// Seed admin on module load
ensureDefaultAdmin();

/**
 * Admin Login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let admins = await query('SELECT * FROM admins WHERE LOWER(email) = ? AND status = "active" LIMIT 1;', [cleanEmail]);

    // If no admin yet in table, ensure default admin exists
    if (admins.length === 0) {
      await ensureDefaultAdmin();
      admins = await query('SELECT * FROM admins WHERE LOWER(email) = ? AND status = "active" LIMIT 1;', [cleanEmail]);
    }

    if (admins.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials. Administrator account not found.' });
    }

    const admin = admins[0];
    const isMatch = await comparePassword(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = signAdminToken(admin);
    return res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      }
    });
  } catch (err) {
    console.error('[Auth Login Error]:', err);
    return res.status(500).json({ success: false, error: 'Internal authentication server error' });
  }
});

/**
 * Get current authenticated administrator info
 */
router.get('/me', requireAdminAuth, async (req, res) => {
  try {
    const admins = await query('SELECT id, name, email, status, created_at FROM admins WHERE id = ? LIMIT 1;', [req.admin.id]);
    if (admins.length === 0) {
      return res.status(404).json({ success: false, error: 'Admin account not found' });
    }
    return res.json({ success: true, admin: admins[0] });
  } catch (err) {
    console.error('[Auth Me Error]:', err);
    return res.status(500).json({ success: false, error: 'Failed to verify session' });
  }
});

export default router;
