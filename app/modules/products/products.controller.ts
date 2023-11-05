import express, { NextFunction, Request, Response } from 'express';
import { ROLE } from '../users/enum';
import { productSchema } from './products.validator';
import Products from './products.model';
import Users from '../users/user.model';
import jwt from 'jsonwebtoken';

class ProductController {
	constructor() {}

	create = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const adminUser = req.user;
			if (adminUser.role !== ROLE.ADMIN) {
				throw new Error('You are not allowed to create product');
			}
			const { error, value } = productSchema.validate(req.body);
			if (error) {
				throw new Error(error.details[0].message);
			}

			let product = await Products.findOne({
				where: {
					name: value.name,
				},
			});
			if (!product) {
				product = await Products.create(value as any);
			} else {
				return res.status(400).json({ message: `Product already present with this name ${value.name}` });
			}

			res.status(200).json({ message: `Product created successfully.`, product });
		} catch (err: any) {
			console.log('err - ', err);
			res.status(400).json({ error: err.message });
		}
	};

	getUniqueProductLink = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const advisorUser = req.user;
			if (advisorUser.role !== ROLE.ADVISOR) {
				throw new Error('You are not allowed to create link');
			}
			const productId = req.params.id;
			const userId = req.query.userId;

			let product = await Products.findOne({
				where: {
					id: productId,
				},
			});
			if (!product) {
				return res.status(400).json({ message: `Invalid Product` });
			}

			let user = await Users.findOne({
				where: {
					id: userId,
					advisorId: advisorUser.userId,
				},
			});

			if (!user) {
				return res.status(400).json({ message: `You are purchasing for invalid user` });
			}

			const currentTimestamp = Date.now();
			const productLinkSecret: string = process.env.PRODUCT_LINK_SECRET!;

			//Creating token to control that the link will open by right user and to set the expiry of the link, timestamp to track when this link was created
			const token = jwt.sign(
				{
					userId: user.id,
					productId,
					currentTimestamp,
				},
				productLinkSecret,
				{
					expiresIn: '3d',
				}
			);
			const productLink = `http://${req.hostname}:5000/api/v1/product/verify?token=${token}`;

			res.status(200).json({ message: `Product link created successfully.`, productLink });
		} catch (err: any) {
			console.log('err - ', err);
			res.status(400).json({ error: err.message });
		}
	};

	// This route is for verify the product link
	verifyProductLink = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.query.token as string;
			const productLinkSecret: string = process.env.PRODUCT_LINK_SECRET!;
			let decoded: any;
			if (token) {
				jwt.verify(token, productLinkSecret, (err, data) => {
					if (err) {
						throw new Error('Invalid product or user');
					}
					decoded = data;
				});
			} else {
				throw new Error('Token is missing');
			}
			const productId = decoded.productId;
			const userId = decoded.userId;

			let product = await Products.findOne({
				where: {
					id: productId,
				},
			});
			if (!product) {
				return res.status(400).json({ message: `Invalid Product` });
			}

			let user = await Users.findOne({
				where: {
					id: userId,
				},
			});

			if (!user) {
				return res.status(400).json({ message: `Invalid user` });
			}

			res.status(200).json({ message: `Product link verified successfully.` });
		} catch (err: any) {
			console.log('err - ', err);
			res.status(400).json({ error: err.message });
		}
	};
}

export const productController = new ProductController();
