const { Pool } = require('pg');
const config = require('../config');
const logger = require('../utils/logger');

let pool = null;

const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: config.database.url,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      logger.error('Unexpected database pool error:', err);
    });
  }
  return pool;
};

const query = async (text, params) => {
  const dbPool = getPool();
  const start = Date.now();
  const res = await dbPool.query(text, params);
  const duration = Date.now() - start;
  logger.debug('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

const getClient = async () => {
  return getPool().connect();
};

module.exports = {
  query,
  getClient,
  getPool,
};