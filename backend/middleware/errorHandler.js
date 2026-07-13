/**
 * errorHandler.js — Global Express Error Handler Middleware
 * Must be registered LAST in app.js (after all routes) as Express
 * identifies error handlers by their four-parameter signature.
 */

/**
 * Central error handler. Logs the stack in development, hides it in production.
 *
 * @param {Error}    err  - The error object
 * @param {Request}  req  - Express request
 * @param {Response} res  - Express response
 * @param {Function} next - Next middleware (required for Express to recognise this as error handler)
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${err.message}`);
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export default errorHandler;
