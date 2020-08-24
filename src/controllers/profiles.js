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
        req.body.profile = result.url;
      }
      console.log('\n\n\n\n\n\n', req.body.profile)
      // const data = await User.findOne({ where: { username: req.params.username } });
      // console.log('\n\n\n\n\n\n', req.body.profile)
      // const updated = await data.update({
      //   firstname: req.body.firstname || data.dataValues.firstname,
      //   lastname: req.body.lastname || data.lastname,
      //   email: req.body.email || data.email,
      //   username: req.body.username || data.username,
      //   profile: req.body.profile || data.dataValues.profile
      // });
      // updated.password = undefined;
      // return res.status(200).json({
      //   user: updated
      // });
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
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

  // static async addProduct(req, res) {
  //   try {
  //     const data = await User.findOne({ where: { username: req.params.username } });
  //     if(data){
  //       if(req.file) {
  //         const dataBuffer = new Buffer.from(req.file.Buffer);
  //         console.log('\n\n\n\n\n\n', 'test')
  //         const mediaType = path.extname(req.file.originalname).toString();
  //         const imageData = imageDataURI.encode(dataBuffer, mediaType);
  //         const uploadedImage = await uploader.upload(imageData);
  //         const image= uploadedImage.url
  //       }
        
  
  //       const updated = await data.update({
  //         firstname: req.body.firstname || data.firstname,
  //         lastname: req.body.lastname || data.lastname,
  //         email: req.body.email || data.email,
  //         username: req.body.username || data.username,
  //         profile: image || data.profile
  //       });
  //       return res.status(201).send({
  //         success: true,
  //         message: 'Product added'
  //       });
  //     }
  //     return res.status(400).json({
  //       message: 'user not found'
  //     });
  //   } catch (error) {
  //     return res.status(500).send({
  //       message: error.message
  //     });
  //   }
  // }

}

export default ProfileManager;