import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';

const DiseaseResult = sequelize.define('DiseaseResult', {
  crop: DataTypes.STRING,
  imageUrl: DataTypes.STRING,
  result: DataTypes.JSON,
});

DiseaseResult.belongsTo(User, { foreignKey: { name: 'userId', field: 'UserId' }, onDelete: 'CASCADE' });
User.hasMany(DiseaseResult);

export default DiseaseResult;
