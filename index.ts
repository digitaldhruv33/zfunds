import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import dbConnSeq from './app/db/database';
import { ITokenPayload } from './app/interfaces/TokenPayload';
import { routes } from './routes';

dotenv.config();

const app: Application = express();

//Adding user into request object. So that we can access req.user
declare global {
	namespace Express {
		interface Request {
			user: ITokenPayload;
		}
	}
}

//Database and server connection
dbConnSeq
	.sync({ alter: true, logging: false })
	.then(() => {
		console.log(`Database is connected and synced.`);
		const port: number = process.env.PORT ? +process.env.PORT : 3000;
		app.listen(port, async () => {
			console.log('----------------------------------------------------------');
			console.log(`Server is running on ${port}`);
			console.log('Time : ' + new Date());
			console.log('----------------------------------------------------------');
		});
	})
	.catch((err) => {
		console.error('Error-> ', err);
	});

app.use(express.json());

//Handling routes
app.use('/api/v1', routes);

//Handling errors
['uncaughtException', 'unhandledRejection'].forEach((event) =>
	process.on(event, (err) => {
		console.error(`Something bad happend! event: ${event}, msg: ${err.stack || err}`);
	})
);
