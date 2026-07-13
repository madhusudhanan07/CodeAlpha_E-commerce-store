/**
 * corsOptions.js — CORS Configuration
 * Defines which origins are permitted to access the API.
 * Extend the allowedOrigins array as new client environments are added.
 */

const allowedOrigins = [
  'http://localhost:5173', // Vite dev server (frontend)
  'http://localhost:3000', // Alternative local port
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin '${origin}' is not allowed.`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
