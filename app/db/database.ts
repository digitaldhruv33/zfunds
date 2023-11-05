// database.ts
import { Sequelize } from 'sequelize-typescript';

import dotenv from 'dotenv';
import models from './models/index';

dotenv.config();
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
const dbConnSeq = new Sequelize({
	database: DB_NAME,
	dialect: 'postgres',
	username: DB_USER,
	password: DB_PASSWORD,
	models,
	host: DB_HOST,
	port: Number(DB_PORT),
	logging: false,
});

export default dbConnSeq;
