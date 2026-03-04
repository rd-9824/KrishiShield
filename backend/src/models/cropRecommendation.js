import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';

const CropRecommendation = sequelize.define('CropRecommendation', {
  nitrogen: DataTypes.FLOAT,
  phosphorus: DataTypes.FLOAT,
  potassium: DataTypes.FLOAT,
  ph: DataTypes.FLOAT,
  rainfall: DataTypes.FLOAT,
  result: DataTypes.JSON,
});

CropRecommendation.belongsTo(User, { onDelete: 'CASCADE' });
User.hasMany(CropRecommendation);

export default CropRecommendation;
