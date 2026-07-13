/**
 * asyncHandler.js — Async Controller Wrapper Utility
 * Wraps async route handlers to automatically forward errors to Express's
 * global error handler, eliminating repetitive try/catch blocks.
 *
 * Usage:
 *   router.get('/example', asyncHandler(async (req, res) => {
 *     const data = await someAsyncOperation();
 *     res.json(data);
 *   }));
 */

/**
 * @param {Function} fn - An async Express route handler
 * @returns {Function} Wrapped handler that catches rejected promises
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
