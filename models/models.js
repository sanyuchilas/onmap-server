const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: DataTypes.STRING, unique: true},
  name: {type: DataTypes.STRING},
  password: {type: DataTypes.STRING},
  role: {type: DataTypes.STRING, defaultValue: 'USER'},
  avatar: {type: DataTypes.STRING, defaultValue: null},
  friends: {type: DataTypes.STRING, defaultValue: '[]'}
})

const Comrades = sequelize.define('comrades', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  comradeId: {type: DataTypes.STRING, defaultValue: '[]'}
})

const Placemark = sequelize.define('placemark', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  coordinates: {type: DataTypes.STRING, allowNull: false},
  icon: {type: DataTypes.STRING},
  short_description: {type: DataTypes.STRING, defaultValue: 'Описание отсутствует'},
  full_description: {type: DataTypes.STRING, defaultValue: 'Описание отсутствует'},
  images: {type: DataTypes.STRING, defaultValue: '[]'},
  videos: {type: DataTypes.STRING, defaultValue: '[]'},
  select_friends: {type: DataTypes.STRING, defaultValue: '[]'},
})

module.exports = {
  User, Comrades, Placemark
}

User.hasOne(Comrades)
Comrades.belongsTo(User)

User.hasMany(Placemark)
Placemark.belongsTo(User)