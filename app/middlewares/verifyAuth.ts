import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ITokenPayload } from '../interfaces/TokenPayload';

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET as string;

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tokenHeader: string = req.headers['authorization']!;
		if (tokenHeader) {
			const token = tokenHeader.split(' ')[1];
			jwt.verify(token, accessTokenSecret, (err, user) => {
				if (err) {
					throw new Error('Session Expired');
				}
				req.user = user as ITokenPayload;
				return next();
			});
		} else {
			throw new Error('Token header is missing');
		}
	} catch (error) {
		next(error);
	}
};
