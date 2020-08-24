import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import Helper from './helper';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send email using send grid API
 */
class mail {
  /**
   *
   * @param {Object} user
   * @returns {Object} email message
   */
  static async sendEmail(user) {
    try {
      const { username, email} = user;
      const token = Helper.generateToken(user);
      const msg = {
        to: email,
        from: 'manzif60@gmail.com',
        subject: 'Password reset',
        text: `Dear, ${username} Please use the provided link to reset your password`,
        html: `<div>Dear ${username},<br>You have requested to reset your password.<br></div>
        <a href="${process.env.BACK_END_URL}/newpassword/${token}">Please click here to reset your password</a>
        <br><h6>Thank you for using networth.</h6>`,
      };
      const sent = sgMail.send(msg);
      return sent;
    } catch (error) {
      return {
        message: error
      };
    }
  }
}

export default mail;