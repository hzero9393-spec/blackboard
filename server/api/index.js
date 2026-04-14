const { app, ensureDb } = require('../server');

module.exports = async (req, res) => {
  await ensureDb();
  return app(req, res);
};
