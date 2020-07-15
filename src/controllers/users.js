import model from '../db/models';
import Helper from '../helper/helper';
import mail from '../helper/mail';

const { User } = model;

class Users {
  static async signUp(req, res) {
    const { username, email, password } = req.body
    const role = 'normal'

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
        role,
        password: hashPassword
      })
      const payload = {email, username, role}
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
          role: findUser.dataValues.role,
          password: findUser.dataValues.password
        };
        const hashPassword = findUser.dataValues.password
        const password = req.body.password
        if (Helper.comparePassword(hashPassword, password)) {
          const payload = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
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

  static async forgotPassword(req, res) {

    const findUser = await User.findOne({ where: { email: req.body.email } });
    if (findUser) {
      const { username, email } = findUser.dataValues;
      const user = {
        username,
        email
      };
      const resetEmail = mail.sendEmail(user);
      console.log('\n\n\n\n\n\n', resetEmail)
      if (resetEmail[0].statusCode === 202) {
        return res.status(200).json({
          message: 'Please check your email for password reset',
        });
      }
      return res.status(400).json({
        error: resetEmail,
      });
    }
    return res.status(404).json({ error: 'We coul not find your account check and try again', });
  }

}

export default Users;