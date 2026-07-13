/**
 * app.js — Express Application Factory
 *
 * Responsible for:
 *  - Registering global middleware (CORS, JSON parser, URL encoder)
 *  - Mounting API route modules
 *  - Attaching the 404 catch-all and global error handler (always last)
 *
 * Purposely separated from server.js so that the app instance can be
 * imported independently for integration testing without binding a port.
 */

import express from 'express';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

// Route modules
import indexRoute    from './routes/indexRoute.js';
import authRoutes    from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

// ─── App Initialization ───────────────────────────────────────────────────────
const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────

// CORS — must come before routes
app.use(cors(corsOptions));

// Built-in JSON body parser (replaces body-parser)
app.use(express.json());

// URL-encoded form data support
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ───────────────────────────────────────────────────────────────

// Health check / root
app.use('/', indexRoute);

// Authentication
app.use('/api/auth',     authRoutes);

// Products catalogue (public read)
app.use('/api/products', productRoutes);

// ── Future routes will be mounted here ──
// app.use('/api/v1/cart',   cartRoutes);
// app.use('/api/v1/orders', orderRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────

// Catch-all for unregistered routes (must come before errorHandler)
app.use(notFound);

// Global error handler (must be the very last middleware)
app.use(errorHandler);

export default app;
