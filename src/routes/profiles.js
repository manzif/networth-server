import express from 'express';
import profiles from '../controllers/profiles';
import { multerUploads } from '../middleware/multer';


const route = express.Router();

route.get('/', profiles.getAllUsersProfile);
route.get('/profile/:id', profiles.viewProfile);
route.put('/profile/:username' , multerUploads, profiles.updateProfile);

export default route;