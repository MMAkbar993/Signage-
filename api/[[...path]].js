let app;
let connectDatabase;
try {
  app = require('../backend/dist/app').default;
  connectDatabase = require('../backend/dist/config/database').connectDatabase;
} catch (e) {
  console.error('Failed to load backend:', e.message);
}

let dbConnected = false;

module.exports = async (req, res) => {
  if (!app) {
    res.setHeader('Content-Type', 'application/json');
    res.status(500).end(JSON.stringify({ success: false, error: { message: 'API not available' } }));
    return;
  }
  if (connectDatabase && !dbConnected) {
    try {
      await connectDatabase();
      dbConnected = true;
    } catch (err) {
      console.error('Database connection failed:', err);
    }
  }
  return app(req, res);
};
