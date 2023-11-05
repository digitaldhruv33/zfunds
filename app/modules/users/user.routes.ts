// customer.routes.ts
import express from 'express';
import { userController } from './user.controller';
import { verifyToken } from '../../middlewares/verifyAuth';

const router = express.Router();

router.post('/sendotp', userController.sendOtp);
router.post('/verifyotp', userController.verifyOtp);
router.post('/create', verifyToken, userController.userCreateByAdvisor);
router.get('/advisor', verifyToken, userController.getUserForAdvisor);

export { router as userRoute };
