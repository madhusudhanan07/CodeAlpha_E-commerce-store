/**
 * User.js — User Model (Firestore)
 *
 * Provides reusable query functions for the `users` Firestore collection.
 * Document ID = Firebase UID (eliminates MySQL auto-increment integer concept).
 * Preserves the exact same exported function signatures as the MySQL version.
 */

import db from '../config/db.js';

const COL = 'users';

// ── Helpers ───────────────────────────────────────────────────────────────────

const docToRow = (doc) => {
  const data = doc.data();
  return {
    id: data.firebase_uid ?? doc.id,       // 'id' is the Firebase UID string
    firebase_uid: data.firebase_uid ?? doc.id,
    full_name: data.full_name ?? null,
    email: data.email ?? null,
    phone: data.phone ?? null,
    status: data.status ?? 'Active',
    profile_image: data.profile_image ?? null,
    gender: data.gender ?? null,
    dob: data.dob ?? null,
    last_login: data.last_login ?? null,
    created_at: data.created_at ?? null,
    updated_at: data.updated_at ?? null,
  };
};

// ── READ ──────────────────────────────────────────────────────────────────────

/**
 * Fetch every user row (except deleted).
 * @returns {Promise<Array>}
 */
export const findAll = async () => {
  const snap = await db.collection(COL).get();
  return snap.docs
    .map(docToRow)
    .filter((u) => u.status !== 'Deleted')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

/**
 * Find a single user by their Firebase UID (used as the document ID).
 * The `id` parameter here is the Firebase UID string.
 * @param {string} id  — Firebase UID
 * @returns {Promise<Object|null>}
 */
export const findById = async (id) => {
  const doc = await db.collection(COL).doc(String(id)).get();
  return doc.exists ? docToRow(doc) : null;
};

/**
 * Find a user by their Firebase UID.
 * @param {string} firebaseUid
 * @returns {Promise<Object|null>}
 */
export const findByFirebaseUid = async (firebaseUid) => {
  const doc = await db.collection(COL).doc(String(firebaseUid)).get();
  return doc.exists ? docToRow(doc) : null;
};

/**
 * Find a user by their email address.
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
export const findByEmail = async (email) => {
  const snap = await db.collection(COL).where('email', '==', email).limit(1).get();
  if (snap.empty) return null;
  return docToRow(snap.docs[0]);
};

// ── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Insert a new user record (idempotent — uses set with merge).
 * @param {{ firebase_uid: string, full_name: string, email: string, phone?: string }} data
 * @returns {Promise<{ insertId: string }>} insertId = firebase_uid
 */
export const create = async ({ firebase_uid, full_name, email, phone = null }) => {
  const now = new Date().toISOString();
  // set with merge:true so it won't overwrite existing users
  await db.collection(COL).doc(firebase_uid).set(
    {
      firebase_uid,
      full_name,
      email,
      phone: phone ?? null,
      status: 'Active',
      profile_image: null,
      gender: null,
      dob: null,
      last_login: now,
      created_at: now,
      updated_at: now,
    },
    { merge: true },
  );
  return { insertId: firebase_uid };
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

/**
 * Update a user's mutable profile fields.
 * @param {string} id  — Firebase UID
 * @param {Object} fields
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const updateById = async (id, fields) => {
  const updateData = { updated_at: new Date().toISOString() };
  const allowed = [
    'full_name', 'phone', 'profile_image', 'status',
    'gender', 'dob', 'last_login', 'block_reason',
  ];
  for (const key of allowed) {
    if (fields[key] !== undefined) updateData[key] = fields[key];
  }
  await db.collection(COL).doc(String(id)).update(updateData);
  return { affectedRows: 1 };
};

// ── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Soft-delete a user by setting status to 'Deleted'.
 * @param {string} id  — Firebase UID
 * @returns {Promise<Object>} { affectedRows: 1 }
 */
export const deleteById = async (id) => {
  await db.collection(COL).doc(String(id)).update({
    status: 'Deleted',
    updated_at: new Date().toISOString(),
  });
  return { affectedRows: 1 };
};
