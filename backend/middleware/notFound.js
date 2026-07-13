/**
 * notFound.js — 404 Route Fallback Middleware
 * Catches any request that does not match a registered route
 * and forwards a structured error to the global errorHandler.
 */

const notFound = (req, res, next) => {
  const error = new Error(`Route not found — ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export default notFound;
