import Twilio from 'twilio';

class OTPManager {
	private twilioClient: Twilio.Twilio;

	constructor(accountSid: string, authToken: string) {
		this.twilioClient = Twilio(accountSid, authToken);
	}

	sendOTP = async (phoneNumber: string, verifySid: string): Promise<any> => {
		try {
			const message = await this.twilioClient.verify.v2.services(verifySid).verifications.create({
				to: `+91${phoneNumber}`,
				channel: 'sms',
			});
			return { data: message, message: `OTP sent to ${phoneNumber}.` };
		} catch (err: any) {
			console.error('error - ', err);
			throw new Error(err.message);
		}
	};

	verifyOTP = async (phoneNumber: string, verifySid: string, otp: string): Promise<any> => {
		try {
			const twilioResponse = await this.twilioClient.verify.v2.services(verifySid).verificationChecks.create({
				to: `+91${phoneNumber}`,
				code: `${otp}`,
			});
			return { data: twilioResponse, message: `OTP sent to ${phoneNumber}.` };
		} catch (err: any) {
			console.log(err.message);
			throw new Error(err.message);
		}
	};
}

export default OTPManager;
