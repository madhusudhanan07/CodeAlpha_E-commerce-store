/**
 * authRoutes.js — Authentication API Routes
 *
 * Mount point: /api/auth  (registered in app.js)
 *
 * Routes:
 *   POST /api/auth/register  → Register user in MySQL (protected)
 *   POST /api/auth/profile   → Get user profile from MySQL (protected)
 *   GET  /api/auth/me        → Return decoded token payload (protected)
 */

import { Router } from 'express';
import verifyFirebaseToken from '../middleware/verifyFirebaseToken.js';
import { registerUser, getProfile, getMe } from '../controllers/authController.js';

const router = Router();

// All auth routes require a valid Firebase ID Token
router.post('/register', verifyFirebaseToken, registerUser);
router.post('/profile',  verifyFirebaseToken, getProfile);
router.get('/me',        verifyFirebaseToken, getMe);

export default router;
