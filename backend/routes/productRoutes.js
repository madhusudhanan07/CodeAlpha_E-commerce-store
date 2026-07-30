import 'dotenv/config';
import app from './app.js'; // ✅ Corrected (./ instead of ../)
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Establish database connection before accepting traffic
await connectDB();

app.listen(PORT, HOST, () => {
  console.log(`\n🚀 Server running at http://${HOST}:${PORT}`);
  console.log(`📦 Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔹 API root    : http://${HOST}:${PORT}/\n`);
});