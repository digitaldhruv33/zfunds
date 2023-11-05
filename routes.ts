import express, { Request, Response } from 'express';
import { userRoute } from './app/modules/users/user.routes';
import { productRoute } from './app/modules/products/products.routes';
const routes = express.Router();

routes.use('/user', userRoute);
routes.use('/product', productRoute);

// Catch-all route for invalid routes
routes.use('*', (req, res) => {
	const availableRoutes = ['/user', '/product'];
	res.status(404).json({ error: 'Invalid route', availableRoutes });
});

export { routes };
