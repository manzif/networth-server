import express from 'express';
import users from '../controllers/users';

const route = express.Router();

route.post('/', users.signUp);
route.post('/login', users.login);
route.post('/forgot-password', users.forgotPassword);
route.post('/reset-password/:userToken', users.resetPassword);

export default route;