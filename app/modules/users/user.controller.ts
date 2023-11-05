import express, { NextFunction, Request, Response } from 'express';
import OTPManager from '../../utils/otp.utils';
import { userSchema, userSchemaVerify } from './user.validator';
import Users from './user.model';
import { generateAccessToken } from '../../utils/jwt.utils';
import { ROLE } from './enum';

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const verifySid = process.env.TWILIO_VERIFY_SID as string;

class UserController {
	constructor() {}

	sendOtp = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { error, value } = userSchema.validate(req.body);
			if (error) {
				throw new Error(error.details[0].message);
			}
			const phoneNumber = value.mobile_number;
			const otpManager = new OTPManager(accountSid, authToken);
			await otpManager.sendOTP(phoneNumber, verifySid);
			res.status(200).json({ message: `Otp send to mobile number ${phoneNumber}` });
		} catch (err) {
			console.log('error - ', err);
			res.status(400).json({ err });
		}
	};

	verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { error, value } = userSchemaVerify.validate(req.body);
			if (error) {
				throw new Error(error.details[0].message);
			}
			const phoneNumber = value.mobile_number;
			const otpManager = new OTPManager(accountSid, authToken);
			const otp = value.otp;
			if (!otp) {
				throw new Error('OTP not verified');
			}
			const otpvalidation = await otpManager.verifyOTP(phoneNumber, verifySid, otp);
			if (!otpvalidation.data.valid) {
				throw new Error('otp is invalid');
			}
			let user = await Users.findOne({
				where: {
					mobile_number: phoneNumber,
				},
			});
			if (!user) {
				user = await Users.create(value as any);
			}
			const access_token = await generateAccessToken(user);

			res.status(200).json({ message: `Otp verify ${phoneNumber}`, data: { user, access_token } });
		} catch (err) {
			console.log('error - ', err);
			res.status(400).json({ err });
		}
	};

	userCreateByAdvisor = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const advisorUser = req.user;
			if (advisorUser.role !== ROLE.ADVISOR) {
				throw new Error('You are not allowed to create user');
			}
			const { error, value } = userSchema.validate(req.body);
			if (error) {
				throw new Error(error.details[0].message);
			}

			if (value.role !== ROLE.USER) {
				throw new Error('You are only allowed to create user role');
			}
			const phoneNumber = value.mobile_number;

			let user = await Users.findOne({
				where: {
					mobile_number: phoneNumber,
				},
			});
			value.advisorId = advisorUser.userId;
			if (!user) {
				user = await Users.create(value as any);
			} else {
				return res.status(400).json({ message: `User already present with this mobile number ${phoneNumber}` });
			}
			res.status(200).json({ message: `User created successfully ${phoneNumber}`, data: user });
		} catch (err: any) {
			console.log('error - ', err);
			res.status(400).json({ error: err.message });
		}
	};

	getUserForAdvisor = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const advisorUser = req.user;
			if (advisorUser.role !== ROLE.ADVISOR) {
				throw new Error('You are not allowed to create user');
			}

			const users = await Users.findAll({
				where: {
					advisorId: advisorUser.userId,
				},
			});
			res.status(200).json({ message: `Users fetched successfully`, users });
		} catch (err: any) {
			console.log('error - ', err);
			res.status(400).json({ error: err.message });
		}
	};
}

export const userController = new UserController();
