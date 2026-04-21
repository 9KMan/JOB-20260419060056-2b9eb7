const db = require('../db');
const logger = require('../utils/logger');

const seedData = async () => {
  try {
    logger.info('Database seeding skipped - production data will be added through normal usage');
    return { success: true, message: 'Seeding completed (no sample data)' };
  } catch (error) {
    logger.error('Seeding error:', error);
    throw error;
  }
};

module.exports = { seedData };