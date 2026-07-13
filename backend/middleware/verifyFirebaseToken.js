/**
 * verifyFirebaseToken.js — Firebase Token Verification Middleware
 *
 * Extracts and verifies the Firebase ID Token from the Authorization header.
 * On success, attaches the decoded token payload to req.decodedUser.
 * On failure, responds with 401 Unauthorized.
 *
 * Usage:
 *   import verifyFirebaseToken from '../middleware/verifyFirebaseToken.js';
 *   router.get('/protected', verifyFirebaseToken, handler);
 *
 * Token shape attached to req.decodedUser:
 *   { uid, email, name, email_verified, ... }
 */

import { adminAuth } from '../config/firebaseAdmin.js';

/**
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: missing or malformed Authorization header.',
    });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.decodedUser = decodedToken;
    next();
  } catch (error) {
    const isExpired = error.code === 'auth/id-token-expired';
    return res.status(401).json({
      success: false,
      message: isExpired
        ? 'Unauthorized: token has expired. Please sign in again.'
        : 'Unauthorized: invalid token.',
    });
  }
};

export default verifyFirebaseToken;
