import express from 'express';
import UserController from '../controllers/UserController.js';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/checkUser', UserController.checkUser);
router.get('/:id', UserController.getUserById);

export default router;
