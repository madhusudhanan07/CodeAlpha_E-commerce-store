/**
 * corsOptions.js — CORS Configuration
 * Defines which origins are permitted to access the API.
 * Extend the allowedOrigins array as new client environments are added.
 */

const allowedOrigins = [
  'http://localhost:5173',                        // Vite dev server (frontend)
  'http://localhost:3000',                        // Alternative local port
  'https://new-ecommerce-store.vercel.app',       // Vercel production frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, mobile apps)
    // Also allow all vercel.app subdomains and any explicitly listed origin
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
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
