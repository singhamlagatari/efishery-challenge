const development = {
  database: 'efishery_dev',
  username: 'sl',
  password: '0605',
  host: 'localhost',
  dialect: 'postgres',
};

const testing = {
  database: 'efishery_test',
  username: 'sl',
  password: '0605',
  host: 'localhost',
  dialect: 'postgres',
};

const production = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
};

module.exports = {
  development,
  testing,
  production,
};
