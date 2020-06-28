const bcrypt = require('bcrypt-nodejs');

const bcryptService = () => {
  const password = (stringPassword) => {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(stringPassword, salt);
  };

  const comparePassword = (pw, hash) => (
    bcrypt.compareSync(pw, hash)
  );

  return {
    password,
    comparePassword,
  };
};

module.exports = bcryptService;
