import model from '../db/models';
import { dataUri } from '../middleware/multer';
import { uploader } from '../db/config/cloudinaryConfig';

const { User } = model;

class ProfileManager {

  static async viewProfile(req, res) {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (user) {
      user.password = undefined;
      return res.status(200).json({
        profile: user
      });
    }
    return res.status(404).json({
      message: 'user does not exist'
    });
  }

  static async updateProfile(req, res) {
    try {
      if (req.file) {
        const file = dataUri(req).content;
        const result = await uploader.upload(file);
        req.body.image = result.url;
      }

      const data = await User.findOne({ where: { username: req.params.username } });
      if(data){
        const updated = await data.update({
          firstname: req.body.firstname || data.firstname,
          lastname: req.body.lastname || data.lastname,
          email: req.body.email || data.email,
          username: req.body.username || data.username,
          profile: req.body.profile || data.profile,
          role: req.body.role || data.role
        });
        updated.password = undefined;
        return res.status(200).json({
          user: updated
        });
      }
      return res.status(400).json({
        message: 'user not found'
      });
    } catch (error) {
      return res.json({ error });
    }
  }


  static async getAllUsersProfile(req, res) {
    try {
      const findUsers = await User.findAll({  attributes: {exclude: ['password']}});
      if(findUsers) {
        return res.status(200).json({ total: findUsers.length, users: findUsers });
      }
      return res.status(500).json({ message: "No user" });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

export default ProfileManager;