import model from '../db/models';
import Helper from '../helper/helper';

const { User } = model;

class Users {
  static async signUp(req, res) {
    const { username, email, password } = req.body

    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }
    const hashPassword = Helper.hashPassword(password);
    try {
      const findUser = await User.findOne({
        where: { email }
      });
      if(findUser){
        return res.status(400).json({
          message: 'User already exists.'
        });
      }
      await User
      .create({
        username,
        email,
        password: hashPassword
      })
      const payload = {email, username}
      const token = Helper.generateToken(payload);
      return res.status(201).send({ token, message: 'User successfully created', username, email});
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error,
    });
    }
  }

  static async login(req, res) {
    try {
      const findUser = await User.findOne({ where: { email: req.body.email } });

      if (findUser) {
        const userData = {
          id: findUser.dataValues.id,
          username: findUser.dataValues.username,
          email: findUser.dataValues.email,
          password: findUser.dataValues.password,
        };
        const hashPassword = findUser.dataValues.password
        const password = req.body.password
        if (Helper.comparePassword(hashPassword, password)) {
          const payload = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
          }

          const token = Helper.generateToken(payload);
          return res.status(200).json({
            message: 'User has been successfully logged in',
            user: {
              token,
              email: payload.email,
              username: payload.username
            }
          });
        }
        return res.status(401).json({
          message: 'Wrong email or password'
        });
      }
      return res.status(401).json({
        message: 'Wrong email or password'
      });
    } catch (error) {
      return res.status(500).json({
        message: error
      });
    }
  }
}

export default Users;