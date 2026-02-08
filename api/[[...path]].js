const app = require('../backend/dist/app').default;
const { connectDatabase } = require('../backend/dist/config/database');

let dbConnected = false;

module.exports = async (req, res) => {
  // Connect database on cold start (reused across invocations)
  if (!dbConnected) {
    try {
      await connectDatabase();
      dbConnected = true;
    } catch (err) {
      console.error('Database connection failed:', err);
    }
  }

  return app(req, res);
};
