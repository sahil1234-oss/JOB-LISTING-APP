// backend/server.js
require('dotenv').config();


const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Use PORT from env if provided, otherwise default 5001
const PORT = Number(process.env.PORT) || 5001;
const HOST = '0.0.0.0'; // listen on all interfaces so LAN devices can reach it

// --- Middleware (register before routes) ---
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

app.use(cors());            // Enable CORS for development (adjust options in production)
app.use(express.json());    // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse urlencoded bodies if needed

// --- Mount routes (these should export express.Router) ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/users', require('./routes/users'));

// Static certs (optional)
app.use('/certs', express.static(path.join(__dirname, 'certs')));

// Health check
app.get('/', (req, res) => res.send('API is running'));

// Catch-all error handler (returns JSON)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(err && err.status ? err.status : 500)
     .json({ message: err && err.message ? err.message : 'Internal Server Error' });
});

// --- Start server AFTER DB connect ---
let server; // will hold the http server instance

(async () => {
  try {
    await connectDB();
    console.log('MongoDB connected ✅');

    // Start listening once, here (no other app.listen anywhere)
    server = app.listen(PORT, HOST, () => {
      console.log(`Server running and listening on http://${HOST}:${PORT}`);
    });

    server.on('error', err => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Kill the process using that port or change PORT in .env.`);
      } else {
        console.error('Server error:', err);
      }
      // Exit so process manager / nodemon can restart cleanly
      process.exit(1);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down server...');
      if (server) {
        server.close(() => {
          console.log('HTTP server closed.');
          process.exit(0);
        });
        // force exit if not closed in 5s
        setTimeout(() => {
          console.error('Forcing shutdown.');
          process.exit(1);
        }, 5000);
      } else {
        process.exit(0);
      }
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (err) {
    console.error('Failed to start server:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();

// global process-level error handlers
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
process.on('uncaughtException', err => {
  console.error('Uncaught Exception thrown:', err);
  process.exit(1);
});
