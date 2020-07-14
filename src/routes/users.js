import express from 'express';
import users from '../controllers/users';


const route = express.Router();

route.post('/', users.signUp);
route.post('/login', users.login);

export default route;