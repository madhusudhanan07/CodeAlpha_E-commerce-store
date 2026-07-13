/**
 * indexController.js — Root Controller
 * Handles logic for the root health-check route.
 */

/**
 * GET /
 * Returns server status and basic metadata.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
export const getServerStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 CodeAlpha E-Commerce API is running.',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
};
