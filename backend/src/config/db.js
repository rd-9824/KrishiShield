import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:./database.sqlite';

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
});

export default sequelize;
