import express from 'express';
import { multerUploads } from '../middleware/multer';
import { cloudinaryConfig } from '../db/config/cloudinaryConfig';
import profiles from '../controllers/profiles';
import verifyUser from '../middleware/verifyUser';
  

const route = express.Router();
route.use('*', cloudinaryConfig)

route.get('/',verifyUser.isAdmin, profiles.getAllUsersProfile);
route.get('/profile/:id', verifyUser.isOwner, profiles.viewProfile);
// route.put('/profile/:username', multerUploads, profiles.updateProfile);

export default route;
