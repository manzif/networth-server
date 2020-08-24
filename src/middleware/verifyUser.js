import Helper from '../helper/helper';


class VerifyUser {

  static async isOwner(req, res, next) {
    try {

      const header = req.headers['authorization'];
      const bearer = header.split(' ');
      const token = bearer[1];
      req.token = token;

      const { id, role } = await Helper.verifyToken(token);
          
      if (id !== req.params.id && role !== 'admin' ) {
          return res.status(403).json({
            message: 'Forbidden access'
        });
      }
    next();
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next,
   * @returns {Object} return next if is admin
   */
  static async isAdmin(req, res, next) {
    try {
      const header = req.headers['authorization'];
      const bearer = header.split(' ');
      const token = bearer[1];
      req.token = token;

      const { role } = await Helper.verifyToken(token);
      if (role !== 'admin') {
        return res.status(403).json({
          error: 'You are not allowed to access this route.'
        });
      }
    next();
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }
}
export default VerifyUser;
