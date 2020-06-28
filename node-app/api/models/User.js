const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');

const sequelize = require('../../config/database');

const hooks = {
  beforeCreate(user) {
    // eslint-disable-next-line max-len
    user.password = bcryptService().password(user.password); // eslint-disable-line no-param-reassign
  },
};

const tableName = 'users';

const User = sequelize.define('User', {
  name: {
    type: Sequelize.STRING,
  },
  phone: {
    type: Sequelize.STRING,
    unique: true,
  },
  role: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
}, { hooks, tableName, underscored: true });

// eslint-disable-next-line
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

module.exports = User;
