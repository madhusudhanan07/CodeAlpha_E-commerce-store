/**
 * apiResponse.js — Standardized API Response Helpers
 * Ensures consistent response shape across all endpoints.
 *
 * Standard shape:
 * {
 *   success: boolean,
 *   message: string,
 *   data?: any,
 *   errors?: any
 * }
 */

/**
 * Send a successful response.
 * @param {import('express').Response} res
 * @param {number} statusCode - HTTP status (default: 200)
 * @param {string} message    - Human-readable message
 * @param {any}    data       - Payload to return
 */
export const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {number} statusCode - HTTP status (default: 500)
 * @param {string} message    - Human-readable error message
 * @param {any}    errors     - Optional error details
 */
export const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};
