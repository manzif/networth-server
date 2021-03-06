import model from '../db/models';
import Helper from '../helper/helper';
import mail from '../helper/mail';
import axios from 'axios'

const { User } = model;

class Users {
  static async signUp(req, res) {

    const role = 'normal'

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
            message: 'You have been successfully logged in',
            token: token,
            user: {
              email: payload.email,
              username: payload.username,
              role: userData.role
            }
          });
        }
        return res.status(400).json({
          status: 400,
          message: 'Wrong email or password'
        });
      }
      return res.status(400).json({
        status: 400,
        message: 'Wrong email or password'
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }
  static async checkId(req, res) {
    try {
      const identity = req.body.identity 
      const downloadUrl = 'http://app.mobicash.rw/rnit-1/check-id'
      const { data } = await axios({
        method: 'Post',
        url: downloadUrl,
        params: {'identification': identity }})

      return res.status(200).json({
        identification: data
      });
    } catch (error) {
      console.log('\n\n\n\n\n', error)
      return res.status(500).json({
        message: error.message
      });
    }
  }

  static async forgotPassword(req, res) {

    const findUser = await User.findOne({ where: { email: req.body.email } });
    if (findUser) {
      const { username, email, role} = findUser.dataValues;
      const user = {
        username,
        email,
        role
      };
      const resetEmail = await mail.sendEmail(user);
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

  static async resetPassword(req, res) {
    try {
        const verifyToken = await Helper.verifyToken(req.params.userToken);
        const { password } = req.body;
        const hashedPassword = Helper.hashPassword(password, 10);
        const findUser = await User.findOne({ where: { email: verifyToken.email } });
        const comparePassword = Helper.comparePassword(findUser.dataValues.password, password);
        if (comparePassword !== true) {
          const updatePassword = await User.update(
            { password: hashedPassword },
            { where: { email: verifyToken.email } }
          );

          if (updatePassword[0] === 1) {
            return res.status(200).json({
              message: 'Password changed successful',
            });
          }
        }
        return res.status(406).json({
          error: 'This password is the same as the one you had, Please change',
        });

    } catch (error) {
      return res.status(404).json({
        message: error.message
      });
    }
  }

}

export default Users;
