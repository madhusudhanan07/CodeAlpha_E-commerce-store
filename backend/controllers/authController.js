/**
 * authController.js — Authentication Business Logic (Firestore)
 *
 * Handles user registration (upsert to Firestore) and profile retrieval.
 * All routes are Firebase-protected via verifyFirebaseToken middleware.
 */

import * as UserModel from '../models/User.js';

// ── POST /api/auth/register ───────────────────────────────────────────────────
/**
 * Registers (or returns) a user in Firestore after Firebase account creation.
 *
 * Request body: { name, email, firebaseUid }
 * Attached by middleware: req.decodedUser (verified Firebase token payload)
 *
 * Behaviour:
 *  - If firebase_uid already exists → return the existing user (idempotent)
 *  - Otherwise → upsert a new user document and return it
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, firebaseUid } = req.body;

    // Basic input guard (middleware already verified the token)
    if (!name || !email || !firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'name, email, and firebaseUid are required.',
      });
    }

    // Check if user already exists (idempotent registration)
    const existing = await UserModel.findByFirebaseUid(firebaseUid);
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'User already registered.',
        data: { user: existing },
      });
    }

    // Upsert new user (doc ID = firebaseUid)
    await UserModel.create({ firebase_uid: firebaseUid, full_name: name, email });
    const newUser = await UserModel.findByFirebaseUid(firebaseUid);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: { user: newUser },
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/profile ────────────────────────────────────────────────────
/**
 * Returns the full Firestore profile for the currently authenticated user.
 * Relies on req.decodedUser.uid set by verifyFirebaseToken.
 */
export const getProfile = async (req, res, next) => {
  try {
    const { uid } = req.decodedUser;
    const user    = await UserModel.findByFirebaseUid(uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found. Please register first.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
/**
 * Returns the authenticated Firebase token payload (lightweight endpoint).
 * Does NOT query Firestore — useful for quick identity checks.
 */
export const getMe = async (req, res) => {
  const { uid, email, name, email_verified } = req.decodedUser;
  return res.status(200).json({
    success: true,
    message: 'Authenticated.',
    data: { uid, email, name, emailVerified: email_verified },
  });
};
