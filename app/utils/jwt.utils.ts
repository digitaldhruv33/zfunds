import jwt from 'jsonwebtoken';
import Users from '../modules/users/user.model';

export const generateAccessToken = async (user: Users) => {
	const accessTokenSecret: string = process.env.JWT_ACCESS_TOKEN_SECRET!;
	console.log('accessTokenSecret')
	console.log('accessTokenSecret')
	const { id, mobile_number, role } = user;
	return new Promise((res, rej) => {
		jwt.sign(
			{
				userId: id,
				mobile_number,
				role,
			},
			accessTokenSecret,
			{
				expiresIn: process.env.NODE_ENV === 'dev' ? '5d' : '3d',
			},
			(err, token) => {
				if (err) return rej(err);
				return res(token!);
			}
		);
	});
};
