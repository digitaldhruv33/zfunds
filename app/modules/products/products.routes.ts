import express from 'express';
import { verifyToken } from '../../middlewares/verifyAuth';
import { productController } from './products.controller';

const router = express.Router();

router.post('/', verifyToken, productController.create);
router.get('/verify', verifyToken, productController.verifyProductLink);
router.get('/:id', verifyToken, productController.getUniqueProductLink);

export { router as productRoute };
