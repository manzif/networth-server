import express from 'express';
import profiles from '../controllers/profiles';
import verifyUser from '../middleware/verifyUser';


const route = express.Router();

route.get('/',verifyUser.isAdmin, profiles.getAllUsersProfile);
route.get('/profile/:id', verifyUser.isOwner, profiles.viewProfile);
// route.put('/profile/:username' , multerUploads, profiles.updateProfile);

export default route;
