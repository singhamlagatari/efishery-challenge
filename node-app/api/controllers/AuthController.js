const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');

const AuthController = () => {
  const register = async (req, res) => {
    const { body } = req;
    try {
      const password = Math.random().toString(36).substr(2, 4);
      let user = await User
        .findOne({
          where: {
            phone: body.phone,
          },
        });

      if (!user) {
        user = await User.create({
          name: body.name,
          phone: body.phone,
          role: body.role,
          password,
        });
      }
      return res.status(200).json({
        name: user.name,
        phone: user.phone,
        role: user.role,
        password,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const login = async (req, res) => {
    const { phone, password } = req.body;

    if (phone && password) {
      try {
        const user = await User
          .findOne({
            where: {
              phone,
            },
          });

        if (!user) {
          return res.status(400).json({ msg: 'Bad Request: User not found' });
        }

        if (bcryptService().comparePassword(password, user.password)) {
          const token = authService().issue({
            name: user.name,
            phone: user.phone,
            role: user.role,
            created_at: user.createdAt,
          });

          return res.status(200).json({ token });
        }

        return res.status(401).json({ msg: 'Unauthorized' });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Email or password is wrong' });
  };

  const validate = (req, res) => {
    const { token } = req.body;

    authService().verify(token, (err, decoded) => {
      if (err) {
        return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
      }

      return res.status(200).json(decoded);
    });
  };

  return {
    register,
    login,
    validate,
  };
};

module.exports = AuthController;
