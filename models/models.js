const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: DataTypes.STRING, unique: true},
  name: {type: DataTypes.STRING},
  password: {type: DataTypes.STRING},
  role: {type: DataTypes.STRING, defaultValue: 'USER'},
  avatar: {type: DataTypes.STRING, defaultValue: ''},
  friends: {type: DataTypes.STRING, defaultValue: JSON.stringify([])}
})

const Comrades = sequelize.define('comrades', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  comradeId: {type: DataTypes.STRING, defaultValue: JSON.stringify([])}
})

const AddFriends = sequelize.define('addfriends', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  friendId: {type: DataTypes.STRING, defaultValue: JSON.stringify([])}
})

const PlacemarkPrivate = sequelize.define('placemarkprivate', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  coordinates: {type: DataTypes.STRING, allowNull: false},
  icon: {type: DataTypes.STRING},
  short_description: {type: DataTypes.STRING, defaultValue: 'Описание отсутствует'},
  full_description: {type: DataTypes.STRING, defaultValue: 'Описание отсутствует'},
  files: {type: DataTypes.STRING, defaultValue: JSON.stringify([])},
})

const Placemark = sequelize.define('placemark', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  coordinates: {type: DataTypes.STRING, allowNull: false},
  icon: {type: DataTypes.STRING},
  model: {type: DataTypes.STRING, defaultValue: ''},
})

const PlacemarkFriend = sequelize.define('placemarkfriend', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  placemarks: {type: DataTypes.STRING, defaultValue: JSON.stringify([])}
})

module.exports = {
  User, Comrades, Placemark, AddFriends, PlacemarkPrivate, PlacemarkFriend
}

User.hasOne(Comrades)
Comrades.belongsTo(User)

User.hasOne(PlacemarkFriend)
PlacemarkFriend.belongsTo(User)

User.hasOne(AddFriends)
AddFriends.belongsTo(User)

User.hasMany(PlacemarkPrivate)
PlacemarkPrivate.belongsTo(User)